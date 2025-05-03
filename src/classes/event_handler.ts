import { ClientEvents } from "discord.js";
import { DiscordClient } from "../types/client";

import Logger from "../utils/logger";

/**
 * Represents an event handler for a Discord client.
 * This class is used to define and manage events, including their setup and execution.
 */
export default class EventHandler {

    private logger: Logger;
    private name: string;
    private eventName: keyof ClientEvents;
    private type: "on"|"once";
    private setup?: (logger: Logger, client: DiscordClient) => void;
    private callback: (logger: Logger, client: DiscordClient, ...args: any[]) => void;

    /**
     * Constructs an instance of the event handler.
     *
     * @param name - The name of the event handler.
     * @param eventName - The name of the event from the `ClientEvents` that this handler listens to.
     * @param type - Specifies whether the event handler should use "on" or "once" for the event listener.
     * @param callback - The function to be executed when the event is triggered. Receives a logger, the Discord client, and additional event arguments.
     * @param setup - (Optional) A function to perform setup logic. Receives a logger and the Discord client.
     */
    constructor (
        name: string,
        eventName: keyof ClientEvents,
        type: "on"|"once",
        callback: (logger: Logger, client: DiscordClient, ...args: any[]) => void,
        setup?: (logger: Logger, client: DiscordClient) => void,
    ) {
        this.logger = new Logger(`\x1b[35mEVT\x1b[0m:${name}`);
        this.name = name;
        this.eventName = eventName;
        this.type = type;
        this.callback = callback;
        if (setup) {
            this.setup = setup;
        }
    }

    register () {
        return {
            name: this.name,
            event: this.eventName,
            type: this.type,
        }
    }

    initialize (client: DiscordClient) {
        if (!this.setup) return;
        this.setup(this.logger, client);
    }

    call (client: DiscordClient, ...args: any[]) {
        if (!this.callback) {
            this.logger.error('No Callback is defined for the event !');
            return;
        }
        this.callback(this.logger, client, ...args);
    }
}