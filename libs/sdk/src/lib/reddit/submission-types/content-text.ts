import { Message } from 'discord.js';
import { SubmissionData } from '../models/submission';

export async function sendSubmissionAsContentText({
  channel,
  submission,
  configuration,
}: SubmissionData): Promise<Message> {
  console.debug(
    `📝 [${channel.name}] - [${submission.title}] - [${submission.url}]`
  );

  if (submission.over_18 || submission.spoiler) {
    throw new Error('⚠️ Submission is NSFW or Spoiler');
  }

  if (submission.selftext.length > 2000) {
    throw new Error('⚠️ Submission has more than 2000 characters');
  }

  const url = `${configuration.reddit.serviceUrl}${submission.permalink}`;
  const title = `📝 **${submission.title}**\n${url}`;
  const selftext = '```md\n' + submission.selftext + '\n```';

  return await channel.send(`${title}\n${selftext}`);
}
