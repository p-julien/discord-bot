import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import { Reddit } from "../reddit";
import { ChatCommand } from "./command.interface";

export class Restart implements ChatCommand {
    name = "restart";
    description = "Restart the reddit submissions";

    async run(client: Client, interaction: BaseCommandInteraction) {
        const embed = this.getEmbed();
        await interaction.followUp({
            ephemeral: true,
            embeds: [embed],
        });

        const reddit = new Reddit(client);
        await reddit.sendSubmissionsToChannels();
    }

    private getEmbed() {
        return new MessageEmbed()
            .setColor("#E6742B")
            .setTitle(`ℹ️ Les posts reddit vont être envoyés !`);
    }
}
