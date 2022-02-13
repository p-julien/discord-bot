import { Client, MessageEmbed, TextChannel } from "discord.js";
import prettyMilliseconds from "pretty-ms";
import Snoowrap, { Submission } from "snoowrap";
import fetch from "node-fetch";

export class Reddit {
    private readonly URL_REDDIT = "https://www.reddit.com";
    private readonly EMBED_TIMEOUT = 1000;
    private r = new Snoowrap({
        userAgent: "burgerexpress:v1.0.0 (by /u/href404)",
        clientId: process.env.REDDIT_CLIENT_ID,
        clientSecret: process.env.REDDIT_CLIENT_SECRET,
        refreshToken: process.env.REDDIT_REFRESH_TOKEN,
    });

    constructor(private discord: Client) {}

    async sendSubmissionsToChannels() {
        const startTime = performance.now();

        const channels = this.getChannelsReddit();
        channels.forEach(
            async (channel) => await this.sendSubmissionsToChannel(channel)
        );

        const timeTaken = performance.now() - startTime;
        await this.sendStats(timeTaken);
    }

    async sendSubmissionsToChannel(channel: TextChannel) {
        if (channel.topic == null) return;

        const subreddit = this.r.getSubreddit(channel.topic);
        const submissions = await subreddit.getTop({ time: "day", limit: 3 });

        submissions.forEach(
            async (submission) =>
                await this.sendSubmissionToChannel(channel, submission)
        );
    }

    private async sendSubmissionToChannel(
        channel: TextChannel,
        submission: any
    ) {
        submission.title = `**${submission.title}**`;

        if (submission.is_gallery)
            return await this.sendSubmissionAsGallery(channel, submission);

        if (this.IsUrlAnImage(submission.url))
            return await this.sendSubmissionAsImage(channel, submission);

        if (submission.is_video)
            return await this.sendSubmissionAsVideo(channel, submission);

        if (submission.selftext !== "")
            return await this.sendSubmissionAsContentText(channel, submission);

        await this.sendSubmissionAsText(channel, submission);
    }

    private async sendSubmissionAsText(
        channel: TextChannel,
        submission: Submission
    ) {
        if (submission.over_18 || submission.spoiler)
            submission.url = `|| ${submission.url} ||`;
        await channel.send(`${submission.title}\n${submission.url}`);
    }

    private async sendSubmissionAsContentText(
        channel: TextChannel,
        submission: Submission
    ) {
        if (
            submission.over_18 ||
            submission.spoiler ||
            submission.selftext.length > 2000
        )
            return await this.sendSubmissionAsText(channel, submission);

        const message = await channel.send(
            `${submission.title}\n${this.URL_REDDIT + submission.permalink}` +
                "\n```md\n" +
                submission.selftext +
                "\n```"
        );

        setTimeout(
            async () => await message.suppressEmbeds(),
            this.EMBED_TIMEOUT
        );
    }

    private async sendSubmissionAsVideo(
        channel: TextChannel,
        submission: Submission
    ) {
        const file = {
            attachment: `${submission.url}/DASH_360.mp4`,
            name:
                submission.over_18 || submission.spoiler
                    ? `SPOILER_${submission.id}.mp4`
                    : `${submission.id}.mp4`,
        };

        const message = await channel.send({
            content: `${submission.title}\n${
                this.URL_REDDIT + submission.permalink
            }`,
            files: [file],
        });

        setTimeout(
            async () => await message.suppressEmbeds(),
            this.EMBED_TIMEOUT
        );
    }

    private async sendSubmissionAsGallery(
        channel: TextChannel,
        submission: any
    ) {
        const files = [];
        for (const item of submission.gallery_data.items) {
            const media = submission.media_metadata[item.media_id];
            const attachment = media.s.u;
            const file = {
                attachment: attachment,
                name:
                    submission.over_18 || submission.spoiler
                        ? `SPOILER_${item.media_id}.${media.m.split("/").pop()}`
                        : `${item.media_id}.${media.m.split("/").pop()}`,
            };
            files.push(file);
        }
        const message = await channel.send({
            content: `${submission.title}\n${
                this.URL_REDDIT + submission.permalink
            }`,
            files: files,
        });

        setTimeout(
            async () => await message.suppressEmbeds(),
            this.EMBED_TIMEOUT
        );
    }

    private async sendSubmissionAsImage(
        channel: TextChannel,
        submission: Submission
    ) {
        if (await this.isImageSizeBiggerThan8Mb(submission.url))
            return await this.sendSubmissionAsText(channel, submission);

        const file = {
            attachment: submission.url,
            name:
                submission.over_18 || submission.spoiler
                    ? `SPOILER_${submission.id}.${this.getExtension(
                          submission.url
                      )}`
                    : `${submission.id}.${this.getExtension(submission.url)}`,
        };

        const message = await channel.send({
            content: `${submission.title}\n${
                this.URL_REDDIT + submission.permalink
            }`,
            files: [file],
        });

        setTimeout(
            async () => await message.suppressEmbeds(),
            this.EMBED_TIMEOUT
        );
    }

    private async isImageSizeBiggerThan8Mb(urlImage: string) {
        const response = await fetch(urlImage);
        const imageSize = Number(response.headers.get("content-length"));
        return imageSize > 8000000;
    }

    private IsUrlAnImage(url: string) {
        const extension = this.getExtension(url);
        if (!extension) return false;

        const extensions = ["jpg", "jpeg", "png", "gif"];
        return extensions.includes(extension);
    }

    private getExtension(url: string) {
        return url.split(".").pop();
    }

    private getChannelsReddit() {
        const channelsReddit = this.getChannels();
        return channelsReddit.filter((channel) =>
            channel.parent?.name.toLowerCase().includes("reddit")
        );
    }

    private getChannels() {
        const channels = new Array<TextChannel>();
        this.discord.channels.cache.forEach((channel) => {
            if (channel.type == "GUILD_TEXT") channels.push(channel);
        });

        return channels.sort((a, b) => a.rawPosition - b.rawPosition);
    }

    private async sendStats(timeTaken: number) {
        const redditChannel = this.getChannels().find(
            (channel: TextChannel) => channel.name === "reddit"
        );

        if (redditChannel == null) return;

        const prettyMs = prettyMilliseconds(timeTaken);
        const embed = new MessageEmbed()
            .setColor("#E6742B")
            .setTitle(`📊 Finished sending posts successfully in ${prettyMs}!`);

        if (redditChannel.type != "GUILD_TEXT") return;
        await redditChannel.send({ embeds: [embed] });
    }
}
