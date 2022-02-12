import { Command } from "./commands/command.interface";
import { Ping } from "./commands/ping";

export const commands = new Array<Command>(new Ping());
