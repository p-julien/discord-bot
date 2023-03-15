import { getConfiguration, interactionCreate, ready } from '@discord-bot/sdk';
import {
  Client,
  Events,
  GatewayIntentBits,
  WebSocketShardEvents,
} from 'discord.js';

const configuration = getConfiguration();

const discordOptions = { intents: [GatewayIntentBits.Guilds] };

const discordBot = new Client(discordOptions);

discordBot.on(WebSocketShardEvents.Ready, () =>
  ready(discordBot, configuration)
);

discordBot.on(
  Events.InteractionCreate,
  async (interaction) => await interactionCreate(configuration, interaction)
);

discordBot
  .login(configuration.discord.token)
  .catch((err) => console.error('❌', err));
