import { SubmissionData, SubmissionResult } from '../../models/submission';

export async function sendSubmissionAsVideo({
  channel,
  configuration,
  submission,
}: SubmissionData): Promise<SubmissionResult> {
  console.debug(
    `🎬  [${channel.name}] - [${submission.title}] - [${submission.url}]`
  );

  submission.url = configuration.reddit.serviceUrl + submission.permalink;

  if (submission.over_18 || submission.spoiler) {
    submission.url = `|| ${submission.url} ||`;
  }

  await channel.send(`**${submission.title}**\n${submission.url}`);

  return SubmissionResult.Success;
}
