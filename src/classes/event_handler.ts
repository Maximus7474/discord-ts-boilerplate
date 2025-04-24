import { ClientEvents } from "discord.js";
import { DiscordClient } from "../types/client";

import Logger from "../utils/logger";

export default class EventHandler {

    private logger: Logger;
    private eventName: keyof ClientEvents;
    private type: "on"|"once";
    private setup?: (logger: Logger, client: DiscordClient) => void;
    
    callback: (logger: Logger, client: DiscordClient, ...args: any[]) => void;

    constructor (
        name: string,
        eventName: keyof ClientEvents,
        type: "on"|"once",
        callback: (logger: Logger, client: DiscordClient, ...args: any[]) => void,
        setup?: (logger: Logger, client: DiscordClient) => void,
    ) {
        this.logger = new Logger(name);
        this.eventName = eventName;
        this.type = type;
        this.callback = callback;
        if (setup) {
            this.setup = setup;
        }
    }

    register () {
        return {
            event: this.eventName,
            type: this.type,
        }
    }

    initialize (client: DiscordClient) {
        if (!this.setup) return;
        this.setup(this.logger, client);
    }
}