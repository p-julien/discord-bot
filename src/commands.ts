import { Advice } from "./commands/advice";
import { Ping } from "./commands/ping";
import { Location } from "./commands/location";
import {
    ChatCommand as ChatCommand,
    Command,
    UserCommand,
} from "./commands/command.interface";

export const chatCommands = new Array<ChatCommand>(new Ping(), new Advice());
export const userCommands = new Array<UserCommand>(new Location());
export const commands = new Array<Command>(...chatCommands, ...userCommands);
