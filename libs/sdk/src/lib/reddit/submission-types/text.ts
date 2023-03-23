import { Message } from 'discord.js';
import { SubmissionData } from '../models/submission';

export async function sendSubmissionAsText({
  channel,
  submission,
}: SubmissionData): Promise<Message> {
  console.debug(
    `💬 [${channel.name}] - [${submission.title}] - [${submission.url}]`
  );

  if (submission.over_18 || submission.spoiler) {
    submission.url = `|| ${submission.url} ||`;
  }

  return await channel.send(`**${submission.title}**`);
}
