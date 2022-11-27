import { ChannelType, Client, EmbedBuilder, TextChannel } from 'discord.js';
import Snoowrap, { Submission } from 'snoowrap';
import { Logger } from '../logs/logger';
import prettyMilliseconds from 'pretty-ms';
import { ClientConfiguration } from '../configurations/configuration';

export class RedditService {
  private readonly EMBED_TIMEOUT = 2000;

  constructor(
    private discord: Client,
    private configuration: ClientConfiguration
  ) {}

  sendSubmissionsToChannels() {
    getTextChannels(this.discord).forEach(this.sendSubmissionsToChannel);
  }

  async sendSubmissionsToChannel(channel: TextChannel) {
    try {
      if (channel.topic == null) return;
      if (channel.topic.trimEnd().includes(' ')) return;

      const reddit = new Snoowrap({
        userAgent: this.configuration.reddit.userAgent,
        clientId: this.configuration.reddit.clientId,
        clientSecret: this.configuration.reddit.clientSecret,
        refreshToken: this.configuration.reddit.refreshToken,
      });

      const subreddit = reddit.getSubreddit(channel.topic);
      const submissions = await subreddit.getTop({
        time: this.configuration.reddit.post.time,
        limit: this.configuration.reddit.post.limit,
      });

      submissions.forEach((submission) =>
        this.sendSubmissionToChannel(channel, submission)
      );
    } catch (error) {
      Logger.error(error);
      this.sendEmbedError(channel);
    }
  }

  async sendEmbedError(channel: TextChannel) {
    const description = `Le reddit /r/${channel.topic} ne semble pas disponible`;
    await channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(this.configuration.ui.embedColor)
          .setTitle(channel.topic)
          .setDescription(description)
          .setURL(`${this.configuration.reddit.serviceUrl}/r/${channel.topic}`),
      ],
    });
  }

  private async sendSubmissionToChannel(channel: TextChannel, submission: any) {
    Logger.verbose(`Start of sending post: ${submission.title}`);
    try {
      submission.title = `**${submission.title}**`;

      if (submission.is_gallery)
        return await this.sendSubmissionAsGallery(channel, submission);

      if (this.IsUrlAnImage(submission.url))
        return await this.sendSubmissionAsImage(channel, submission);

      if (submission.is_video)
        return await this.sendSubmissionAsVideo(channel, submission);

      if (submission.selftext !== '')
        return await this.sendSubmissionAsContentText(channel, submission);

      await this.sendSubmissionAsText(channel, submission);
    } catch (error) {
      Logger.error(error);
    }
  }

  private async sendSubmissionAsText(
    channel: TextChannel,
    submission: Submission
  ) {
    if (submission.over_18 || submission.spoiler)
      submission.url = `|| ${submission.url} ||`;
    await channel.send(`${submission.title}\n${submission.url}`);
  }

  private async sendSubmissionAsContentText(
    channel: TextChannel,
    submission: Submission
  ) {
    if (
      submission.over_18 ||
      submission.spoiler ||
      submission.selftext.length > 2000
    )
      return await this.sendSubmissionAsText(channel, submission);

    const message = await channel.send(
      `${submission.title}\n${
        this.configuration.reddit.serviceUrl + submission.permalink
      }` +
        '\n```md\n' +
        submission.selftext +
        '\n```'
    );

    setTimeout(async () => await message.suppressEmbeds(), this.EMBED_TIMEOUT);
  }

  private async sendSubmissionAsVideo(
    channel: TextChannel,
    submission: Submission
  ) {
    submission.url =
      this.configuration.reddit.serviceUrl + submission.permalink;
    if (submission.over_18 || submission.spoiler)
      submission.url = `|| ${submission.url} ||`;
    await channel.send(`${submission.title}\n${submission.url}`);
  }

  private async sendSubmissionAsGallery(channel: TextChannel, submission: any) {
    try {
      const files = [];
      for (const item of submission.gallery_data.items) {
        const media = submission.media_metadata[item.media_id];
        const attachment = media.s.u;
        const file = {
          attachment: attachment,
          name:
            submission.over_18 || submission.spoiler
              ? `SPOILER_${item.media_id}.${media.m.split('/').pop()}`
              : `${item.media_id}.${media.m.split('/').pop()}`,
        };
        files.push(file);
      }
      const message = await channel.send({
        content: `${submission.title}\n${
          this.configuration.reddit.serviceUrl + submission.permalink
        }`,
        files: files,
      });

      setTimeout(
        async () => await message.suppressEmbeds(),
        this.EMBED_TIMEOUT
      );
    } catch (error) {
      await this.sendSubmissionAsText(channel, submission);
    }
  }

  private async sendSubmissionAsImage(
    channel: TextChannel,
    submission: Submission
  ) {
    if (await this.isImageSizeBiggerThan8Mb(submission.url))
      return await this.sendSubmissionAsText(channel, submission);

    const file = {
      attachment: submission.url,
      name:
        submission.over_18 || submission.spoiler
          ? `SPOILER_${submission.id}.${this.getExtension(submission.url)}`
          : `${submission.id}.${this.getExtension(submission.url)}`,
    };

    const message = await channel.send({
      content: `${submission.title}\n${
        this.configuration.reddit.serviceUrl + submission.permalink
      }`,
      files: [file],
    });

    setTimeout(async () => await message.suppressEmbeds(), this.EMBED_TIMEOUT);
  }

  private async isImageSizeBiggerThan8Mb(urlImage: string) {
    const response = await fetch(urlImage);
    const imageSize = Number(response.headers.get('content-length'));
    return imageSize > 8000000;
  }

  private IsUrlAnImage(url: string) {
    const extension = this.getExtension(url);
    if (!extension) return false;

    const extensions = ['jpg', 'jpeg', 'png', 'gif'];
    return extensions.includes(extension);
  }

  private getExtension(url: string) {
    return url.split('.').pop();
  }
}

const sendStats = async (
  discord: Client,
  configuration: ClientConfiguration,
  timeTaken: number
) => {
  Logger.info('Sending statistics to discord channel');
  try {
    const redditChannel = getTextChannels(discord).find(
      (channel) => channel.name === 'reddit'
    );

    if (redditChannel == null) return;
    const prettyMs = prettyMilliseconds(timeTaken);
    const embed = new EmbedBuilder()
      .setColor(configuration.ui.embedColor)
      .setTitle(`📊 Finished sending posts successfully in ${prettyMs}!`);

    await redditChannel.send({ embeds: [embed] });
  } catch (error) {
    Logger.error(error);
  }
};

const getTextChannels = (discord: Client) => {
  return discord.channels.cache
    .filter((channel) => channel.type == ChannelType.GuildText)
    .map((x) => x as TextChannel)
    .sort((a, b) => a.rawPosition - b.rawPosition);
};
