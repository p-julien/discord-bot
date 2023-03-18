import { ChatInputCommandInteraction, Client, EmbedBuilder } from 'discord.js';
import { RedditService } from '../services/reddit.service';
import { ChatCommand } from '../../shared/models/command';
import { configuration } from '../../shared/configurations/sdk-configuration';

export class Restart implements ChatCommand {
  name = 'restart';
  description = 'Restart the reddit submissions';

  constructor(private discord: Client) {}

  async run(interaction: ChatInputCommandInteraction): Promise<void> {
    const embed = new EmbedBuilder()
      .setColor(configuration.ui.embedColor)
      .setTitle(`ℹ️ Les posts reddit vont être envoyés !`);

    await interaction.followUp({ ephemeral: true, embeds: [embed] });

    const redditService = new RedditService(this.discord);

    redditService.sendSubmissionsToChannels();
  }
}
