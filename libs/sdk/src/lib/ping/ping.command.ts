import { ChatInputCommandInteraction, Client, EmbedBuilder } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import { configuration } from '../shared/configurations/sdk-configuration';
import { ChatCommand } from '../shared/models/command';

export class Ping implements ChatCommand {
  name = 'ping';
  description = 'Ping the server of the bot';

  constructor(private discord: Client) {}

  async run(interaction: ChatInputCommandInteraction): Promise<void> {
    const latency = prettyMilliseconds(this.discord.ws.ping);

    const embed = new EmbedBuilder()
      .setColor(configuration.ui.embedColor)
      .setTitle(`🏓 Latency: ${latency}`);

    await interaction.reply({ ephemeral: true, embeds: [embed] });
  }
}
