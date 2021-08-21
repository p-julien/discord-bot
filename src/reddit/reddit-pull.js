import { MessageAttachment } from 'discord.js';
import Snoowrap from 'snoowrap';
import fetch from 'node-fetch';

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
        if (discordChannel.topic == null) return;
        const posts = this.snoowrap.getSubreddit(discordChannel.topic)
            .getTop({time: 'day', limit: 3})
        try {
            if (discordChannel.topic == null) return;

        posts.forEach(post => this.sendRedditPostToDiscordChannel({ discordChannel: discordChannel, post: post }));
            const reddit = this.snoowrap.getSubreddit(discordChannel.topic) 
            const posts = reddit.getTop({ time: 'day', limit: 3 })
            
            posts.forEach(post => this.sendRedditPostToDiscordChannel({ discordChannel: discordChannel, post: post }))
        } catch (error) {
            console.log(error)
        }
    }

    sendRedditPostToDiscordChannel(data) {
        data.post.title = `**${data.post.title}**`

        this.sendRedditPost(data, 
            () => data.discordChannel.send(data.post.title, new MessageAttachment(data.post.url)), 
            () => data.discordChannel.send(`${data.post.title}\n${data.post.url}`))

        // if (this.isUrlImage(data.post.url)) this.sendRedditPostAsAttachment(data)
        // else data.discordChannel.send(`${data.post.title}\n${data.post.url}`)
    }

    sendRedditPost(data, sendAsAttachment, sendAsMessage) {
        if (!this.isUrlImage(data.post.url)) {
            sendAsMessage()
            return
        }

        fetch(data.post.url).then(response => {
            const imageSize = response.headers.get("content-length")
            imageSize < 8000000 ? sendAsAttachment() : sendAsMessage()
        })
    }

    sendRedditPostAsAttachment(data) {
        this.isImageLessThan8Mb(data.post.url, () => {
            const attachment = new MessageAttachment(data.post.url)
            data.discordChannel.send(data.post.title, attachment)
        }) 
    }

    isImageLessThan8Mb(urlImage, sendImage) {
        fetch(urlImage).then(response => {
            const imageSize = response.headers.get("content-length")
            if (imageSize < 8000000) sendImage()
        })
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