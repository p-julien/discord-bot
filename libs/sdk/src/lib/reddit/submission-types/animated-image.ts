import { Message } from 'discord.js';
import { SubmissionData } from '../models/submission';

export async function sendSubmissionAsAnimatedImage({
  channel,
  submission,
}: SubmissionData): Promise<Message> {
  console.debug(
    `🖼️  [${channel.name}] - [${submission.title}] - [${submission.url}]`
  );

  const spoiler = submission.over_18 || submission.spoiler;

  const content = spoiler ? `||${submission.url}||` : submission.url;

  return await channel.send({ content: `🖼️ ${content}` });
}
