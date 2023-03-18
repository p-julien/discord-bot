import {
  BaseApplicationCommandData,
  ChatInputApplicationCommandData,
  CommandInteraction,
  UserApplicationCommandData,
} from 'discord.js';

export type Command = BaseApplicationCommandData & {
  run(interaction: CommandInteraction): void;
};

export type ChatCommand = ChatInputApplicationCommandData & Command;

export type UserCommand = UserApplicationCommandData & Command;
