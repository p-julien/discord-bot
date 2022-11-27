import chalk from 'chalk';
import { Client } from 'discord.js';
import { ClientConfiguration } from '../configurations/configuration';
import { getCronTasks } from '../crons/tasks';
import { Logger } from '../logs/logger';

export const ready = (client: Client, configuration: ClientConfiguration) => {
  if (!client.user || !client.application) return;
  Logger.info(`Logged in as ${chalk.bold.whiteBright(client.user.tag)}!`);

  const cronTasks = getCronTasks(client, configuration);
  cronTasks.forEach((cronTask) => cronTask.execute());
};
