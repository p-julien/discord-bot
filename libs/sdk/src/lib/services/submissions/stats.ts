import { Client, EmbedBuilder } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import { getDiscordTextChannels } from '../../helpers/discord-channels';
import { SdkConfiguration } from '../../models/configurations/sdk-configuration';

export async function sendStats(
  discord: Client,
  configuration: SdkConfiguration,
  timeTaken: number
) {
  console.info('📊 Sending statistics to discord channel');
  try {
    const { statsChannelId } = configuration.discord;
    const channels = getDiscordTextChannels(discord);
    const redditChannel = channels.find((x) => x.id === statsChannelId);

    if (!redditChannel) {
      return;
    }

    const prettyMs = prettyMilliseconds(timeTaken);

    const embed = new EmbedBuilder()
      .setColor(configuration.ui.embedColor)
      .setTitle(`📊 Finished sending posts successfully in ${prettyMs}!`);

    await redditChannel.send({ embeds: [embed] });
  } catch (err) {
    console.error('❌', err);
  }
}
