import { ChatInputCommandInteraction, Client, EmbedBuilder } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import { ClientConfiguration } from 'src/configurations/configuration';
import { ChatCommand } from './command.interface';

export class Ping implements ChatCommand {
  name = 'ping';
  description = 'Ping the server of the bot';

  constructor(
    private discord: Client,
    private configuration: ClientConfiguration
  ) {}

  async run(interaction: ChatInputCommandInteraction) {
    const embed = this.getEmbed(this.discord);
    await interaction.followUp({
      ephemeral: true,
      embeds: [embed],
    });
  }

  private getEmbed(client: Client) {
    return new EmbedBuilder()
      .setColor(this.configuration.ui.embedColor)
      .setTitle(`🏓 Latency: ${this.getLatency(client)}`);
  }

  private getLatency(client: Client) {
    return prettyMilliseconds(client.ws.ping);
  }
}
