import { TextChannel } from 'discord.js';
import { Submission } from 'snoowrap';
import { SdkConfiguration } from '../../shared/configurations/sdk-configuration';

export type SubmissionType =
  | 'Image'
  | 'AnimatedImage'
  | 'Video'
  | 'Gallery'
  | 'Selftext'
  | 'Unknown';

export type SubmissionData = {
  channel: TextChannel;
  submission: Submission;
  configuration: SdkConfiguration;
};
