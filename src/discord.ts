import { Client, TextChannel } from "discord.js";

export function getTextChannels(client: Client) {
  const channels = new Array<TextChannel>();
  for (const [id, channel] of client.channels.cache)
    if (channel.type == "GUILD_TEXT") channels.push(channel);

  return channels.sort((a, b) => a.rawPosition - b.rawPosition);
}
