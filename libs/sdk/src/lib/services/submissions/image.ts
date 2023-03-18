import axios from 'axios';
import { SubmissionData, SubmissionResult } from '../../models/submission';

export async function sendSubmissionAsImage({
  channel,
  configuration,
  submission,
}: SubmissionData): Promise<SubmissionResult> {
  console.debug(
    `🖼️  [${channel.name}] - [${submission.title}] - [${submission.url}]`
  );

  if (await isImageSizeBiggerThan8Mb(submission.url)) {
    console.warn('⚠️ Image size is bigger than 8Mb');
    return SubmissionResult.Error;
  }

  const extension = submission.url.split('.').pop();
  const spoiler = submission.over_18 || submission.spoiler;

  const name = spoiler
    ? `SPOILER_${submission.id}.${extension}`
    : `${submission.id}.${extension}`;

  const message = await channel.send({
    content: `**${submission.title}**\n${configuration.reddit.serviceUrl}${submission.permalink}`,
    files: [{ attachment: submission.url, name }],
  });

  setTimeout(() => message.suppressEmbeds(), configuration.reddit.embedTimeout);

  return SubmissionResult.Success;
}

async function isImageSizeBiggerThan8Mb(url: string): Promise<boolean> {
  const response = await axios.get(url);
  const imageSize = +response.headers['Content-Length'];
  return imageSize > 8000000;
}
