import axios from 'axios';
import { TextChannel } from 'discord.js';
import { Submission } from 'snoowrap';
import { RedditConfiguration } from '../../models/configuration';

export async function sendSubmissionAsImage(
  channel: TextChannel,
  submission: Submission,
  redditConfiguration: RedditConfiguration
): Promise<void> {
  if (await isImageSizeBiggerThan8Mb(submission.url)) {
    throw new Error('Image size is bigger than 8Mb');
  }

  const extension = submission.url.split('.').pop();
  const name =
    submission.over_18 || submission.spoiler
      ? `SPOILER_${submission.id}.${extension}`
      : `${submission.id}.${extension}`;

  const content = `${submission.title}\n${
    redditConfiguration.serviceUrl + submission.permalink
  }`;

  const files = [{ attachment: submission.url, name }];
  const message = await channel.send({ content, files });

  setTimeout(
    async () => await message.suppressEmbeds(),
    redditConfiguration.embedTimeout
  );
}

async function isImageSizeBiggerThan8Mb(urlImage: string): Promise<boolean> {
  const response = await axios.get(urlImage);
  const imageSize = +response.headers['Content-Length'];
  return imageSize > 8000000;
}
