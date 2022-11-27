import { Colors, HexColorString } from 'discord.js';
import * as dotenv from 'dotenv';

export const configuration = (): ClientConfiguration => {
  dotenv.config();
  return {
    production: process.env.PRODUCTION == 'true',
    adviceServiceUrl: process.env.ADVICE_SERVICE_URL ?? '',
    ui: {
      embedColor: `#${process.env.EMBED_COLOR}` ?? Colors.Orange,
    },
    geolocation: {
      apiKey: process.env.GEOLOCATION_API_KEY ?? '',
      serviceUrl: process.env.GEOLOCATION_SERVICE_URL ?? '',
    },
    discord: {
      token: process.env.DISCORD_TOKEN ?? '',
      clientId: process.env.DISCORD_CLIENT_ID ?? '',
      guildId: process.env.DISCORD_GUILD_ID ?? '',
    },
    reddit: {
      serviceUrl: process.env.REDDIT_SERVICE_URL ?? '',
      clientId: process.env.REDDIT_CLIENT_ID ?? '',
      clientSecret: process.env.REDDIT_CLIENT_SECRET ?? '',
      userAgent: process.env.REDDIT_USERAGENT ?? '',
      refreshToken: process.env.REDDIT_REFRESH_TOKEN ?? '',
      post: {
        time:
          <'hour' | 'day' | 'week' | 'month' | 'year' | 'all'>(
            process.env.REDDIT_POST_TIME
          ) ?? '',
        limit: Number(process.env.REDDIT_POST_LIMIT),
      },
    },
  };
};

export interface DiscordConfiguration {
  token: string;
  clientId: string;
  guildId: string;
}

export interface RedditConfiguration {
  serviceUrl: string;
  clientId: string;
  clientSecret: string;
  userAgent: string;
  refreshToken: string;
  post: RedditPostConfiguration;
}

export interface RedditPostConfiguration {
  time: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
  limit: number;
}

export interface GeolocationConfiguration {
  serviceUrl: string;
  apiKey: string;
}

export interface UiConfiguration {
  embedColor: HexColorString;
}

export interface ClientConfiguration {
  production: boolean;
  discord: DiscordConfiguration;
  reddit: RedditConfiguration;
  geolocation: GeolocationConfiguration;
  ui: UiConfiguration;
  adviceServiceUrl: string;
}
