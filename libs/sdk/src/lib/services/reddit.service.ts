import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import Snoowrap = require('snoowrap');
import { getDiscordTextChannels } from '../helpers/discord-channels';
import { isUrlAnImage } from '../helpers/url-image';
import { ClientConfiguration } from '../models/configuration';
import { Submission } from '../models/submission';
import { sendSubmissionAsContentText } from './submissions/content-text';
import { sendSubmissionAsGallery } from './submissions/gallery';
import { sendSubmissionAsImage } from './submissions/image';
import { sendStats } from './submissions/stats';
import { sendSubmissionAsText } from './submissions/text';
import { sendSubmissionAsVideo } from './submissions/video';

export class RedditService {
  constructor(
    private discord: Client,
    private configuration: ClientConfiguration
  ) {}

  sendSubmissionsToChannels(): void {
    const startTime = performance.now();
    const channels = getDiscordTextChannels(this.discord);

    channels.forEach((channel) => this.sendSubmissionsToChannel(channel));

    const timeTaken = performance.now() - startTime;
    sendStats(this.discord, this.configuration, timeTaken);
  }

  async sendSubmissionsToChannel(channel: TextChannel): Promise<void> {
    try {
      if (!channel.topic || channel.topic.trimEnd().includes(' ')) {
        return;
      }

      const reddit = new Snoowrap(this.configuration.reddit);
      const subreddit = reddit.getSubreddit(channel.topic);
      const options = this.configuration.reddit.post;
      const submissions = await subreddit.getTop(options);

      submissions.forEach((submission: Submission) =>
        this.sendSubmissionToChannel(channel, submission)
      );
    } catch (error) {
      console.error(error);
      this.sendEmbedError(channel);
    }
  }

  private async sendSubmissionToChannel(
    channel: TextChannel,
    submission: Submission
  ): Promise<void> {
    console.debug(`Start of sending post: ${submission.title}`);

    try {
      submission.title = `**${submission.title}**`;
      const { reddit } = this.configuration;

      if (submission.is_gallery)
        return await sendSubmissionAsGallery(channel, submission, reddit);

      if (isUrlAnImage(submission.url))
        return await sendSubmissionAsImage(channel, submission, reddit);

      if (submission.is_video)
        return await sendSubmissionAsVideo(channel, submission);

      if (submission.selftext !== '')
        return await sendSubmissionAsContentText(channel, submission, reddit);

      await sendSubmissionAsText(channel, submission);
    } catch (error) {
      await sendSubmissionAsText(channel, submission);
    }
  }

  private async sendEmbedError(channel: TextChannel): Promise<void> {
    const embed = new EmbedBuilder()
      .setColor(this.configuration.ui.embedColor)
      .setTitle(channel.topic)
      .setDescription(`Le reddit /r/${channel.topic} ne semble pas disponible`)
      .setURL(`${this.configuration.reddit.serviceUrl}/r/${channel.topic}`);

    await channel.send({ embeds: [embed] });
  }
}