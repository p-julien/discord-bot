import { Client } from "discord.js";
import { commands } from "../commands";

export async function ready(client: Client) {
    if (!client.user || !client.application) return;
    await client.application.commands.set(commands);
    console.log(`${client.user.username} is online`);
}
