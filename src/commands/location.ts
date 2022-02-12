import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import { Command } from "./command.interface";
import fetch from "node-fetch";

export class Location implements Command {
    name = "location";
    description = "Get the localisation of an user";

    async run(client: Client, interaction: BaseCommandInteraction) {
        const embed = await this.getEmbed();
        await interaction.followUp({
            ephemeral: true,
            embeds: [embed],
        });
    }

    private async getEmbed() {
        const docheLocation = await this.getDocheLocation();
        return new MessageEmbed()
            .setColor("#E6742B")
            .setTitle(`🛰️ Doche location: ${docheLocation}`);
    }

    private async getDocheLocation() {
        const response = await fetch(
            "https://codem.tk/geo/api/discord-user/192718089979166720"
        );
        const data = (await response.json()) as any;
        return data.geolocalisation;
    }
}
