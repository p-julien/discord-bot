import { Client } from "discord.js";
import { CommandFactory } from "./commands/command-factory.js";
import { RedditPull } from "./reddit/reddit-pull.js";
import { Logger } from "./utils/log.js";
import dotenv from "dotenv";
import cron from "node-cron";
import chalk from "chalk";

dotenv.config();
const client = new Client();

client.on("ready", async () => {
    Logger.info(`Logged in as ${chalk.bold.whiteBright(client.user.tag)}!`);

    cron.schedule(
        "0 20 * * *",
        async () => {
            const redditPull = new RedditPull(client);
            await redditPull.sendRedditPostsToDiscordChannels();
        },
        { scheduled: true, timezone: "Europe/Paris" }
    );
});

client.ws.on("INTERACTION_CREATE", async (interaction) => {
    try {
        const commandFactory = new CommandFactory(client);
        await commandFactory.getCommand(interaction).run();
    } catch (error) {
        Logger.error(
            `An error occured while responding to the command: ${interaction.data.name}`
        );
    }
});

client.login(process.env.DISCORD_API_KEY).catch((err) => Logger.error(err));
