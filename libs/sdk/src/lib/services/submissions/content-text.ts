import { TextChannel } from 'discord.js';
import { Submission } from 'snoowrap';
import { RedditConfiguration } from '../../models/configuration';

export async function sendSubmissionAsContentText(
  channel: TextChannel,
  submission: Submission,
  configuration: RedditConfiguration
): Promise<void> {
  console.debug(
    `📝 [${channel.name}] - [${submission.title}] - [${submission.url}]`
  );

  if (submission.over_18 || submission.spoiler) {
    throw new Error('Submission is NSFW or Spoiler');
  }

  if (submission.selftext.length > 2000) {
    throw new Error('Submission has more than 2000 characters');
  }

  const title = `**${submission.title}**\n${configuration.serviceUrl}${submission.permalink}`;
  const selftext = '```md\n' + submission.selftext + '\n```';
  const message = await channel.send(`${title}\n${selftext}`);

  setTimeout(() => message.suppressEmbeds(), configuration.embedTimeout);
}
