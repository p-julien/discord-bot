import { Advice } from "./advice";
import { Ping } from "./ping";
import { Location } from "./location";
import {
  ChatCommand as ChatCommand,
  Command,
  UserCommand,
} from "./command.interface";
import { Pull } from "./pull";
import { Restart } from "./restart";

export const chatCommands = new Array<ChatCommand>(
  new Ping(),
  new Advice(),
  new Pull(),
  new Restart()
);

export const userCommands = new Array<UserCommand>(new Location());

export const commands = new Array<Command>(...chatCommands, ...userCommands);
