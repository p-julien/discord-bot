import { Client } from "discord.js";
import { Logger } from "../loggers/log";
import { chatCommands, userCommands } from "../commands";
import chalk from "chalk";
import { Reddit } from "../reddit";
import { schedule } from "node-cron";

export async function ready(client: Client) {
    if (!client.user || !client.application) return;

    scheduleRedditSubmissions(client);
    updateCommands(client);

    Logger.info(`Logged in as ${chalk.bold.whiteBright(client.user.tag)}!`);
}

function scheduleRedditSubmissions(client: Client) {
    const cronExpression = "0 20 * * *";
    const reddit = new Reddit(client);
    schedule(
        cronExpression,
        async () => await reddit.sendSubmissionsToChannels()
    );
}

/**
 * https://stackoverflow.com/questions/70167100/discord-js-v13-slash-commands-are-duplicated
 */
function updateCommands(discord: Client) {
    const guildId = process.env.DISCORD_GUILD_ID;
    if (guildId == null) return;
    const guild = discord.guilds.cache.get(guildId);

    discord.application?.commands.set([]); // This takes ~1 hour to update
    guild?.commands.set([]); // This updates immediately
    guild?.commands.set([...chatCommands, ...userCommands]);
}
