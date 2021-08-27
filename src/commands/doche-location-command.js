import {MessageEmbed} from 'discord.js';
import fetch from 'node-fetch';

export class WhereIsDocheCommand {
    
    constructor(client, interaction) {
        this.client = client;
        this.interaction = interaction;
    }

    async run() {
        this.client.api.interactions(this.interaction.id, this.interaction.token)
            .callback
            .post({
                data: {
                    type: 4,
                    data: {
                        embeds: [ await this.getEmbedMessage() ]
                    }
                }
            })
    }

    async getEmbedMessage() {
        const docheLocation = await this.getDocheLocation()
        return new MessageEmbed()
            .setColor('#E6742B')
            .setTitle(`🛰️ Doche location: ${docheLocation}`)
    }

    async getDocheLocation() {
        const response  = await fetch('http://codem.tk/ou-suis-je')
        return await response.text()
    }
}