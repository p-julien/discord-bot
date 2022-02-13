import { Client, Interaction } from "discord.js";
import dotenv from "dotenv";
import { schedule } from "node-cron";
import { DiscordEvent } from "./discord-event";
import { interactionCreate } from "./listeners/interaction-create";
import { ready } from "./listeners/ready";
import { Reddit } from "./reddit/reddit";
import { Logger } from "./utils/log";

dotenv.config();
const client = new Client({ intents: [] });

client.on(DiscordEvent.Ready, async () => {
    schedule("0 20 * * *", async () => {
        const reddit = new Reddit(client);
        await reddit.sendSubmissionsToChannels();
    });
    await ready(client);
});

client.on(
    DiscordEvent.InteractionCreate,
    async (interaction: Interaction) =>
        await interactionCreate(client, interaction)
);

client
    .login(process.env.DISCORD_API_KEY)
    .catch((err: Error) => Logger.error(err));
