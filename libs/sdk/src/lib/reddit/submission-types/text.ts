import { SubmissionData, SubmissionResult } from '../models/submission';

export async function sendSubmissionAsText({
  channel,
  submission,
}: SubmissionData): Promise<SubmissionResult> {
  console.debug(
    `💬 [${channel.name}] - [${submission.title}] - [${submission.url}]`
  );

  if (submission.over_18 || submission.spoiler) {
    submission.url = `|| ${submission.url} ||`;
  }

  await channel.send(`**${submission.title}**\n${submission.url}`);

  return SubmissionResult.Success;
}
