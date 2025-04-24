import * as path from 'path';
import { DiscordClient } from '../../types/client';
import { getFilesFromDir } from '../utils';
import EventHandler from '../../classes/event_handler';

import Logger from '../logger';
const logger = new Logger('LoadEvents');

export default (client: DiscordClient) => {
    const eventDir = path.join(__dirname, '../../events');
    const events = getFilesFromDir(eventDir);

    events.forEach((file) => {
        const filePath = path.join(file);
        try {
            const eventModule = require(filePath);

            if (eventModule && eventModule.default) {
                const { default: event } = eventModule as { default: EventHandler };

                const eventData = event.register();
                if (eventData.type === 'once') {
                    client.once(eventData.event, (...args) => event.call(client, ...args))
                }

                logger.success(`Loaded ${eventData.name} for event: ${eventData.event}`)
            } else {
                logger.warn(`Unable to load event: ${filePath.slice(eventDir.length + 1)}`)
            }
        } catch (error) {
            console.error(`Failed to load event: ${file}\n`, error);
        }
    })
}

