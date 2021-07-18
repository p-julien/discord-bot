import { Client } from 'discord.js';
import dotenv from 'dotenv';
import CommandFactory from './command-factory.js'
import cron from 'node-cron'
import RestartPullRedditCommand from './commands/restart-pull-reddit.js'

dotenv.config()
const client = new Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
    cron.schedule('0 20 * * *', () => {
        console.log("Task is ready for 20PM every day!")
        const pullReddit = new RestartPullRedditCommand(client, null)
        pullReddit.sendRedditPostsToDiscordChannels()
    });
});

client.ws.on('INTERACTION_CREATE', async interaction => {
    const commandFactory = new CommandFactory(client)
    await commandFactory.getCommand(interaction).run()
})

client.login(process.env.DISCORD_API_KEY);