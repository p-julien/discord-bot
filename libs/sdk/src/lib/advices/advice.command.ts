import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import axios from 'axios';
import { ChatCommand } from '../shared/models/command';
import { configuration } from '../shared/configurations/sdk-configuration';

export class Advice implements ChatCommand {
  name = 'advice';
  description = 'Get a random advice';

  async run(interaction: ChatInputCommandInteraction): Promise<void> {
    const advice = await getAdvice();

    const embed = new EmbedBuilder()
      .setColor(configuration.ui.embedColor)
      .setTitle(`🔮 ${advice}`);

    await interaction.followUp({ ephemeral: true, embeds: [embed] });
  }
}

async function getAdvice() {
  const response = await axios.get(configuration.adviceServiceUrl);
  return response.data.slip.advice;
}
