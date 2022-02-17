import { Client } from "discord.js";
import { Logger } from "../loggers/log";
import { chatCommands, userCommands } from "../commands";
import chalk from "chalk";
import { Reddit } from "../reddit";
import { schedule } from "node-cron";

export async function ready(client: Client) {
    if (!client.user || !client.application) return;

    // Todo: Mettre à jour les commandes sur le serveur
    // const guildCommands = await client.application.commands.fetch();
    // guildCommands.forEach((c) => c.delete());

    await client.application.commands.set([...chatCommands, ...userCommands]);
    schedule(
        "0 20 * * *",
        async () => await new Reddit(client).sendSubmissionsToChannels()
    );

    Logger.info(`Logged in as ${chalk.bold.whiteBright(client.user.tag)}!`);
}
