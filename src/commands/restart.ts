import { ChatInputCommandInteraction, Client, EmbedBuilder } from 'discord.js';
import { ClientConfiguration } from '../configurations/configuration';
import { RedditService } from '../services/reddit.service';
import { ChatCommand } from './command.interface';

export class Restart implements ChatCommand {
  name = 'restart';
  description = 'Restart the reddit submissions';

  constructor(
    private discord: Client,
    private configuration: ClientConfiguration
  ) {}

  async run(interaction: ChatInputCommandInteraction) {
    const embed = this.getEmbed();
    await interaction.followUp({
      ephemeral: true,
      embeds: [embed],
    });

    new RedditService(
      this.discord,
      this.configuration
    ).sendSubmissionsToChannels();
  }

  private getEmbed() {
    return new EmbedBuilder()
      .setColor(this.configuration.ui.embedColor)
      .setTitle(`ℹ️ Les posts reddit vont être envoyés !`);
  }
}
