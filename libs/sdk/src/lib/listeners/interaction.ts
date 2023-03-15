import {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  Interaction,
  Message,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import { Advice } from '../commands/advice';
import { Ping } from '../commands/ping';
import { Pull } from '../commands/pull';
import { Restart } from '../commands/restart';
import { Location } from '../commands/location';
import { ClientConfiguration } from '../models/configuration';
import { Command } from '../models/command';

export async function interactionCreate(
  configuration: ClientConfiguration,
  interaction: Interaction
): Promise<void> {
  if (
    interaction.isChatInputCommand() ||
    interaction.isUserContextMenuCommand()
  ) {
    await handleSlashCommand(configuration, interaction);
  }
}

async function handleSlashCommand(
  configuration: ClientConfiguration,
  interaction: ChatInputCommandInteraction | UserContextMenuCommandInteraction
): Promise<Message<boolean>> {
  try {
    const commands = getCommands(interaction.client, configuration);
    const command = commands.find((c) => c.name === interaction.commandName);

    await interaction.deferReply();

    if (!command)
      return interaction.followUp({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(configuration.ui.embedColor)
            .setTitle("Sorry this command doesn't exists 😕"),
        ],
      });

    console.info(
      `🆗 ${interaction.user.username} asked for the command ${interaction.commandName}`
    );

    command.run(interaction);
  } catch (error) {
    console.error(
      `❌ An error occured while responding to the command: ${interaction.commandName}`
    );
  }
}

export function getCommands(
  discord: Client,
  configuration: ClientConfiguration
): Command[] {
  return [
    new Ping(discord, configuration),
    new Advice(configuration),
    new Pull(discord, configuration),
    new Restart(discord, configuration),
    new Location(discord, configuration),
  ];
}
