import { Timespan } from 'snoowrap/dist/objects/Subreddit';
import { ClientConfiguration } from '../models/configuration';

export function getConfiguration(): ClientConfiguration {
  return {
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
}
