import * as path from 'path';
import { DiscordClient } from '../../types/client';
import { getFilesFromDir } from '../utils';
import EventHandler from '../../classes/event_handler';

export default (client: DiscordClient) => {
    const commands = getFilesFromDir(path.join(__dirname, '../../events'));

    commands.forEach((file) => {
        const filePath = path.join(file);
        try {
            const eventModule = require(filePath);

            if (eventModule && eventModule.default) {
                const { default: event } = eventModule as { default: EventHandler };

                const eventData = event.register();
                if (eventData.type === 'once') {
                    client.once(eventData.event, (...args) => event.call(client, ...args))
                } 
            }
        } catch (error) {
            console.error(`Failed to load command ${file}:`, error);
        }
    })
}

