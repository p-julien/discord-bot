import { Advice } from "./commands/advice";
import { Ping } from "./commands/ping";
import { Location } from "./commands/location";
import {
    ChatCommand as ChatCommand,
    Command,
    UserCommand,
} from "./commands/command.interface";
import { Pull } from "./commands/pull";
import { Restart } from "./commands/restart";

export const chatCommands = new Array<ChatCommand>(
    new Ping(),
    new Advice(),
    new Pull(),
    new Restart()
);

export const userCommands = new Array<UserCommand>(new Location());

export const commands = new Array<Command>(...chatCommands, ...userCommands);
