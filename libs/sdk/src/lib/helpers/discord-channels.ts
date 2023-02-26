import { ChannelType, Client, TextChannel } from 'discord.js';

export function getDiscordTextChannels(discord: Client): TextChannel[] {
  return discord.channels.cache
    .filter((channel) => channel.type == ChannelType.GuildText)
    .map((x) => x as TextChannel)
    .sort((a, b) => a.rawPosition - b.rawPosition);
}
