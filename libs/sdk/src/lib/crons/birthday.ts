import axios from 'axios';
import { ChannelType, Client, EmbedBuilder, TextChannel } from 'discord.js';
import { schedule } from 'node-cron';
import { ClientConfiguration } from '../models/configuration';
import { CronTask } from '../models/cron-task';

export class BirthdayCron implements CronTask {
  constructor(
    private client: Client,
    private configuration: ClientConfiguration
  ) {}

  execute(): void {
    const { cron } = this.configuration.birthday;
    schedule(cron, () => this.sendBirthdayMessage());
  }

  async sendBirthdayMessage(): Promise<void> {
    const birthdays = await getBirthdays(this.configuration);

    if (!birthdays || birthdays.length === 0) {
      return;
    }

    const channel = this.client.channels.cache
      .filter((x) => x.type === ChannelType.GuildText)
      .map((x) => x as TextChannel)
      .find((c) => c.id === this.configuration.birthday.channelId);

    if (!channel) {
      return;
    }

    const peoplesBirthdays = birthdays.join(', ');
    const title = `🎉 Aujourd'hui c'est l'anniversaire de ${peoplesBirthdays} !`;

    const embed = new EmbedBuilder()
      .setColor(this.configuration.ui.embedColor)
      .setTitle(title);

    await channel.send({ content: '@everyone', embeds: [embed] });
  }
}

async function getBirthdays(
  configuration: ClientConfiguration
): Promise<string[]> {
  const uri = `${configuration.birthday.serviceUrl}/birthdays`;
  const headers = { Authorization: configuration.birthday.apiKey };
  const response = await axios.get(uri, { headers });
  return response.data;
}
