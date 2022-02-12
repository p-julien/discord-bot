import { BaseCommandInteraction, Client, Interaction } from "discord.js";
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

    if (!slashCommand)
        return interaction.followUp({ content: "An error has occurred" });

    await interaction.deferReply();
    slashCommand.run(client, interaction);
}
