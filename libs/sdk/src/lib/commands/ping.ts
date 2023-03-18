import { ChatInputCommandInteraction, Client, EmbedBuilder } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import { ChatCommand } from '../models/command';
import { SdkConfiguration } from '../models/configurations/sdk-configuration';

export class Ping implements ChatCommand {
  name = 'ping';
  description = 'Ping the server of the bot';

  constructor(
    private discord: Client,
    private configuration: SdkConfiguration
  ) {}

  async run(interaction: ChatInputCommandInteraction): Promise<void> {
    const latency = prettyMilliseconds(this.discord.ws.ping);

    const embed = new EmbedBuilder()
      .setColor(this.configuration.ui.embedColor)
      .setTitle(`🏓 Latency: ${latency}`);

    await interaction.followUp({ ephemeral: true, embeds: [embed] });
  }
}
