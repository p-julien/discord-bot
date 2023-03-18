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
