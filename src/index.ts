import { Client, Collection, Events, GatewayIntentBits, Partials } from 'discord.js';

import { DiscordClient } from './types/client';
import Config from './utils/config';

import LoadCommands from './utils/initialisation/load_commands';
import LoadEvents from './utils/initialisation/load_events';

import Logger from './utils/logger';
const logger = new Logger('INDEX');

const client: DiscordClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
    ],
}) as DiscordClient;

client.commands = new Collection();

LoadCommands(client);
LoadEvents(client);

client.login(Config.DISCORD_BOT_TOKEN);
