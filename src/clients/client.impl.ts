import {
  Client as DiscordClient,
  Events,
  GatewayIntentBits,
  WebSocketShardEvents,
} from 'discord.js';
import { Client } from '../configurations/create-discord-app';
import { interactionCreate } from '../listeners/interaction';
import { Logger } from '../logs/logger';
import { ClientConfiguration } from '../configurations/configuration';
import { ready } from '../listeners/ready';

export class ClientImpl implements Client {
  constructor(private configuration: ClientConfiguration) {}

  listen() {
    console.log('Create discord app with configuration', this.configuration);

    const discordBot = new DiscordClient({
      intents: [GatewayIntentBits.Guilds],
    });

    discordBot.on(WebSocketShardEvents.Ready, () =>
      ready(discordBot, this.configuration)
    );

    discordBot.on(
      Events.InteractionCreate,
      async (interaction) =>
        await interactionCreate(this.configuration, interaction)
    );

    discordBot.login(this.configuration.discord.token).catch(Logger.error);
  }
}
