import * as path from 'path';
import { DiscordClient } from '../../types/client';
import { getFilesFromDir } from '../utils';

import Logger from '../logger';
import StaticMessage from '../../classes/static_messages';
import { AnySelectMenuInteraction, ButtonInteraction } from 'discord.js';
const logger = new Logger('LoadStaticMessages');

export default (client: DiscordClient) => {
    const initialiseStaticMessage = async (client: DiscordClient) => {
        const callbackHandler = new Map<string, (client: DiscordClient, interaction: ButtonInteraction|AnySelectMenuInteraction) => Promise<void>>();
    
        const staticMessageDir = path.join(__dirname, '../../static_messages');
        const messages = getFilesFromDir(staticMessageDir);
    
        messages.forEach(async (file) => {
            const filePath = path.join(file);
            try {
                const staticMessageModule = await import(filePath);
    
                if (staticMessageModule && staticMessageModule.default) {
                    const { default: message } = staticMessageModule as { default: StaticMessage };
    
                    await message.initialize(client);
    
                    message.customIds.forEach((customId) => {
                        callbackHandler.set(customId, message.handleInteraction.bind(message));
                    });

                    logger.success(`Loaded static message: ${message.name}`)
                } else {
                    logger.warn(`Unable to static message: ${filePath.slice(staticMessageDir.length + 1)}`)
                }
            } catch (error) {
                console.error(`Failed to load static message: ${file}\n`, error);
            }
        });
    
        client.on('interactionCreate', async (interaction) => {
            if (interaction.isButton() || interaction.isAnySelectMenu()) {
                const { customId } = interaction;
                const handler = callbackHandler.get(customId);
                console.log(customId, callbackHandler.keys());
                if (handler) {
                    await handler(client, interaction);
                } else {
                    logger.warn(`No handler found for static message: ${customId}`);
                }
            }
        });
    }

    client.once('ready', async () => {
        await initialiseStaticMessage(client);
    });
}

