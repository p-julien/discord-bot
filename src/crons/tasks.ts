import { Client } from 'discord.js';
import { ClientConfiguration } from '../configurations/configuration';
import { ScheduleRedditSubmissions } from './reddit';

export const getCronTasks = (
  client: Client,
  configuration: ClientConfiguration
) => [new ScheduleRedditSubmissions(client, configuration)];

export interface CronTask {
  execute(): void;
}
