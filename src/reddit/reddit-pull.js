import Snoowrap from 'snoowrap'
import fetch from 'node-fetch'
import { promises as fs } from 'fs'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import { Logger } from '../utils/log.js';

export class RedditPull {
    
    constructor(client) {
        this.client = client;
        this.logger = new Logger();
        this.snoowrap = new Snoowrap({
            userAgent: process.env.REDDIT_USER_AGENT,
            clientId: process.env.REDDIT_CLIENT_ID,
            clientSecret: process.env.REDDIT_CLIENT_SECRET,
            refreshToken: process.env.REDDIT_REFRESH_TOKEN
        })
    }

    async sendRedditPostsToDiscordChannels() {
        this.logger.info("Start of sending posts...")
        try {
            const discordChannels = this.getDiscordChannels()
            for (const discordChannel of discordChannels) 
                await this.sendRedditPostsToDiscordChannel(discordChannel)
        } catch (error) {
            this.logger.error(error)
        }
    }

    async sendRedditPostsToDiscordChannel(discordChannel) {
        this.logger.info(`Start of sending posts on channel ${discordChannel.name} [topic: ${discordChannel.topic}]`)
        try {
            if (discordChannel.topic == null) return;

            const subreddit = this.snoowrap.getSubreddit(discordChannel.topic) 
            const posts = await subreddit.getTop({ time: 'day', limit: 3 })
            
            for (const post of posts) 
                await this.sendRedditPostToDiscordChannel(discordChannel, post)
        } catch (error) {
            this.logger.error(error)
        }
    }

    async sendRedditPostToDiscordChannel(discordChannel, post) {
        this.logger.info(`Start of sending post: ${post.title}`)
        try {
            post.title = `**${post.title}**`

            if (post.is_gallery) 
                return await this.sendRedditPostAsGallery(discordChannel, post)
    
            if (this.IsUrlAnImage(post.url))
                return await this.sendRedditPostAsImage(discordChannel, post)
    
            // if (post.is_video)
            //     return await this.sendRedditPostAsVideo(discordChannel, post)
    
            if (post.selftext !== '')
                return await this.sendRedditPostAsContentText(discordChannel, post)
    
            await this.sendRedditPostAsText(discordChannel, post)
        } catch (error) {
            this.logger.error(error)
        }
    }

    async sendRedditPostAsText(discordChannel, post) {
        this.logger.info(`Sending post as default...`)
        if (post.over_18 || post.spoiler) post.url = `|| ${post.url} ||`
        await discordChannel.send(`${post.title}\n${post.url}`)
    }

    async sendRedditPostAsContentText(discordChannel, post) {
        this.logger.info(`Sending post as content text...`)
        if (post.over_18 || post.spoiler || post.selftext.length > 2000) 
            return await this.sendRedditPostAsText(discordChannel, post)

        await discordChannel.send(post.title + "\n```md\n" + post.selftext + "\n```")
    }

    async sendRedditPostAsVideo(discordChannel, post) {
        this.logger.info(`Sending post as video...`)
        try {
            const highestQuality = await this.getHighestQuality(post.url)
            const response = await fetch(`${post.url}/DASH_audio.mp4`)

            if (response.status != 200) {
                const file = { attachment: `${post.url}/DASH_${highestQuality}.mp4`, name: `${post.id}.mp4` }
                if (post.over_18 || post.spoiler) file.name = `SPOILER_${post.id}.mp4`
                return await discordChannel.send(post.title, { files: [file] })
            }

            const ffmpeg = createFFmpeg();
            await ffmpeg.load();

            ffmpeg.FS('writeFile', 'video.mp4', await fetchFile(`${post.url}/DASH_${highestQuality}.mp4`));
            ffmpeg.FS('writeFile', 'audio.mp4', await fetchFile(`${post.url}/DASH_audio.mp4`));
            await ffmpeg.run('-i', 'video.mp4', '-i', 'audio.mp4', '-c', 'copy', `${post.id}.mp4`);

            let data = ffmpeg.FS('readFile', `${post.id}.mp4`)
            data = new Uint8Array(data.buffer);
            await fs.writeFile(`./${post.id}.mp4`, Buffer.from(data));

            ffmpeg.exit()

            const file = { attachment: `./${post.id}.mp4`, name: `${post.id}.mp4` }
            if (post.over_18 || post.spoiler) file.name = `SPOILER_${post.id}.mp4`
            await discordChannel.send(post.title, { files: [file] })
        } catch (error) {
            this.sendRedditPostAsText(discordChannel, post)
        } finally {
            await this.deleteVideoFile(`./${post.id}.mp4`)
        }
    }

    async deleteVideoFile(path) {
        try { await fs.unlink(path) } 
        catch (error) { this.logger.error(error) }
    }

    async getHighestQuality(url) {
        const availableQualities = [720, 480, 360, 240]
    
        for (const quality of availableQualities) {
            const response = await fetch(`${url}/DASH_${quality}.mp4`)
            if (response.status == 200) return quality
        }

        throw new Error("Impossible de récupérer la qualité de la vidéo") 
    }

    async sendRedditPostAsImage(discordChannel, post) {
        this.logger.info(`Sending post as image...`)
        if (await this.isImageSizeBiggerThan8Mb(post.url))
            return await this.sendRedditPostAsText(discordChannel, post)

        const file = { attachment: post.url }                
        if (post.over_18 || post.spoiler) file.name = `SPOILER_${post.id}.${this.getExtension(post.url)}`
        await discordChannel.send(post.title, { files: [file] })
    }

    async isImageSizeBiggerThan8Mb(urlImage) {
        const response = await fetch(urlImage)
        const imageSize = response.headers.get("content-length")
        return imageSize > 8000000
    }

    async sendRedditPostAsGallery(discordChannel, post) {
        this.logger.info(`Sending post as gallery...`)
        try {
            const files = []
            for (const item of post.gallery_data.items) {
                const media = post.media_metadata[item.media_id]
                const attachment = media.s.u
                const file = { attachment: attachment } 
                if (post.over_18 || post.spoiler) file.name = `SPOILER_${item.media_id}.${media.m.split('/').pop()}`
                files.push(file)
            }
            await discordChannel.send(post.title, { files: files })
        } catch (error) {
            this.sendRedditPostAsText(discordChannel, post)
        }
    }
    
    getDiscordChannels() {
        const discordChannels = []
        for (const [key, value] of this.client.channels.cache)
            if (value.parent !== null && value.parent.name === "Reddit")
                discordChannels.push(value)
        return discordChannels
    }

    IsUrlAnImage(url) {
        const extensions = ['jpg', 'jpeg', 'png', 'gif']
        const extension = this.getExtension(url)
        return extensions.includes(extension)
    }

    getExtension(url) {
        return url.split('.').pop()
    }
}