import { Client, Interaction } from "discord.js";
import dotenv from "dotenv";
import { DiscordEvent } from "./enums/discord-event";
import { interactionCreate } from "./listeners/interaction-create";
import { ready } from "./listeners/ready";
import { Logger } from "./loggers/log";

dotenv.config();
const client = new Client({ intents: ["GUILDS"] });

client.on(DiscordEvent.Ready, async () => await ready(client));

client.on(
    DiscordEvent.InteractionCreate,
    async (interaction: Interaction) =>
        await interactionCreate(client, interaction)
);

client.login(process.env.DISCORD_API_KEY);
