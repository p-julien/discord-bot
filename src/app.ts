import { configuration } from './configurations/configuration';
import { createDiscordApp } from './configurations/create-discord-app';

const settings = configuration();
const discordApp = createDiscordApp(settings);

discordApp.listen();
