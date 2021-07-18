import { MessageEmbed } from 'discord.js';

export default class PingCommand {
    
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
            .setTitle(`🏓 Latency: ${this.getLatency()}ms`)
    }

    getLatency() {
        return Math.round(this.client.ws.ping)
    }
}