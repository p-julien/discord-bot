import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';

export class AdviceCommand {
    
    constructor(client, interaction) {
        this.client = client;
        this.interaction = interaction;
    }

    async run() {
        const advice = await this.getAdvice()
        this.client.api.interactions(this.interaction.id, this.interaction.token)
            .callback
            .post({
                data: {
                    type: 4,
                    data: {
                        embeds: [ await this.getEmbedMessage(advice) ]
                    }
                }
            })
    }

    async getEmbedMessage(advice) {
        return new MessageEmbed()
            .setColor('#E6742B')
            .setTitle(`🔮 ${advice}`)
    }

    async getAdvice() {
        const response  = await fetch('https://api.adviceslip.com/advice')
        const data = await response.json()
        const advice = data.slip.advice
        return advice
    }
}