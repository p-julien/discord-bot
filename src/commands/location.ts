import {
    ApplicationCommandAutocompleteOption,
    BaseCommandInteraction,
    Client,
    MessageEmbed,
} from "discord.js";
import { Command } from "./command.interface";
import fetch from "node-fetch";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";

export class Location implements Command {
    name = "location";
    description = "Get the localisation of an user";
    options = new Array<ApplicationCommandAutocompleteOption>({
        type: ApplicationCommandOptionTypes.STRING,
        autocomplete: true,
        name: "user_id",
        required: true,
        description: "Id of the user",
    });

    async run(client: Client, interaction: BaseCommandInteraction) {
        const parameters = interaction.options.data as any;
        const userId = parameters.find((p: any) => p.name === "user_id").value;
        const location = await this.getLocation(userId);
        const embed = await this.getEmbed({
            userId: userId,
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
            .setTitle(`🛰️ Location ${data.userId}: ${data.location}`);
    }

    private async getLocation(userId: string) {
        const uri = `https://codem.tk/geo/api/discord-user/${userId}`;
        const response = await fetch(uri);
        const data = (await response.json()) as any;
        return data.geolocalisation as string;
    }
}
