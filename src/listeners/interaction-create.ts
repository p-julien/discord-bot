import {
    BaseCommandInteraction,
    Client,
    Interaction,
    MessageEmbed,
} from "discord.js";
import { Logger } from "../loggers/log";
import { commands } from "../commands/commands";
import chalk from "chalk";

export async function interactionCreate(
    client: Client,
    interaction: Interaction
) {
    if (!(interaction.isCommand() || interaction.isContextMenu())) return;
    await handleSlashCommand(client, interaction);
}

async function handleSlashCommand(
    client: Client,
    interaction: BaseCommandInteraction
) {
    try {
        const command = commands.find(
            (c) => c.name === interaction.commandName
        );

        await interaction.deferReply();
        if (!command)
            return interaction.followUp({
                ephemeral: true,
                embeds: [
                    new MessageEmbed()
                        .setColor("#E6742B")
                        .setTitle("Sorry this command doesn't exists 😕"),
                ],
            });

        const username = interaction.user.username;
        Logger.info(
            `${chalk.whiteBright.bold(
                username
            )} asked for the command ${chalk.whiteBright.bold(
                interaction.commandName
            )}`
        );
        command.run(client, interaction);
    } catch (error) {
        Logger.error(
            `An error occured while responding to the command: ${interaction.commandName}`
        );
    }
}
