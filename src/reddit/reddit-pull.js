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

    async sendRedditPostsToDiscordChannels() {
        const discordChannels = this.getDiscordChannels()
        for (const discordChannel of discordChannels) 
            await this.sendRedditPostsToDiscordChannel(discordChannel)
    }

    async sendRedditPostsToDiscordChannel(discordChannel) {
        try {
            if (discordChannel.topic == null) return;

            const reddit = this.snoowrap.getSubreddit(discordChannel.topic) 
            const posts = await reddit.getTop({ time: 'day', limit: 3 })
            
            for (const post of posts) 
                await this.sendRedditPostToDiscordChannel(discordChannel, post)
        } catch (error) {
            console.log(error)
        }
    }

    async sendRedditPostToDiscordChannel(discordChannel, post) {
        post.title = `**${post.title}**`

        if (post.is_gallery) {
            const files = []
            post.gallery_data.items.forEach(item => {
                const media = post.media_metadata[item.media_id]
                const attachment = media.s.u
                const file = { attachment: attachment } 
                if (post.over_18) file.name = `SPOILER_${item.media_id}.${media.m.split('/').pop()}`
                files.push(file)
            })
            await discordChannel.send(post.title, { files: files })
            return
        }

        if (this.isImage(post.url)) {
            const isImageLessThan8Mb = await this.isImageLessThan8Mb(post.url)
            
            if (isImageLessThan8Mb) {
                const file = { attachment: post.url }                
                if (post.over_18) file.name = `SPOILER_${post.id}.${this.getExtension(post.url)}`
                await discordChannel.send(post.title, { files: [file] })
                return
            }
        }

        await discordChannel.send(`${post.title}\n${post.url}`)
    }

    async isImageLessThan8Mb(urlImage) {
        const response =  await fetch(urlImage)
        const imageSize = response.headers.get("content-length")
        return imageSize < 8000000
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

    isImage(url) {
        const extensions = ['jpg', 'jpeg', 'png', 'gif']
        const extension = this.getExtension(url)
        return extensions.includes(extension)
    }

    getExtension(url) {
        return url.split('.').pop()
    }
}