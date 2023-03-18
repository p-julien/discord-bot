import axios from 'axios';
import { ChannelType, Client, EmbedBuilder, TextChannel } from 'discord.js';
import { schedule } from 'node-cron';
import { configuration } from '../shared/configurations/sdk-configuration';
import { CronTask } from '../shared/models/cron-task';

export class BirthdayCron implements CronTask {
  constructor(private client: Client) {}

  execute(): void {
    const { cron } = configuration.birthday;
    schedule(cron, () => this.sendBirthdayMessage());
  }

  async sendBirthdayMessage(): Promise<void> {
    const birthdays = await getBirthdays();

    if (!birthdays || birthdays.length === 0) {
      return;
    }

    const channel = this.client.channels.cache
      .filter((x) => x.type === ChannelType.GuildText)
      .map((x) => x as TextChannel)
      .find((c) => c.id === configuration.birthday.channelId);

    if (!channel) {
      return;
    }

    const peoplesBirthdays = birthdays.join(', ');
    const title = `🎉 Aujourd'hui c'est l'anniversaire de ${peoplesBirthdays} !`;

    const embed = new EmbedBuilder()
      .setColor(configuration.ui.embedColor)
      .setTitle(title);

    await channel.send({ content: '@everyone', embeds: [embed] });
  }
}

async function getBirthdays(): Promise<string[]> {
  const uri = `${configuration.birthday.serviceUrl}/birthdays`;
  const headers = { Authorization: configuration.birthday.apiKey };
  const response = await axios.get(uri, { headers });
  return response.data;
}
