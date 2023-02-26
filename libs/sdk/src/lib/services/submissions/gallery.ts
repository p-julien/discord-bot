import { TextChannel } from 'discord.js';
import { RedditConfiguration } from '../../models/configuration';
import { Submission } from '../../models/submission';

export async function sendSubmissionAsGallery(
  channel: TextChannel,
  submission: Submission,
  redditConfiguration: RedditConfiguration
): Promise<void> {
  const files = [];
  for (const item of submission.gallery_data.items) {
    const media = submission.media_metadata[item.media_id];
    const attachment = media.s.u;
    const name =
      submission.over_18 || submission.spoiler
        ? `SPOILER_${item.media_id}.${media.m.split('/').pop()}`
        : `${item.media_id}.${media.m.split('/').pop()}`;

    files.push({ attachment, name });
  }

  const content = `${submission.title}\n${
    redditConfiguration.serviceUrl + submission.permalink
  }`;
  const message = await channel.send({ content, files });

  setTimeout(
    async () => await message.suppressEmbeds(),
    redditConfiguration.embedTimeout
  );
}
