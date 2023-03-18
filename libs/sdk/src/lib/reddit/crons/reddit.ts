import { Client } from 'discord.js';
import { schedule } from 'node-cron';
import { configuration } from '../../shared/configurations/sdk-configuration';
import { CronTask } from '../../shared/models/cron-task';
import { RedditService } from '../services/reddit.service';

export class ScheduleRedditSubmissions implements CronTask {
  constructor(private client: Client) {}

  execute(): void {
    const reddit = new RedditService(this.client);
    const { cron } = configuration.reddit;
    schedule(cron, () => reddit.sendSubmissionsToChannels());
  }
}
