import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import prettyMilliseconds from "pretty-ms";
import { Command } from "../command";

export class Ping implements Command {
    name = "ping";
    description = "Ping the server of the bot";

    async run(client: Client, interaction: BaseCommandInteraction) {
        await interaction.followUp({
            ephemeral: true,
            embeds: [this.getEmbed(client)],
        });
    }

    private getEmbed(client: Client) {
        return new MessageEmbed()
            .setColor("#E6742B")
            .setTitle(`🏓 Latency: ${this.getLatency(client)}ms`);
    }

    private getLatency(client: Client) {
        return prettyMilliseconds(client.ws.ping);
    }
}
