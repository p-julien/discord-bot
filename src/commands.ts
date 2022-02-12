import { Advice } from "./commands/advice";
import { Command } from "./commands/command.interface";
import { Ping } from "./commands/ping";
import { Location } from "./commands/location";

export const commands = new Array<Command>(
    new Ping(),
    new Location(),
    new Advice()
);
