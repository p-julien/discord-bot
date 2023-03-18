import {
  Client,
  GatewayIntentBits,
  WebSocketShardEvents,
  Events,
  EmbedBuilder,
} from 'discord.js';
import { Advice } from './advices/advice.command';
import { BirthdayCron } from './birthdays/birthday.cron';
import { Ping } from './ping/ping.command';
import { Location } from './locations/location.command';
import { Pull } from './reddit/commands/pull.command';
import { Restart } from './reddit/commands/restart.command';
import { ScheduleRedditSubmissions } from './reddit/crons/reddit';
import {
  assertConfiguration,
  configuration,
} from './shared/configurations/sdk-configuration';
import { Command } from './shared/models/command';

export class DiscordBotClient {
  private readonly _discordClient: Client;

  constructor() {
    this._discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });
  }

  public withReady(): DiscordBotClient {
    this._discordClient.on(WebSocketShardEvents.Ready, (discordBot) => {
      if (!discordBot.user || !discordBot.application) {
        return;
      }

      console.log(`🌍 Logged in as ${discordBot.user.tag}!`);

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
          const commands: Command[] = [
            new Ping(interaction.client),
            new Advice(),
            new Pull(interaction.client),
            new Restart(interaction.client),
            new Location(interaction.client),
          ];

          const command = commands.find(
            (c) => c.name === interaction.commandName
          );

          await interaction.deferReply();

          if (!command) {
            interaction.followUp({
              ephemeral: true,
              embeds: [
                new EmbedBuilder()
                  .setColor(configuration.ui.embedColor)
                  .setTitle("Sorry this command doesn't exists 😕"),
              ],
            });
            return;
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
