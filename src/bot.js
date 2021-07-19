import { Client } from 'discord.js';
import { CommandFactory } from './commands/command-factory.js'
import { RedditPull } from './reddit/reddit-pull.js'
import dotenv from 'dotenv';
import cron from 'node-cron'

dotenv.config()
const client = new Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
    cron.schedule('0 20 * * *', () => {
        console.log("Task is ready for 20PM every day!")
        const redditPull = new RedditPull(client)
        redditPull.sendRedditPostsToDiscordChannels()
    });
});

client.ws.on('INTERACTION_CREATE', async interaction => {
    try {
        const commandFactory = new CommandFactory(client)
        await commandFactory.getCommand(interaction).run()
    } catch (error) {
        console.error(`An error occured while responding to the command: ${interaction.data.name}`)
    }
})

client.login(process.env.DISCORD_API_KEY);