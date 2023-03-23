import { TextChannel } from 'discord.js';
import { Submission } from 'snoowrap';

export type SubmissionType =
  | 'Image'
  | 'Video'
  | 'Gallery'
  | 'Selftext'
  | 'Unknown';

export type SubmissionData = {
  channel: TextChannel;
  submission: Submission;
};
