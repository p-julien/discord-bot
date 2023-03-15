import { TextChannel } from 'discord.js';
import { Submission } from 'snoowrap';
import { RedditConfiguration } from '../../models/configuration';

export async function sendSubmissionAsVideo(
  channel: TextChannel,
  submission: Submission,
  redditConfiguration: RedditConfiguration
): Promise<void> {
  console.debug(
    `🎬  [${channel.name}] - [${submission.title}] - [${submission.url}]`
  );

  submission.url = redditConfiguration.serviceUrl + submission.permalink;

  if (submission.over_18 || submission.spoiler) {
    submission.url = `|| ${submission.url} ||`;
  }

  await channel.send(`**${submission.title}**\n${submission.url}`);
}
