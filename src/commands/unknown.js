import { MessageEmbed } from 'discord.js';

export default class UnknownCommand {
    
    constructor(client, interaction) {
        this.client = client;
        this.interaction = interaction;
    }

    run() {
        this.client.api.interactions(this.interaction.id, this.interaction.token)
            .callback
            .post({
                data: {
                    type: 4,
                    data: {
                        embeds: [ this.getEmbedMessage() ]
                    }
                }
            })
    }

    getEmbedMessage() {
        return new MessageEmbed()
            .setColor('#E6742B')
            .setTitle(`Sorry I didn't know the command ${this.interaction.name}`)
    }
}