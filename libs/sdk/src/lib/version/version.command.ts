import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { ChatCommand } from '../shared/models/command';
import { configuration } from '../shared/configurations/sdk-configuration';

export class Version implements ChatCommand {
  name = 'version';
  description = 'Get the current version of the bot';

  async run(interaction: ChatInputCommandInteraction): Promise<void> {
    const { npm_package_version } = process.env;

    const embed = new EmbedBuilder()
      .setColor(configuration.ui.embedColor)
      .setTitle(`🔖  Bot in ${npm_package_version}`);

    await interaction.reply({ embeds: [embed] });
  }
}
