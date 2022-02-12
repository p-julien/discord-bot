import {
    Client,
    MessageEmbed,
    UserApplicationCommandData,
    UserContextMenuInteraction,
} from "discord.js";
import fetch from "node-fetch";
import { ApplicationCommandTypes } from "discord.js/typings/enums";

export class Location implements UserApplicationCommandData {
    type: ApplicationCommandTypes.USER = ApplicationCommandTypes.USER;
    name = "location";

    async run(client: Client, interaction: UserContextMenuInteraction) {
        const location = await this.getLocation(interaction.targetId);
        const user = client.users.cache.find(
            (user) => user.id === interaction.targetId
        );

        if (user === undefined) return;
        const embed = await this.getEmbed({
            username: user.username,
            location: location,
        });

        await interaction.followUp({
            ephemeral: true,
            embeds: [embed],
        });
    }

    private async getEmbed(data: any) {
        return new MessageEmbed()
            .setColor("#E6742B")
            .setTitle(`🛰️ Last location of ${data.username}: ${data.location}`);
    }

    private async getLocation(userId: string) {
        const uri = `https://codem.tk/geo/api/discord-user/${userId}`;
        const response = await fetch(uri);
        const data = (await response.json()) as any;
        return data.geolocalisation as string;
    }
}
