import { TextChannel } from 'discord.js';
import { Submission } from 'snoowrap';
import { RedditConfiguration } from '../../models/configuration';

export async function sendSubmissionAsContentText(
  channel: TextChannel,
  submission: Submission,
  redditConfiguration: RedditConfiguration
): Promise<void> {
  if (
    submission.over_18 ||
    submission.spoiler ||
    submission.selftext.length > 2000
  ) {
    throw new Error('Submission is over 2000 characters');
  }

  const message = await channel.send(
    `${submission.title}\n${
      redditConfiguration.serviceUrl + submission.permalink
    }` +
      '\n```md\n' +
      submission.selftext +
      '\n```'
  );

  setTimeout(
    async () => await message.suppressEmbeds(),
    redditConfiguration.embedTimeout
  );
}
