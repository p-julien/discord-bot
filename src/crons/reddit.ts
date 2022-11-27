import { Client } from 'discord.js';
import { schedule } from 'node-cron';
import { ClientConfiguration } from '../configurations/configuration';
import { RedditService } from '../services/reddit.service';
import { CronTask } from './tasks';

export class ScheduleRedditSubmissions implements CronTask {
  constructor(
    private client: Client,
    private configuration: ClientConfiguration
  ) {}

  execute(): void {
    const cronExpression = '0 20 * * *';
    const reddit = new RedditService(this.client, this.configuration);
    schedule(cronExpression, reddit.sendSubmissionsToChannels);
  }
}
