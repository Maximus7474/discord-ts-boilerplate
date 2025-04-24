import * as fs from 'fs';
import * as path from 'path';
import SlashCommand from '../../classes/slash_command';
import { DiscordClient } from '../../types/client';

function getFilesFromDir(dirPath: string): string[] {
    const files: string[] = [];

    const items = fs.readdirSync(dirPath);

    items.forEach((item) => {
        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
            files.push(...getFilesFromDir(itemPath));
        } else if (stats.isFile() && (item.endsWith('.ts') || item.endsWith('.js'))) {
            files.push(itemPath);
        }
    });

    return files;
}

export default (client: DiscordClient) => {
    const commands = getFilesFromDir(path.join(__dirname, '../../commands'));

    commands.forEach((file) => {
        const filePath = path.join(file);
        try {
            const commandModule = require(filePath);

            if (commandModule && commandModule.default) {
                const { default: command } = commandModule as { default: SlashCommand };

                client.commands.set(command.register().name, command);
            }
        } catch (error) {
            console.error(`Failed to load command ${file}:`, error);
        }
    })
}

