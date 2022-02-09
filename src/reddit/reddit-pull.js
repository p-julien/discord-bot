import Snoowrap from "snoowrap";
import fetch from "node-fetch";
import { promises as fs } from "fs";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { Logger } from "../utils/log.js";
import chalk from "chalk";

export class RedditPull {
    constructor(client) {
        this.client = client;
        this.snoowrap = new Snoowrap({
            userAgent: process.env.REDDIT_USER_AGENT,
            clientId: process.env.REDDIT_CLIENT_ID,
            clientSecret: process.env.REDDIT_CLIENT_SECRET,
            refreshToken: process.env.REDDIT_REFRESH_TOKEN,
        });
    }

    async sendRedditPostsToDiscordChannels() {
        var startTime = performance.now();
        Logger.verbose("Start of sending posts...");

        try {
            const discordChannels = this.getDiscordChannelsReddit();
            for (const discordChannel of discordChannels)
                await this.sendRedditPostsToDiscordChannel(discordChannel);

            var timeTaken = performance.now() - startTime;
            await this.sendPerformanceStatistics(timeTaken);
            Logger.info(
                `Finished sending posts successfully in ${timeTaken} ms! See you tomorrow ✨`
            );
        } catch (error) {
            Logger.error(error);
        }
    }

    async sendPerformanceStatistics(timeTaken) {
        Logger.info("Sending statistics to discord channel");
        try {
            const redditDiscordChannel = this.getDiscordChannels().find(
                (c) => c.name === "reddit"
            );

            if (redditDiscordChannel == null) return;

            await redditDiscordChannel.send(
                `Finished sending posts successfully in ${Number(
                    timeTaken
                ).toFixed(2)} ms! See you tomorrow ✨`
            );
        } catch (error) {
            Logger.error(error);
        }
    }

    async sendRedditPostsToDiscordChannel(discordChannel) {
        Logger.info(
            `Start of sending posts on channel ${chalk.whiteBright.bold(
                discordChannel.name
            )} [topic: ${chalk.whiteBright.bold(discordChannel.topic)}]`
        );
        try {
            if (discordChannel.topic == null) return;

            const subreddit = this.snoowrap.getSubreddit(discordChannel.topic);
            const posts = await subreddit.getTop({ time: "day", limit: 3 });

            for (const post of posts)
                await this.sendRedditPostToDiscordChannel(discordChannel, post);
        } catch (error) {
            Logger.error(error);
            await discordChannel.send({
                embed: {
                    color: 0xe6742b,
                    title: discordChannel.topic,
                    url: `https://www.reddit.com/r/${discordChannel.topic}`,
                    description: `Le reddit /r/${discordChannel.topic} ne semble pas disponible`,
                },
            });
        }
    }

    async sendRedditPostToDiscordChannel(discordChannel, post) {
        Logger.verbose(`Start of sending post: ${post.title}`);
        try {
            post.title = `**${post.title}**`;

            if (post.is_gallery)
                return await this.sendRedditPostAsGallery(discordChannel, post);

            if (this.IsUrlAnImage(post.url))
                return await this.sendRedditPostAsImage(discordChannel, post);

            // if (post.is_video)
            //     return await this.sendRedditPostAsVideo(discordChannel, post)

            if (post.selftext !== "")
                return await this.sendRedditPostAsContentText(
                    discordChannel,
                    post
                );

            await this.sendRedditPostAsText(discordChannel, post);
        } catch (error) {
            Logger.error(error);
        }
    }

    async sendRedditPostAsText(discordChannel, post) {
        Logger.verbose(`Sending post as default...`);
        if (post.over_18 || post.spoiler) post.url = `|| ${post.url} ||`;
        await discordChannel.send(`${post.title}\n${post.url}`);
    }

    async sendRedditPostAsContentText(discordChannel, post) {
        Logger.verbose(`Sending post as content text...`);
        if (post.over_18 || post.spoiler || post.selftext.length > 2000)
            return await this.sendRedditPostAsText(discordChannel, post);

        await discordChannel.send(
            post.title + "\n```md\n" + post.selftext + "\n```"
        );
    }

