import { ButtonInteraction, CacheType, Client, EmbedBuilder } from 'discord.js';
import { configuration } from '../../shared/configurations/sdk-configuration';
import { RedditService } from '../services/reddit.service';
import { getDiscordTextChannels } from './discord-channels';
import { extractTitle } from './extract-title';

export async function handleButtonInteraction(
  discordClient: Client,
  interaction: ButtonInteraction<CacheType>
): Promise<void> {
  if (interaction.user.bot) {
    return console.info("🆗 It's a bot, we don't care");
  }

  const reddit = new RedditService(discordClient);
  const channels = getDiscordTextChannels(discordClient);

  const channel = channels.find((x) => x.id === interaction.channelId);
  const subreddit = reddit.instance.getSubreddit(channel.topic);

  const message = await channel.messages.fetch(interaction.message.id);

  if (!message.content) {
    return console.info('🆗 Message has no content');
  }

  const title = extractTitle(message.content);

  if (!title) {
    return console.info('🆗 Message has no title');
  }

  const results = await subreddit.search({ query: title });

  if (results.length === 0) {
    return console.log('🆗 No results found');
  }

  const link = configuration.reddit.serviceUrl + results[0].permalink;

  const embed = new EmbedBuilder()
    .setColor(configuration.ui.embedColor)
    .setTitle(`Source du post : ${link}`);

  interaction.reply({ ephemeral: true, embeds: [embed] });
}
