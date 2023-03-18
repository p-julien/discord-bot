import { Client } from 'discord.js';
import { BirthdayCron } from '../crons/birthday';
import { ScheduleRedditSubmissions } from '../crons/reddit';
import { SdkConfiguration } from '../models/configurations/sdk-configuration';
import { CronTask } from '../models/cron-task';

export function ready(client: Client, configuration: SdkConfiguration): void {
  if (!client.user || !client.application) {
    return;
  }

  console.log(`🌍 Logged in as ${client.user.tag}!`);

  const crons = getCrons(client, configuration);
  crons.forEach((cronTask) => cronTask.execute());
}

function getCrons(client: Client, configuration: SdkConfiguration): CronTask[] {
  return [
    new ScheduleRedditSubmissions(client, configuration),
    new BirthdayCron(client, configuration),
  ];
}
