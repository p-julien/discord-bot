import { Client, MessageEmbed, TextChannel } from "discord.js";
import prettyMilliseconds from "pretty-ms";
import Snoowrap, { Submission } from "snoowrap";
import fetch from "node-fetch";
import { Logger } from "./loggers/log";
import chalk from "chalk";
import { getTextChannels } from "./discord";

export class Reddit {
  private readonly URL_REDDIT = "https://www.reddit.com";
  private readonly EMBED_TIMEOUT = 1000;
  private r = new Snoowrap({
    userAgent: "burgerexpress:v1.0.0 (by /u/href404)",
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    refreshToken: process.env.REDDIT_REFRESH_TOKEN,
  });

  constructor(private discord: Client) {}

  async sendSubmissionsToChannels() {
    Logger.verbose("Start of sending posts...");
    try {
      const startTime = performance.now();
      const channels = getTextChannels(this.discord);

      for (const channel of channels)
        await this.sendSubmissionsToChannel(channel);

      const timeTaken = performance.now() - startTime;
      await this.sendStats(timeTaken);
    } catch (error) {
      Logger.error(error);
    }
  }

  async sendSubmissionsToChannel(channel: TextChannel) {
    Logger.info(
      `Start of sending posts on channel ${chalk.whiteBright.bold(
        channel.name
      )} [topic: ${chalk.whiteBright.bold(channel.topic)}]`
    );
    try {
      if (channel.topic == null) return;

      const subreddit = this.r.getSubreddit(channel.topic);
      if (subreddit == null) return;

      const submissions = await subreddit.getTop({
        time: "day",
        limit: 3,
      });

      for (const submission of submissions)
        await this.sendSubmissionToChannel(channel, submission);
    } catch (error) {
      Logger.error(error);
      await channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("#E6742B")
            .setTitle(channel.topic!)
            .setDescription(
              `Le reddit /r/${channel.topic} ne semble pas disponible`
            )
            .setURL(`${this.URL_REDDIT}/r/${channel.topic}`),
        ],
      });
    }
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

      if (submission.selftext !== "")
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
    Logger.verbose(`Sending post as default...`);
    if (submission.over_18 || submission.spoiler)
      submission.url = `|| ${submission.url} ||`;
    await channel.send(`${submission.title}\n${submission.url}`);
  }

  private async sendSubmissionAsContentText(
    channel: TextChannel,
    submission: Submission
  ) {
    Logger.verbose(`Sending post as content text...`);
    if (
      submission.over_18 ||
      submission.spoiler ||
      submission.selftext.length > 2000
    )
      return await this.sendSubmissionAsText(channel, submission);

    const message = await channel.send(
      `${submission.title}\n${this.URL_REDDIT + submission.permalink}` +
        "\n```md\n" +
        submission.selftext +
        "\n```"
    );

    setTimeout(async () => await message.suppressEmbeds(), this.EMBED_TIMEOUT);
  }

  private async sendSubmissionAsVideo(
    channel: TextChannel,
    submission: Submission
  ) {
    Logger.verbose(`Sending post as video...`);
    submission.url = this.URL_REDDIT + submission.permalink;
    if (submission.over_18 || submission.spoiler)
      submission.url = `|| ${submission.url} ||`;
    await channel.send(`${submission.title}\n${submission.url}`);
  }

  private async sendSubmissionAsGallery(channel: TextChannel, submission: any) {
    Logger.verbose(`Sending post as gallery...`);
    try {
      const files = [];
      for (const item of submission.gallery_data.items) {
        const media = submission.media_metadata[item.media_id];
        const attachment = media.s.u;
        const file = {
          attachment: attachment,
          name:
            submission.over_18 || submission.spoiler
              ? `SPOILER_${item.media_id}.${media.m.split("/").pop()}`
              : `${item.media_id}.${media.m.split("/").pop()}`,
        };
        files.push(file);
      }
      const message = await channel.send({
        content: `${submission.title}\n${
          this.URL_REDDIT + submission.permalink
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
    Logger.verbose(`Sending post as image...`);
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
      content: `${submission.title}\n${this.URL_REDDIT + submission.permalink}`,
      files: [file],
    });

    setTimeout(async () => await message.suppressEmbeds(), this.EMBED_TIMEOUT);
  }

  private async isImageSizeBiggerThan8Mb(urlImage: string) {
    const response = await fetch(urlImage);
    const imageSize = Number(response.headers.get("content-length"));
    return imageSize > 8000000;
  }

  private IsUrlAnImage(url: string) {
    const extension = this.getExtension(url);
    if (!extension) return false;

    const extensions = ["jpg", "jpeg", "png", "gif"];
    return extensions.includes(extension);
  }

  private getExtension(url: string) {
    return url.split(".").pop();
  }

  private async sendStats(timeTaken: number) {
    Logger.info("Sending statistics to discord channel");
    try {
      const redditChannel = getTextChannels(this.discord).find(
        (channel) => channel.name === "reddit"
      );

      if (redditChannel == null) return;
      const prettyMs = prettyMilliseconds(timeTaken);
      const embed = new MessageEmbed()
        .setColor("#E6742B")
        .setTitle(`📊 Finished sending posts successfully in ${prettyMs}!`);

      await redditChannel.send({ embeds: [embed] });
    } catch (error) {
      Logger.error(error);
    }
  }
}
