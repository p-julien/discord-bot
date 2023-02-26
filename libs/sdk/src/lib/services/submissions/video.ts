import { TextChannel } from 'discord.js';
import { Submission } from 'snoowrap';

export async function sendSubmissionAsVideo(
  channel: TextChannel,
  submission: Submission
): Promise<void> {
  submission.url = this.configuration.reddit.serviceUrl + submission.permalink;

  if (submission.over_18 || submission.spoiler) {
    submission.url = `|| ${submission.url} ||`;
  }

  await channel.send(`${submission.title}\n${submission.url}`);
}
