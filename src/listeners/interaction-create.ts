import { BaseCommandInteraction, Client, Interaction } from "discord.js";
import { commands } from "./ready";

export function interactionCreate(client: Client): void {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            await handleSlashCommand(client, interaction);
        }
    });
}

export async function handleSlashCommand(
    client: Client,
    interaction: BaseCommandInteraction
): Promise<void> {
    const slashCommand = commands.find(
        (c) => c.name === interaction.commandName
    );

    if (!slashCommand) {
        interaction.followUp({ content: "An error has occurred" });
        return;
    }

    await interaction.deferReply();
    slashCommand.run(client, interaction);
}
