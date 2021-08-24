import { UnknownCommand } from './unknown-command.js'
import { PingCommand } from './ping-command.js'
import { WhereIsDocheCommand } from './doche-location-command.js'
import { AdviceCommand } from './advice-command.js'
import { RedditPullCommand } from './pull-reddit-command.js'
import { RestartRedditPullCommand } from './restart-pull-reddit-command.js'
import { Logger } from '../utils/log.js'
import { getDiscordChannel } from '../utils/discord-interaction.js'

export class CommandFactory {

    constructor(client) {
        this.client = client;
        this.logger = new Logger();
    }

    getCommand(interaction) {
        try {
            const username = interaction.member.user.username
            const commandName = interaction.data.name
            const channelName = getDiscordChannel(this.client, interaction).name

            this.logger.info(`${username} asked for the command ${commandName} in the channel ${channelName}`)
            
            if (commandName === "ping") 
                return new PingCommand(this.client, interaction)
    
            if (commandName === "whereisdoche") 
                return new WhereIsDocheCommand(this.client, interaction)
    
            if (commandName === "advice") 
                return new AdviceCommand(this.client, interaction)
    
            if (commandName === "pull") 
                return new RedditPullCommand(this.client, interaction)
    
            if (commandName === "restart") 
                return new RestartRedditPullCommand(this.client, interaction)

            throw new Error(`Unknown command: ${commandName}`)
        } catch (error) {
            this.logger.error(error)
            return new UnknownCommand(this.client, interaction)
        }
    }
}