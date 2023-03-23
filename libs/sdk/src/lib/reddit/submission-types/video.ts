import { Message } from 'discord.js';
import { SubmissionData } from '../models/submission';

export async function sendSubmissionAsVideo({
  channel,
  submission,
}: SubmissionData): Promise<Message> {
  console.debug(
    `🎬  [${channel.name}] - [${submission.title}] - [${submission.url}]`
  );

  return await channel.send(
    `**${submission.title}**\n${submission.media.reddit_video.fallback_url}`
  );
}
