import {
    BaseCommandInteraction,
    Client,
    MessageEmbed,
    TextChannel,
} from "discord.js";
import { Reddit } from "../reddit";
import { ChatCommand } from "./command.interface";

export class Pull implements ChatCommand {
    name = "pull";
    description = "Pull the reddit submissions for the current channel";

    async run(client: Client, interaction: BaseCommandInteraction) {
        const reddit = new Reddit(client);
        const channel = await client.channels.fetch(interaction.channelId);
        if (channel?.type != "GUILD_TEXT") return;

        const embed = this.getEmbed(channel);
        await interaction.followUp({
            ephemeral: true,
            embeds: [embed],
        });

        await reddit.sendSubmissionsToChannel(channel);
    }

    private getEmbed(discordChannel: TextChannel) {
        return new MessageEmbed()
            .setColor("#E6742B")
            .setTitle(
                `ℹ️ Les posts du reddit r/${discordChannel.topic} vont être envoyés !`
            );
    }
}
