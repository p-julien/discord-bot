import { Client } from "discord.js";
import dotenv from "dotenv";
import { interactionCreate } from "./listeners/interaction-create";
import { ready } from "./listeners/ready";

dotenv.config();
console.log("Bot is starting...");

const client = new Client({ intents: [] });

ready(client);
interactionCreate(client);

client.login(process.env.DISCORD_API_KEY);
