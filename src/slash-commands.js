import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { SlashCommandBuilder } from "@discordjs/builders";
import dotenv from "dotenv";

dotenv.config();

const commands = [];
// const commandFiles = fs
//     .readdirSync("./commands")
//     .filter((file) => file.endsWith(".js"));

// Place your client and guild ids here
const clientId = "939621214513692733";
const guildId = "939616453718581326";

// for (const file of commandFiles) {
//     const command = require(`./commands/${file}`);
//     commands.push(command.data.toJSON());
// }

commands.push(
    new SlashCommandBuilder()
        .setName("pull")
        .setDescription("Pull the reddit submissions for the current channel")
);

const token =
    process.env.PROD === "true"
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
