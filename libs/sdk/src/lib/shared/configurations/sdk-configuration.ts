import { HexColorString } from 'discord.js';
import { Timespan } from 'snoowrap/dist/objects/Subreddit';

export type SdkConfiguration = {
  discord: {
    token: string;
    clientId: string;
    guildId: string;
    statsChannelId: string;
  };
  reddit: {
    serviceUrl: string;
    clientId: string;
    clientSecret: string;
    userAgent: string;
    refreshToken: string;
    embedTimeout: number;
    cron: string;
    post: {
      time: Timespan;
      limit: number;
    };
  };
  geolocation: {
    serviceUrl: string;
    apiKey: string;
  };
  ui: {
    embedColor: HexColorString;
  };
  adviceServiceUrl: string;
  birthday: {
    serviceUrl: string;
    apiKey: string;
    cron: string;
    channelId: string;
  };
};

export const configuration: SdkConfiguration = {
  adviceServiceUrl: process.env.ADVICE_SERVICE_URL ?? '',
  ui: {
    embedColor: `#${process.env.EMBED_COLOR}`,
  },
  geolocation: {
    apiKey: process.env.GEOLOCATION_API_KEY ?? '',
    serviceUrl: process.env.GEOLOCATION_SERVICE_URL ?? '',
  },
  discord: {
    token: process.env.DISCORD_TOKEN ?? '',
    clientId: process.env.DISCORD_CLIENT_ID ?? '',
    guildId: process.env.DISCORD_GUILD_ID ?? '',
    statsChannelId: process.env.DISCORD_STATS_CHANNEL_ID ?? '',
  },
  reddit: {
    serviceUrl: process.env.REDDIT_SERVICE_URL ?? '',
    clientId: process.env.REDDIT_CLIENT_ID ?? '',
    clientSecret: process.env.REDDIT_CLIENT_SECRET ?? '',
    userAgent: process.env.REDDIT_USERAGENT ?? '',
    refreshToken: process.env.REDDIT_REFRESH_TOKEN ?? '',
    embedTimeout: +process.env.REDDIT_EMBED_TIMEOUT ?? 2000,
    cron: process.env.REDDIT_CRON_SUBMISSIONS ?? '',
    post: {
      time: process.env.REDDIT_POST_TIME as Timespan,
      limit: +process.env.REDDIT_POST_LIMIT,
    },
  },
  birthday: {
    cron: process.env.BIRTHDAY_CRON ?? '',
    channelId: process.env.BIRTHDAY_CHANNEL_ID ?? '',
    serviceUrl: process.env.BIRTHDAY_SERVICE_URL ?? '',
    apiKey: process.env.BIRTHDAY_API_KEY ?? '',
  },
};

export function assertConfiguration(): void {
  if (!configuration.discord.token) {
    throw new Error('DISCORD_TOKEN is not defined');
  }

  if (!configuration.discord.clientId) {
    throw new Error('DISCORD_CLIENT_ID is not defined');
  }

  if (!configuration.discord.guildId) {
    throw new Error('DISCORD_GUILD_ID is not defined');
  }

  if (!configuration.discord.statsChannelId) {
    throw new Error('DISCORD_STATS_CHANNEL_ID is not defined');
  }

  if (!configuration.reddit.serviceUrl) {
    throw new Error('REDDIT_SERVICE_URL is not defined');
  }

  if (!configuration.reddit.clientId) {
    throw new Error('REDDIT_CLIENT_ID is not defined');
  }

  if (!configuration.reddit.clientSecret) {
    throw new Error('REDDIT_CLIENT_SECRET is not defined');
  }

  if (!configuration.reddit.userAgent) {
    throw new Error('REDDIT_USERAGENT is not defined');
  }

  if (!configuration.reddit.refreshToken) {
    throw new Error('REDDIT_REFRESH_TOKEN is not defined');
  }
}
