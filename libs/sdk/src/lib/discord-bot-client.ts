import {
  Client,
  GatewayIntentBits,
  WebSocketShardEvents,
  Events,
  EmbedBuilder,
} from 'discord.js';
import { BirthdayCron } from './birthdays/birthday.cron';
import { ScheduleRedditSubmissions } from './reddit/crons/reddit';
import {
  assertConfiguration,
  configuration,
} from './shared/configurations/sdk-configuration';
import { Command } from './shared/models/command';
import { getCommands, updateCommands } from './shared/helpers/update-commands';

export class DiscordBotClient {
  private readonly _discordClient: Client;

  constructor() {
    this._discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });
  }

  public withReady(): DiscordBotClient {
    this._discordClient.on(WebSocketShardEvents.Ready, async (discordBot) => {
      if (!discordBot.user || !discordBot.application) {
        return;
      }

      console.log(`🌍 Logged in as ${discordBot.user.tag}!`);

      await updateCommands(discordBot);

      const crons = [
        new ScheduleRedditSubmissions(discordBot),
        new BirthdayCron(discordBot),
      ];

      for (const cronTask of crons) {
        cronTask.execute();
      }
    });

    return this;
  }

  public withInteractionCreate(): DiscordBotClient {
    this._discordClient.on(Events.InteractionCreate, async (interaction) => {
      if (
        interaction.isChatInputCommand() ||
        interaction.isUserContextMenuCommand()
      ) {
        try {
          const commands: Command[] = getCommands(this._discordClient);

          const command = commands.find(
            ({ name }) => name === interaction.commandName
          );

          if (!command) {
            const embed = new EmbedBuilder()
              .setColor(configuration.ui.embedColor)
              .setTitle("Désolé cette commande n'existe pas 😕");

            return interaction
              .reply({ ephemeral: true, embeds: [embed] })
              .then();
          }

          console.info(
            `🆗 ${interaction.user.username} asked for the command ${interaction.commandName}`
          );

          command.run(interaction);
        } catch (error) {
          console.error(
            `❌ An error occured while responding to the command: ${interaction.commandName}`
          );
        }
      }
    });

    return this;
  }

  public start(): DiscordBotClient {
    assertConfiguration();

    this._discordClient
      .login(configuration.discord.token)
      .catch((err) => console.error('❌', err));

    return this;
  }
}
