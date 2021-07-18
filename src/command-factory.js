import UnknownCommand from './commands/unknown.js'
import PingCommand from './commands/ping.js'
import WhereIsDocheCommand from './commands/doche-location.js'
import AdviceCommand from './commands/advice.js'
import PullRedditCommand from './commands/pull-reddit.js'
import RestartPullRedditCommand from './commands/restart-pull-reddit.js'

export default class CommandFactory {

    constructor(client) {
        this.client = client;
    }

    getCommand(interaction) {
        const commandName = interaction.data.name
        
        if (commandName === "ping") 
            return new PingCommand(this.client, interaction)

        if (commandName === "whereisdoche") 
            return new WhereIsDocheCommand(this.client, interaction)

        if (commandName === "advice") 
            return new AdviceCommand(this.client, interaction)

        if (commandName === "pull") 
            return new PullRedditCommand(this.client, interaction)

        if (commandName === "restart") 
            return new RestartPullRedditCommand(this.client, interaction)

        return new UnknownCommand(this.client, interaction)
    }
}