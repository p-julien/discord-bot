import { MessageEmbed, MessageAttachment } from 'discord.js';
import Snoowrap from 'snoowrap';

export default class RestartPullRedditCommand {
    
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

    sendRedditPostsToDiscordChannels() {
        const discordChannels = this.getDiscordChannels()
        discordChannels.forEach(discordChannel => {
            const posts = this.snoowrap.getSubreddit(discordChannel.topic)
                .getTop({time: 'day', limit: 3})

            posts.forEach(post => {
                this.isUrlImage(post.url) 
                    ? discordChannel.send(`**${post.title}**`, new MessageAttachment(post.url))
                    : discordChannel.send(`**${post.title}**\n${post.url}`)
            });
        })
    }

    getDiscordChannels() {
        const discordChannels = []
        for (const [key, value] of this.client.channels.cache)
            if (value.parent !== null && value.parent.name === "Reddit")
                discordChannels.push(value)
        return discordChannels
    }

    isUrlImage(url) {
        const pattern = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i;
        return pattern.test(url);
    }
}