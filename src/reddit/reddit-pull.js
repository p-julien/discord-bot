import { MessageAttachment } from 'discord.js';
import Snoowrap from 'snoowrap';

export class RedditPull {
    
    constructor(client) {
        this.client = client;
        this.snoowrap = new Snoowrap({
            userAgent: process.env.REDDIT_USER_AGENT,
            clientId: process.env.REDDIT_CLIENT_ID,
            clientSecret: process.env.REDDIT_CLIENT_SECRET,
            refreshToken: process.env.REDDIT_REFRESH_TOKEN
        })
    }

    sendRedditPostsToDiscordChannels() {
        const discordChannels = this.getDiscordChannels()
        discordChannels.forEach(discordChannel => this.sendRedditPostsToDiscordChannel(discordChannel))
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
    
    getDiscordChannel(interaction) {
        for (const [key, value] of this.client.channels.cache)
            if (key === interaction.channel_id)
                return value
    }

    getDiscordChannels() {
        const discordChannels = []
        for (const [key, value] of this.client.channels.cache)
            if (value.parent !== null && value.parent.name === "Reddit")
                discordChannels.push(value)
        return discordChannels
    }

    isUrlImage(url) {
        const extensions = ['jpg', 'jpeg', 'png', 'gif']
        const extension = url.split('.').pop();
        return extensions.includes(extension)
    }
}