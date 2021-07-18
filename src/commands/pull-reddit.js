import { MessageEmbed, MessageAttachment } from 'discord.js';
import Snoowrap from 'snoowrap';

export default class PullRedditCommand {
    
    constructor(client, interaction) {
        this.client = client;
        this.interaction = interaction;
        this.snoowrap = new Snoowrap({
            userAgent: process.env.REDDIT_USER_AGENT,
            clientId: process.env.REDDIT_CLIENT_ID,
            clientSecret: process.env.REDDIT_CLIENT_SECRET,
            refreshToken: process.env.REDDIT_REFRESH_TOKEN
        })
    }

    run() {
        const discordChannel = this.getDiscordChannel()
        setTimeout(() => this.sendRedditPostsToDiscordChannel(discordChannel), 0)

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
    }
    
    getEmbedMessage(discordChannel) {
        return new MessageEmbed()
            .setColor('#E6742B')
            .setTitle(`ℹ️ Les posts du reddit r/${discordChannel.topic} vont être envoyés !`)
    }

    sendRedditPostsToDiscordChannel(discordChannel) {
        const posts = this.snoowrap.getSubreddit(discordChannel.topic)
            .getTop({time: 'day', limit: 3})

        posts.forEach(post => {
            this.isUrlImage(post.url) 
                ? discordChannel.send(`**${post.title}**`, new MessageAttachment(post.url))
                : discordChannel.send(`**${post.title}**\n${post.url}`)
        });
    }

    getDiscordChannel() {
        for (const [key, value] of this.client.channels.cache)
            if (key === this.interaction.channel_id)
                return value
    }

    isUrlImage(url) {
        const pattern = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i;
        return pattern.test(url);
    }
}