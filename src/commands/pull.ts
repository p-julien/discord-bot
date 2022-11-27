import {
  ChannelType,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  TextChannel,
} from 'discord.js';
import { ClientConfiguration } from '../configurations/configuration';
import { RedditService } from '../services/reddit.service';
import { ChatCommand } from './command.interface';

export class Pull implements ChatCommand {
  name = 'pull';
  description = 'Pull the reddit submissions for the current channel';

  constructor(
    private discord: Client,
    private configuration: ClientConfiguration
  ) {}

  async run(interaction: ChatInputCommandInteraction) {
    const reddit = new RedditService(this.discord, this.configuration);
    const channel = await this.discord.channels.fetch(interaction.channelId);
    if (channel == null || channel.type != ChannelType.GuildText) return;

    const embed = this.getEmbed(channel);
    await interaction.followUp({
      ephemeral: true,
      embeds: [embed],
    });

    await reddit.sendSubmissionsToChannel(channel);
  }

  private getEmbed(discordChannel: TextChannel) {
    return new EmbedBuilder()
      .setColor(this.configuration.ui.embedColor)
      .setTitle(
        `ℹ️ Les posts du reddit r/${discordChannel.topic} vont être envoyés !`
      );
  }
}