    async sendRedditPostAsVideo(discordChannel, post) {
        Logger.verbose(`Sending post as video...`);
        try {
            const highestQuality = await this.getHighestQuality(post.url);
            const response = await fetch(`${post.url}/DASH_audio.mp4`);

            if (response.status !== 200) {
                const dashFile = {
                    attachment: `${post.url}/DASH_${highestQuality}.mp4`,
                    name: `${post.id}.mp4`,
                };
                if (post.over_18 || post.spoiler)
                    dashFile.name = `SPOILER_${post.id}.mp4`;
                return await discordChannel.send(post.title, {
                    files: [dashFile],
                });
            }

            const ffmpeg = createFFmpeg();
            await ffmpeg.load();

            ffmpeg.FS(
                "writeFile",
                "video.mp4",
                await fetchFile(`${post.url}/DASH_${highestQuality}.mp4`)
            );
            ffmpeg.FS(
                "writeFile",
                "audio.mp4",
                await fetchFile(`${post.url}/DASH_audio.mp4`)
            );
            await ffmpeg.run(
                "-i",
                "video.mp4",
                "-i",
                "audio.mp4",
                "-c",
                "copy",
                `${post.id}.mp4`
            );

            let data = ffmpeg.FS("readFile", `${post.id}.mp4`);
            data = new Uint8Array(data.buffer);
            await fs.writeFile(`./${post.id}.mp4`, Buffer.from(data));

            ffmpeg.exit();

            const file = {
                attachment: `./${post.id}.mp4`,
                name: `${post.id}.mp4`,
            };
            if (post.over_18 || post.spoiler)
                file.name = `SPOILER_${post.id}.mp4`;
            await discordChannel.send(post.title, { files: [file] });
        } catch (error) {
            Logger.error(error);
            await this.sendRedditPostAsText(discordChannel, post);
        } finally {
            await this.deleteVideoFile(`./${post.id}.mp4`);
        }
    }

    async deleteVideoFile(path) {
        try {
            await fs.unlink(path);
        } catch (error) {
            Logger.error(error);
        }
    }

    async getHighestQuality(url) {
        const availableQualities = [720, 480, 360, 240];

        for (const quality of availableQualities) {
            const response = await fetch(`${url}/DASH_${quality}.mp4`);
            if (response.status === 200) return quality;
        }

        throw new Error("Impossible de récupérer la qualité de la vidéo");
    }

    async sendRedditPostAsImage(discordChannel, post) {
        Logger.verbose(`Sending post as image...`);
        if (await this.isImageSizeBiggerThan8Mb(post.url))
            return await this.sendRedditPostAsText(discordChannel, post);

        const file = { attachment: post.url };
        if (post.over_18 || post.spoiler)
            file.name = `SPOILER_${post.id}.${this.getExtension(post.url)}`;
        await discordChannel.send(post.title, { files: [file] });
    }

    async isImageSizeBiggerThan8Mb(urlImage) {
        const response = await fetch(urlImage);
        const imageSize = response.headers.get("content-length");
        return imageSize > 8000000;
    }

    async sendRedditPostAsGallery(discordChannel, post) {
        Logger.verbose(`Sending post as gallery...`);
        try {
            const files = [];
            for (const item of post.gallery_data.items) {
                const media = post.media_metadata[item.media_id];
                const attachment = media.s.u;
                const file = { attachment: attachment };
                if (post.over_18 || post.spoiler)
                    file.name = `SPOILER_${item.media_id}.${media.m
                        .split("/")
                        .pop()}`;
                files.push(file);
            }
            await discordChannel.send(post.title, { files: files });
        } catch (error) {
            await this.sendRedditPostAsText(discordChannel, post);
        }
    }

    getDiscordChannelsReddit() {
        const discordChannels = [];

        for (const [key, value] of this.client.channels.cache) {
            if (value.parent == null) continue;
            if (!value.parent.name.toLowerCase().includes("reddit")) continue;
            discordChannels.push(value);
        }

        return discordChannels.sort((a, b) => a.rawPosition - b.rawPosition);
    }

    getDiscordChannels() {
        const discordChannels = [];

        for (const [key, value] of this.client.channels.cache) {
            if (value.parent == null) continue;
            discordChannels.push(value);
        }

        return discordChannels.sort((a, b) => a.rawPosition - b.rawPosition);
    }

    IsUrlAnImage(url) {
        const extensions = ["jpg", "jpeg", "png", "gif"];
        const extension = this.getExtension(url);
        return extensions.includes(extension);
    }

    getExtension(url) {
        return url.split(".").pop();
    }
}
