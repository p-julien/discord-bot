import { MessageEmbed } from 'discord.js';
import { RedditPull } from '../reddit/reddit-pull.js';
import { getDiscordChannel } from '../utils/discord-interaction.js';

export class RedditPullCommand extends RedditPull {
    
    constructor(client, interaction) {
        super(client)
        this.client = client;
        this.interaction = interaction;
    }

    async run() {
        const discordChannel = getDiscordChannel(this.client, this.interaction)
        this.client.api.interactions(this.interaction.id, this.interaction.token)
            .callback
            .post({
                data: {
                    type: 4,
                    data: {
                        embeds: [ this.getEmbedMessage(discordChannel) ]
                    }
                }
            })

        await this.sendRedditPostsToDiscordChannel(discordChannel)
    }
    
    getEmbedMessage(discordChannel) {
        return new MessageEmbed()
            .setColor('#E6742B')
            .setTitle(`ℹ️ Les posts du reddit r/${discordChannel.topic} vont être envoyés !`)
    }
}