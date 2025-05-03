import { ClientEvents } from "discord.js";
import { DiscordClient } from "../types/client";

import Logger from "../utils/logger";

export default class EventHandler {

    private logger: Logger;
    private name: string;
    private eventName: keyof ClientEvents;
    private type: "on"|"once";
    private setup?: (logger: Logger, client: DiscordClient) => void;
    private callback: (logger: Logger, client: DiscordClient, ...args: any[]) => void;

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