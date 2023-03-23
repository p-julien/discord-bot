import {
  ApplicationCommandType,
  Client,
  EmbedBuilder,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import { UserCommand } from '../shared/models/command';
import axios from 'axios';
import hdate = require('human-date');
import { configuration } from '../shared/configurations/sdk-configuration';
import { LocationType } from './location.model';

export class Location implements UserCommand {
  type: ApplicationCommandType.User = ApplicationCommandType.User;
  name = 'location';

  constructor(private discord: Client) {}

  async run(interaction: UserContextMenuCommandInteraction): Promise<void> {
    const { targetId } = interaction;

    const users = this.discord.users.cache;
    const user = users.find((u) => u.id === targetId);

    if (!user) {
      return;
    }

    const location = await getLocation(targetId);
    const date = hdate.prettyPrint(location.updated_at);
    const desc = `Geolocalisation: ${location.geolocalisation}\nLast update: ${date}`;

    const embed = new EmbedBuilder()
      .setColor(configuration.ui.embedColor)
      .setTitle(`🛰️ Location of ${user.username}`)
      .setDescription(desc);

    await interaction.reply({ ephemeral: true, embeds: [embed] });
  }
}

async function getLocation(userId: string): Promise<LocationType> {
  const uri = `${configuration.geolocation.serviceUrl}/api/discord-user/${userId}`;
  const headers = { Authorization: configuration.geolocation.apiKey };
  const response = await axios.get(uri, { headers });
  return response.data;
}
