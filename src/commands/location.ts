import { Client, MessageEmbed, UserContextMenuInteraction } from "discord.js";
import fetch from "node-fetch";
import { ApplicationCommandTypes } from "discord.js/typings/enums";
import hdate from "human-date";
import { UserCommand } from "./command.interface";

export class Location implements UserCommand {
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
        const location = data.location.geolocalisation;
        const date = hdate.prettyPrint(data.location.updated_at);
        return new MessageEmbed()
            .setColor("#E6742B")
            .setTitle(`🛰️ Location of ${data.username}`)
            .setDescription(
                `Geolocalisation: ${location}\nLast update: ${date}`
            );
    }

    private async getLocation(userId: string) {
        const uri = `https://codem.tk/geo/api/discord-user/${userId}`;
        const response = await fetch(uri);
        return (await response.json()) as any;
    }
}
