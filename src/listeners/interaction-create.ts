import {
    BaseCommandInteraction,
    Client,
    Interaction,
    MessageEmbed,
} from "discord.js";
import { commands } from "../commands";

export async function interactionCreate(
    client: Client,
    interaction: Interaction
) {
    if (!interaction.isCommand()) return;
    await handleSlashCommand(client, interaction);
}

export async function handleSlashCommand(
    client: Client,
    interaction: BaseCommandInteraction
) {
    const slashCommand = commands.find(
        (c) => c.name === interaction.commandName
    );

    await interaction.deferReply();
    if (!slashCommand) {
        const embed = new MessageEmbed()
            .setColor("#E6742B")
            .setTitle(
                `Sorry I didn't know the command ${interaction.commandName} 😕`
            );
        return interaction.followUp({
            ephemeral: true,
            embeds: [embed],
        });
    }

    console.log(
        `Command ${interaction.commandName} is called by ${interaction.user.username}`
    );
    slashCommand.run(client, interaction);
}
