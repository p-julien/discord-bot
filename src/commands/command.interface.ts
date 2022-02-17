import {
    BaseApplicationCommandData,
    BaseCommandInteraction,
    ChatInputApplicationCommandData,
    Client,
    UserApplicationCommandData,
} from "discord.js";

export interface ChatCommand extends ChatInputApplicationCommandData, Command {}
export interface UserCommand extends UserApplicationCommandData, Command {}

export interface Command extends BaseApplicationCommandData {
    run(client: Client, interaction: BaseCommandInteraction): void;
}
