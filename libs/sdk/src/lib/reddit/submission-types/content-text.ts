import { SubmissionData, SubmissionResult } from '../models/submission';

export async function sendSubmissionAsContentText({
  channel,
  configuration,
  submission,
}: SubmissionData): Promise<SubmissionResult> {
  console.debug(
    `📝 [${channel.name}] - [${submission.title}] - [${submission.url}]`
  );

  if (submission.over_18 || submission.spoiler) {
    console.warn('⚠️ Submission is NSFW or Spoiler');
    return SubmissionResult.Error;
  }

  if (submission.selftext.length > 2000) {
    console.warn('⚠️ Submission has more than 2000 characters');
    return SubmissionResult.Error;
  }

  const title = `**${submission.title}**\n${configuration.reddit.serviceUrl}${submission.permalink}`;
  const selftext = '```md\n' + submission.selftext + '\n```';
  const message = await channel.send(`${title}\n${selftext}`);

  setTimeout(() => message.suppressEmbeds(), configuration.reddit.embedTimeout);

  return SubmissionResult.Success;
}
