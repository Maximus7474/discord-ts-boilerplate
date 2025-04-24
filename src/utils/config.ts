import dotenv from 'dotenv';

dotenv.config();

const fields = {
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
    MAIN_GUILD: process.env.MAIN_GUILD,
};

interface Config {
    DISCORD_BOT_TOKEN: string;
    MAIN_GUILD: string|false;
};

if (!fields.DISCORD_BOT_TOKEN) {
    throw new Error('No Discord Token was provided in the environment variables, make sure it\'s set under "DISCORD_BOT_TOKEN"')
}

const env: Config = {
    DISCORD_BOT_TOKEN: fields.DISCORD_BOT_TOKEN,
    MAIN_GUILD: fields.MAIN_GUILD ?? false,
}

export default env;