import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';

import { DiscordClient } from './types/client';

import Config from './utils/config';
import LoadCommands from './utils/initialisation/load_commands';
import LoadEvents from './utils/initialisation/load_events';
import Database from './utils/database';

if (Database) Database.init();

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
