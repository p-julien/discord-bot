import axios from 'axios';
import { Message } from 'discord.js';
import { SubmissionData } from '../models/submission';

export async function sendSubmissionAsImage({
  channel,
  submission,
  configuration,
}: SubmissionData): Promise<Message> {
  console.debug(
    `🖼️  [${channel.name}] - [${submission.title}] - [${submission.url}]`
  );

  if (await isImageSizeBiggerThan8Mb(submission.url)) {
    throw new Error('⚠️ Submission has more than 8MB');
  }

  const extension = submission.url.split('.').pop();
  const spoiler = submission.over_18 || submission.spoiler;

  const name = spoiler
    ? `SPOILER_${submission.id}.${extension}`
    : `${submission.id}.${extension}`;

  const url = `${configuration.reddit.serviceUrl}${submission.permalink}`;

  return await channel.send({
    content: `🖼️ **${submission.title}**\n${url}`,
    files: [{ attachment: submission.url, name }],
  });
}

async function isImageSizeBiggerThan8Mb(url: string): Promise<boolean> {
  const response = await axios.get(url);
  const imageSize = +response.headers['content-length'];
  return imageSize > 8000000;
}
