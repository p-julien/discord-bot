import { HexColorString } from 'discord.js';
import { Timespan } from 'snoowrap/dist/objects/Subreddit';

export type ClientConfiguration = {
  discord: DiscordConfiguration;
  reddit: RedditConfiguration;
  geolocation: GeolocationConfiguration;
  ui: UiConfiguration;
  adviceServiceUrl: string;
  birthday: BirthdayConfiguration;
};

export type DiscordConfiguration = {
  token: string;
  clientId: string;
  guildId: string;
  statsChannelId: string;
};

export type RedditConfiguration = {
  serviceUrl: string;
  clientId: string;
  clientSecret: string;
  userAgent: string;
  refreshToken: string;
  embedTimeout: number;
  cron: string;
  post: RedditPostConfiguration;
};

export type RedditPostConfiguration = {
  time: Timespan;
  limit: number;
};

export type GeolocationConfiguration = {
  serviceUrl: string;
  apiKey: string;
};

export type UiConfiguration = {
  embedColor: HexColorString;
};

export type BirthdayConfiguration = {
  serviceUrl: string;
  apiKey: string;
  cron: string;
  channelId: string;
};
