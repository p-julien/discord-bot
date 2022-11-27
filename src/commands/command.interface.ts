import {
  BaseApplicationCommandData,
  ChatInputApplicationCommandData,
  CommandInteraction,
  UserApplicationCommandData,
} from 'discord.js';

export interface ChatCommand extends ChatInputApplicationCommandData, Command {}
export interface UserCommand extends UserApplicationCommandData, Command {}

export interface Command extends BaseApplicationCommandData {
  run(interaction: CommandInteraction): void;
}
