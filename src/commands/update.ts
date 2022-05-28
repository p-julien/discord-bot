import { Client } from "discord.js";
import { chatCommands, userCommands } from "./commands";

/**
 * https://stackoverflow.com/questions/70167100/discord-js-v13-slash-commands-are-duplicated
 */
export function updateCommands(discord: Client) {
  const guildId = process.env.DISCORD_GUILD_ID;
  if (guildId == null) return;
  const guild = discord.guilds.cache.get(guildId);

  discord.application?.commands.set([]); // This takes ~1 hour to update
  guild?.commands.set([]); // This updates immediately
  guild?.commands.set([...chatCommands, ...userCommands]);
}
