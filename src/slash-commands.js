import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { SlashCommandBuilder } from "@discordjs/builders";
import dotenv from "dotenv";

dotenv.config();
const { DISCORD_API_KEY, DISCORD_CLIENT_ID, DISCORD_GUILD_ID } = process.env;

const pull = new SlashCommandBuilder()
    .setName("pull")
    .setDescription("Ping the server of the bot");

const ping = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pull the reddit submissions for the current channel");

const restart = new SlashCommandBuilder()
    .setName("restart")
    .setDescription("Restart the reddit submissions");

const commands = [pull, ping, restart];
const rest = new REST({ version: "9" }).setToken(DISCORD_API_KEY);

async function updateSlashCommands() {
    console.log("Started refreshing application (/) commands.");

    const options = { body: commands };
    await rest.put(
        Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID),
        options
    );

    console.log("Successfully reloaded application (/) commands.");
}

updateSlashCommands();
