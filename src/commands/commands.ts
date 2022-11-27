import { Advice } from './advice';
import { Ping } from './ping';
import { Location } from './location';
import { Pull } from './pull';
import { Restart } from './restart';
import { ClientConfiguration } from '../configurations/configuration';
import { Command } from './command.interface';
import { Client } from 'discord.js';

export const getCommands = (
  discord: Client,
  configuration: ClientConfiguration
): Command[] => [
  new Ping(discord, configuration),
  new Advice(configuration),
  new Pull(discord, configuration),
  new Restart(discord, configuration),
  new Location(discord, configuration),
];
