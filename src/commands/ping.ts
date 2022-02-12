import {
    BaseCommandInteraction,
    ChatInputApplicationCommandData,
    Client,
    MessageEmbed,
} from "discord.js";
import prettyMilliseconds from "pretty-ms";

export class Ping implements ChatInputApplicationCommandData {
    name = "ping";
    description = "Ping the server of the bot";

    async run(client: Client, interaction: BaseCommandInteraction) {
        const embed = this.getEmbed(client);
        await interaction.followUp({
            ephemeral: true,
            embeds: [embed],
        });
    }

    private getEmbed(client: Client) {
        return new MessageEmbed()
            .setColor("#E6742B")
            .setTitle(`🏓 Latency: ${this.getLatency(client)}`);
    }

    private getLatency(client: Client) {
        return prettyMilliseconds(client.ws.ping);
    }
}
