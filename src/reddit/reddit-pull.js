import Snoowrap from "snoowrap";
import fetch from "node-fetch";
import { Logger } from "../utils/log.js";
import chalk from "chalk";
import prettyMilliseconds from "pretty-ms";
import { MessageEmbed } from "discord.js";

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

            const prettyMs = prettyMilliseconds(timeTaken);
            const embed = new MessageEmbed()
                .setColor("#E6742B")
                .setTitle(
                    `📊 Finished sending posts successfully in ${prettyMs}!`
                );

            await redditDiscordChannel.send({ embed: embed });
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

            if (post.is_video)
                return await this.sendRedditPostAsVideo(discordChannel, post);

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

        const message = await discordChannel.send(
            `${post.title}\n${post.url}` + "\n```md\n" + post.selftext + "\n```"
        );

        await message.suppressEmbeds();
    }

    async sendRedditPostAsVideo(discordChannel, post) {
        Logger.verbose(`Sending post as video...`);
        try {
            const file = {
                attachment: `${post.url}/DASH_360.mp4`,
                name:
                    post.over_18 || post.spoiler
                        ? `SPOILER_${post.id}.mp4`
                        : `${post.id}.mp4`,
            };

            const message = await discordChannel.send(
                `${post.title}\n${post.url}`,
                {
                    files: [file],
                }
            );

            await message.suppressEmbeds();
        } catch (error) {
            Logger.error(error);
            await this.sendRedditPostAsText(discordChannel, post);
        }
    }

    async getHighestQuality(url) {
        const availableQualities = [720, 480, 360, 240];

        for (const quality of availableQualities) {
            const response = await fetch(`${url}/DASH_${quality}.mp4`);
            if (response.ok) return quality;
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
        const message = await discordChannel.send(
            `${post.title}\n${post.url}`,
            {
                files: [file],
            }
        );

        await message.suppressEmbeds();
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
            const message = await discordChannel.send(
                `${post.title}\n${post.url}`,
                {
                    files: files,
                }
            );
            await message.suppressEmbeds();
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
