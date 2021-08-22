import { Client } from 'discord.js';
import { CommandFactory } from './commands/command-factory.js'
import { RedditPull } from './reddit/reddit-pull.js'
import { MessageAttachment } from 'discord.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import FFmpeg from '@ffmpeg/ffmpeg';
import dotenv from 'dotenv';
import cron from 'node-cron'
import * as fs from 'fs';

dotenv.config()
const client = new Client();

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    await fetchRedditVideo("https://v.redd.it/kdt9es9am5i71")
    return
    cron.schedule('0 20 * * *', () => {
        console.log("Task is ready for 20PM every day!")
        const redditPull = new RedditPull(client)
        redditPull.sendRedditPostsToDiscordChannels()
    });
});

async function fetchRedditVideo(redditLink) {
    const redditPull = new RedditPull(client)
    const discordChannels = redditPull.getDiscordChannels()
    var https = require('https')
    const availableQualities = [720, 480, 360, 240]
    var highestQuality = 0

    for (let i = 0; i < availableQualities.length; i++) {
        const quality = availableQualities[i];
        https.get(`${redditLink}/DASH_${quality}.mp4`, function (res) {
            if (res.statusCode == 200) {
                highestQuality = quality
            }
        });
        if(highestQuality != 0) break
    }

    https.get(`${redditLink}/DASH_audio.mp4`, async function (res) {
        if (res.statusCode == 200) {
            let { createFFmpeg, fetchFile } = FFmpeg;
            let ffmpeg = createFFmpeg({
                log: true,
            });
            await ffmpeg.load();
            ffmpeg.FS('writeFile', 'video.mp4', await fetchFile(`${redditLink}/DASH_${highestQuality}.mp4`));
            ffmpeg.FS('writeFile', 'audio.mp4', await fetchFile(`${redditLink}/DASH_audio.mp4`));
            await ffmpeg.run('-i', 'video.mp4', '-i', 'audio.mp4', '-c', 'copy', 'output.mp4');
            let data = await ffmpeg.FS('readFile', 'output.mp4')
            data = new Uint8Array(data.buffer);
            fs.writeFile('C:\\Users\\codem\\Documents\\output.mp4', Buffer.from(data), (err) => {
                if(!err) console.log('Data written');
            });
            await discordChannels[3].send("**Test FFMPEG**", new MessageAttachment("C:\\Users\\codem\\Documents\\output.mp4"))
        } else {
            await discordChannels[3].send("**Test DASH**", new MessageAttachment(`${redditLink}/DASH_${highestQuality}.mp4`))
        }
    });
};

client.ws.on('INTERACTION_CREATE', async interaction => {
    try {
        const commandFactory = new CommandFactory(client)
        await commandFactory.getCommand(interaction).run()
    } catch (error) {
        console.error(`An error occured while responding to the command: ${interaction.data.name}`)
    }
})

client.login(process.env.DISCORD_API_KEY);