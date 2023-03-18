import { TextChannel } from 'discord.js';
import { Submission } from 'snoowrap';
import { SdkConfiguration } from './configurations/sdk-configuration';

export type SubmissionType =
  | 'Image'
  | 'Video'
  | 'Gallery'
  | 'Selftext'
  | 'Unknown';

export type SubmissionData = {
  channel: TextChannel;
  submission: Submission;
  configuration: SdkConfiguration;
};

export enum SubmissionResult {
  Success,
  Error,
}
