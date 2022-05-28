import { Client } from "discord.js";
import { Logger } from "../loggers/log";
import chalk from "chalk";
import { cronTasks } from "../cron/tasks";
import { updateCommands } from "../commands/update";

export function ready(client: Client) {
  if (!client.user || !client.application) return;
  Logger.info(`Logged in as ${chalk.bold.whiteBright(client.user.tag)}!`);

  updateCommands(client);
  cronTasks.forEach((cronTask) => cronTask(client));
}
