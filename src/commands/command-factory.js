import { UnknownCommand } from './unknown-command.js'
import { PingCommand } from './ping-command.js'
import { WhereIsDocheCommand } from './doche-location-command.js'
import { AdviceCommand } from './advice-command.js'
import { RedditPullCommand } from './pull-reddit-command.js'
import { RestartRedditPullCommand } from './restart-pull-reddit-command.js'

export class CommandFactory {

    constructor(client) {
        this.client = client;
    }

    getCommand(interaction) {
        try {
            const commandName = interaction.data.name
            console.log(`${interaction.member.user.username} asked for the command: ${commandName}`)
            
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

            throw new Exception(`Unknown command: ${commandName}`)
        } catch (error) {
            return new UnknownCommand(this.client, interaction)
        }
    }
}