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
    if (!slashCommand)
        return interaction.followUp({
            ephemeral: true,
            embeds: [
                new MessageEmbed()
                    .setColor("#E6742B")
                    .setTitle("Sorry this command doesn't exists 😕"),
            ],
        });

    const username = interaction.user.username;
    console.log(`Command ${interaction.commandName} is called by ${username}`);
    slashCommand.run(client, interaction);
}
