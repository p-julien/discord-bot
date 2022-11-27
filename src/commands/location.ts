import {
  ApplicationCommandType,
  Client,
  EmbedBuilder,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import hdate from 'human-date';
import { UserCommand } from './command.interface';
import { ClientConfiguration } from '../configurations/configuration';

export class Location implements UserCommand {
  type: ApplicationCommandType.User = ApplicationCommandType.User;
  name = 'location';

  constructor(
    private discord: Client,
    private configuration: ClientConfiguration
  ) {}

  async run(interaction: UserContextMenuCommandInteraction) {
    const location = await this.getLocation(interaction.targetId);
    const user = this.discord.users.cache.find(
      (user) => user.id === interaction.targetId
    );

    if (user === undefined) return;
    const embed = await this.getEmbed({
      username: user.username,
      location: location,
    });

    await interaction.followUp({
      ephemeral: true,
      embeds: [embed],
    });
  }

  private async getEmbed(data: any) {
    const location = data.location.geolocalisation;
    const date = hdate.prettyPrint(data.location.updated_at);
    return new EmbedBuilder()
      .setColor(this.configuration.ui.embedColor)
      .setTitle(`🛰️ Location of ${data.username}`)
      .setDescription(`Geolocalisation: ${location}\nLast update: ${date}`);
  }

  private async getLocation(userId: string) {
    const uri = `${this.configuration.geolocation.serviceUrl}/discord-user/${userId}`;
    const headers = { Authorization: this.configuration.geolocation.apiKey };
    const response = await fetch(uri, { headers: headers });
    return (await response.json()) as any;
  }
}
