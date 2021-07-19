import { MessageEmbed } from 'discord.js';
import { RedditPull } from '../reddit/reddit-pull.js';

export class RestartRedditPullCommand extends RedditPull {
    
    constructor(client, interaction) {
        super(client)
        this.client = client;
        this.interaction = interaction;
    }

    run() {
        setTimeout(() => this.sendRedditPostsToDiscordChannels(), 0)
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
            .setTitle(`ℹ️ Les posts reddit vont être envoyés !`)
    }
}