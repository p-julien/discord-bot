import { DiscordBotClient } from '@discord-bot/sdk';

const discordBot = new DiscordBotClient();

discordBot.withReady().withInteractionCreate().start();
