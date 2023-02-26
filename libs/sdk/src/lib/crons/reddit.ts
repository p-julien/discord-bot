import { Client } from 'discord.js';
import { schedule } from 'node-cron';
import { ClientConfiguration } from '../models/configuration';
import { CronTask } from '../models/cron-task';
import { RedditService } from '../services/reddit.service';

export class ScheduleRedditSubmissions implements CronTask {
  constructor(
    private client: Client,
    private configuration: ClientConfiguration
  ) {}

  execute(): void {
    const reddit = new RedditService(this.client, this.configuration);
    schedule(this.configuration.reddit.cron, reddit.sendSubmissionsToChannels);
  }
}
