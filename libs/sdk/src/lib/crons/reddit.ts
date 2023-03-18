import { Client } from 'discord.js';
import { schedule } from 'node-cron';
import { SdkConfiguration } from '../models/configurations/sdk-configuration';
import { CronTask } from '../models/cron-task';
import { RedditService } from '../services/reddit.service';

export class ScheduleRedditSubmissions implements CronTask {
  constructor(
    private client: Client,
    private configuration: SdkConfiguration
  ) {}

  execute(): void {
    const reddit = new RedditService(this.client, this.configuration);
    const { cron } = this.configuration.reddit;
    schedule(cron, () => reddit.sendSubmissionsToChannels());
  }
}
