import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { ChatCommand } from './command.interface';
import { ClientConfiguration } from '../configurations/configuration';

export class Advice implements ChatCommand {
  name = 'advice';
  description = 'Get a random advice';

  constructor(private configuration: ClientConfiguration) {}

  async run(interaction: ChatInputCommandInteraction) {
    const embed = await this.getEmbed();
    await interaction.followUp({
      ephemeral: true,
      embeds: [embed],
    });
  }

  private async getEmbed() {
    const advice = await this.getAdvice();
    return new EmbedBuilder()
      .setColor(this.configuration.ui.embedColor)
      .setTitle(`🔮 ${advice}`);
  }

  private async getAdvice() {
    const response = await fetch(this.configuration.adviceServiceUrl);
    const data = (await response.json()) as any;
    return data.slip.advice;
  }
}
