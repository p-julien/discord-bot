import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  Interaction,
} from 'discord.js';
import { Logger } from '../logs/logger';
import chalk from 'chalk';
import { ClientConfiguration } from '../configurations/configuration';
import { getCommands } from '../commands/commands';

export const interactionCreate = async (
  configuration: ClientConfiguration,
  interaction: Interaction
) => {
  if (!interaction.isChatInputCommand()) return;
  await handleSlashCommand(configuration, interaction);
};

const handleSlashCommand = async (
  configuration: ClientConfiguration,
  interaction: ChatInputCommandInteraction
) => {
  try {
    const command = getCommands(interaction.client, configuration).find(
      (command) => command.name === interaction.commandName
    );

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

    Logger.info(
      `${chalk.whiteBright.bold(
        interaction.user.username
      )} asked for the command ${chalk.whiteBright.bold(
        interaction.commandName
      )}`
    );

    command.run(interaction);
  } catch (error) {
    Logger.error(
      `An error occured while responding to the command: ${interaction.commandName}`
    );
  }
};
