import * as path from 'path';
import SlashCommand from '../../classes/slash_command';
import { DiscordClient } from '../../types';
import { getFilesFromDir } from '../utils';

import Logger from '../logger';
const logger = new Logger('LoadCommands');

export default (client: DiscordClient) => {
    const commands = getFilesFromDir(path.join(__dirname, '../../commands'));

    commands.forEach(async (file) => {
        const filePath = path.join(file);
        try {
            const commandModule = await import(filePath);

            if (commandModule && commandModule.default) {
                const { default: command } = commandModule as { default: SlashCommand };

                client.commands.set(command.register().name, command);

                logger.success(`Loaded /${command.register().name}`);
            }
        } catch (error) {
            console.error(`Failed to load command ${file}:`, error);
        }
    })
}

