import {
  ChannelType,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} from 'discord.js';
import { RedditService } from '../services/reddit.service';
import { ChatCommand } from '../models/command';
import { SdkConfiguration } from '../models/configurations/sdk-configuration';

export class Pull implements ChatCommand {
  name = 'pull';
  description = 'Pull the reddit submissions for the current channel';

  constructor(
    private discord: Client,
    private configuration: SdkConfiguration
  ) {}

  async run(interaction: ChatInputCommandInteraction): Promise<void> {
    const reddit = new RedditService(this.discord, this.configuration);

    const channel = await this.discord.channels.fetch(interaction.channelId);

    if (!channel || channel.type != ChannelType.GuildText) {
      return;
    }

    const title = `ℹ️ Les posts du reddit r/${channel.topic} vont être envoyés !`;

    const embed = new EmbedBuilder()
      .setColor(this.configuration.ui.embedColor)
      .setTitle(title);

    await interaction.followUp({ ephemeral: true, embeds: [embed] });

    await reddit.sendSubmissionsToChannel(channel);
  }
}
