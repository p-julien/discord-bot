import { Client } from "discord.js";
import { Command } from "../command";
import { Ping } from "../commands/ping";

export function ready(client: Client): void {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }

        await client.application.commands.set(commands);
        console.log(`${client.user.username} is online`);
    });
}

export const commands = new Array<Command>(new Ping());
