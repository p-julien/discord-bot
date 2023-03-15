import { TextChannel } from 'discord.js';
import { Submission } from 'snoowrap';
import { RedditConfiguration } from '../../models/configuration';

export async function sendSubmissionAsGallery(
  channel: TextChannel,
  submission: Submission,
  configuration: RedditConfiguration
): Promise<void> {
  console.debug(
    `🖼️🖼️🖼️  [${channel.name}] - [${submission.title}] - [${submission.url}]`
  );

  // get the media metadata
  // const mediaMetadata = await submission.media;

  // const files = [];
  // for (const item of submission.gallery_data.items) {
  //   const media = submission.media_metadata[item.media_id];
  //   const attachment = media.s.u;
  //   const name =
  //     submission.over_18 || submission.spoiler
  //       ? `SPOILER_${item.media_id}.${media.m.split('/').pop()}`
  //       : `${item.media_id}.${media.m.split('/').pop()}`;

  //   files.push({ attachment, name });
  // }

  // const content = `${submission.title}\n${
  //   configuration.serviceUrl + submission.permalink
  // }`;
  // const message = await channel.send({ content, files });

  // setTimeout(message.suppressEmbeds, configuration.embedTimeout);
}
