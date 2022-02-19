import { Client, Message, UserContextMenuInteraction } from "discord.js";
import { ApplicationCommandTypes } from "discord.js/typings/enums";
import { UserCommand } from "./command.interface";

export class Stat implements UserCommand {
    type: ApplicationCommandTypes.USER = ApplicationCommandTypes.USER;
    name = "stat";

    async run(client: Client, interaction: UserContextMenuInteraction) {
        const message = await interaction.followUp(
            `s?stats user ${interaction.targetId}`
        );

        setTimeout(() => (message as Message).delete(), 1000);
    }
}
