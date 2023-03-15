import { Client } from 'discord.js';
import { BirthdayCron } from '../crons/birthday';
import { ScheduleRedditSubmissions } from '../crons/reddit';
import { ClientConfiguration } from '../models/configuration';
import { CronTask } from '../models/cron-task';

export function ready(
  client: Client,
  configuration: ClientConfiguration
): void {
  if (!client.user || !client.application) {
    return;
  }

  console.log(`🌍 Logged in as ${client.user.tag}!`);

  const crons = getCrons(client, configuration);
  crons.forEach((cronTask) => cronTask.execute());
}

function getCrons(
  client: Client,
  configuration: ClientConfiguration
): CronTask[] {
  return [
    new ScheduleRedditSubmissions(client, configuration),
    new BirthdayCron(client, configuration),
  ];
}
