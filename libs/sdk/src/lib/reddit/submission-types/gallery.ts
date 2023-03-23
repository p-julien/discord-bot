import { Message } from 'discord.js';
import { Submission } from 'snoowrap';
import { SubmissionData } from '../models/submission';

export async function sendSubmissionAsGallery({
  channel,
  submission,
}: SubmissionData): Promise<Message> {
  console.debug(
    `🖼️🖼️🖼️  [${channel.name}] - [${submission.title}] - [${submission.url}]`
  );

  return await channel.send({
    content: `**${submission.title}**`,
    files: getFiles(submission),
  });
}

function getFiles(submission: Submission) {
  const files = [];

  for (const item of submission['gallery_data'].items) {
    if (files.length >= 10) {
      break;
    }

    const media = submission['media_metadata'][item.media_id];
    const attachment = media.s.u;

    const name =
      submission.over_18 || submission.spoiler
        ? `SPOILER_${item.media_id}.${media.m.split('/').pop()}`
        : `${item.media_id}.${media.m.split('/').pop()}`;

    files.push({ attachment, name });
  }

  return files;
}
