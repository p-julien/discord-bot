import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import { ChatCommand } from "./command.interface";
import fetch from "node-fetch";

export class Advice implements ChatCommand {
    name = "advice";
    description = "Get a random advice";

    async run(client: Client, interaction: BaseCommandInteraction) {
        const embed = await this.getEmbed();
        await interaction.followUp({
            ephemeral: true,
            embeds: [embed],
        });
    }

    private async getEmbed() {
        const advice = await this.getAdvice();
        return new MessageEmbed().setColor("#E6742B").setTitle(`🔮 ${advice}`);
    }

    private async getAdvice() {
        const response = await fetch("https://api.adviceslip.com/advice");
        const data = (await response.json()) as any;
        return data.slip.advice;
    }
}
