import axios from 'axios';
import { TextChannel } from 'discord.js';
import { Submission } from 'snoowrap';
import { RedditConfiguration } from '../../models/configuration';

export async function sendSubmissionAsImage(
  channel: TextChannel,
  submission: Submission,
  configuration: RedditConfiguration
): Promise<void> {
  console.debug(
    `🖼️  [${channel.name}] - [${submission.title}] - [${submission.url}]`
  );

  if (await isImageSizeBiggerThan8Mb(submission.url)) {
    throw new Error('Image size is bigger than 8Mb');
  }

  const extension = submission.url.split('.').pop();
  const spoiler = submission.over_18 || submission.spoiler;

  const name = spoiler
    ? `SPOILER_${submission.id}.${extension}`
    : `${submission.id}.${extension}`;

  const message = await channel.send({
    content: `**${submission.title}**\n${configuration.serviceUrl}${submission.permalink}`,
    files: [{ attachment: submission.url, name }],
  });

  setTimeout(() => message.suppressEmbeds(), configuration.embedTimeout);
}

async function isImageSizeBiggerThan8Mb(url: string): Promise<boolean> {
  const response = await axios.get(url);
  const imageSize = +response.headers['Content-Length'];
  return imageSize > 8000000;
}
