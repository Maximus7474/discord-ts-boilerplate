import { DiscordClient } from './types/client';
import Config from './utils/config';
import { Client, Collection, Events, GatewayIntentBits, Partials } from 'discord.js';

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
});

client.commands = new Collection();

client.login(Config.DISCORD_BOT_TOKEN);

client.once(Events.ClientReady, (client) => {
    console.log(`Successfully booted up and logged in as @${client.user.username}#${client.user.discriminator}`)
});