import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { SlashCommandBuilder } from "@discordjs/builders";
import dotenv from "dotenv";

dotenv.config();

const commands = [
    new SlashCommandBuilder()
        .setName("pull")
        .setDescription("Ping the server of the bot"),
    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pull the reddit submissions for the current channel"),
];
// const commandFiles = fs
//     .readdirSync("./commands")
//     .filter((file) => file.endsWith(".js"));

// à récupérer via le .env.debug
const clientId = "939621214513692733";
const guildId = "939616453718581326";

// for (const file of commandFiles) {
//     const command = require(`./commands/${file}`);
//     commands.push(command.data.toJSON());
// }

const token =
    PROD === "true"
        ? process.env.DISCORD_API_KEY_PROD
        : process.env.DISCORD_API_KEY_DEBUG;

const rest = new REST({ version: "9" }).setToken(token);

async function updateSlashCommands() {
    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commands,
        });

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
}

updateSlashCommands();
