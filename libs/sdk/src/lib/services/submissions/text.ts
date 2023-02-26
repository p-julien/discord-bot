import { TextChannel } from 'discord.js';
import { Submission } from 'snoowrap';

export async function sendSubmissionAsText(
  channel: TextChannel,
  submission: Submission
): Promise<void> {
  if (submission.over_18 || submission.spoiler) {
    submission.url = `|| ${submission.url} ||`;
  }

  await channel.send(`${submission.title}\n${submission.url}`);
}