import { Client, Interaction } from "discord.js";
import dotenv from "dotenv";
import { interactionCreate } from "./listeners/interaction-create";
import { ready } from "./listeners/ready";

dotenv.config();
const client = new Client({ intents: [] });

client.on("ready", async () => await ready(client));
client.on(
    "interactionCreate",
    async (interaction: Interaction) =>
        await interactionCreate(client, interaction)
);

client.login(process.env.DISCORD_API_KEY);
