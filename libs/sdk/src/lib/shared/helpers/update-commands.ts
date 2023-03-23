import { Client, ApplicationCommandData } from 'discord.js';
import { Advice } from '../../advices/advice.command';
import { Ping } from '../../ping/ping.command';
import { Pull } from '../../reddit/commands/pull.command';
import { Restart } from '../../reddit/commands/restart.command';
import { Location } from '../../locations/location.command';
import { Version } from '../../version/version.command';
import { configuration } from '../configurations/sdk-configuration';

/**
 * https://stackoverflow.com/questions/70167100/discord-js-v13-slash-commands-are-duplicated
 */
export async function updateCommands(discord: Client) {
  console.log(`🔃 Updating commands...`);

  try {
    const { guildId } = configuration.discord;

    const guild = await discord.guilds.fetch(guildId);

    await guild.commands.set([]);

    const commands: ApplicationCommandData[] = getCommands(discord);

    await guild.commands.set(commands);

    console.log(`✅ Commands updated!`);
  } catch (error) {
    console.error(`❌ Error updating commands: ${error.message}`);
  }
}

export function getCommands(discord: Client) {
  return [
    new Ping(discord),
    new Advice(),
    new Pull(discord),
    new Restart(discord),
    new Location(discord),
    new Version(),
  ];
}
