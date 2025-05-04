import { DiscordClient } from "../types/client";

import Logger from "../utils/logger";
import { magenta } from "../utils/console_colours";
import { AnySelectMenuInteraction, ButtonInteraction } from "discord.js";

export default class StaticMessage {

    private logger: Logger;
    public customIds: string[];
    public name: string;
    private setup: (logger: Logger, client: DiscordClient) => Promise<void>;
    private callback?: (logger: Logger, client: DiscordClient, interaction: ButtonInteraction|AnySelectMenuInteraction) => Promise<void>

    constructor (
        name: string,
        customIds: string[],
        setup: (logger: Logger, client: DiscordClient) => Promise<void>,
        callback: (logger: Logger, client: DiscordClient, interaction: ButtonInteraction|AnySelectMenuInteraction) => Promise<void>,
    ) {
        this.name = name;
        this.logger = new Logger(`${magenta('MSG')}:${name}`);
        this.customIds = customIds || [];
        if (!setup) {
            throw new Error("StaticMessage setup function is required.");
        }
        this.setup = setup;
        this.callback = callback;
    }

    async initialize (client: DiscordClient): Promise<void> {
        await this.setup(this.logger, client);
    }

    getCustomIds (): string[] {
        return this.customIds;
    }

    handleInteraction (client: DiscordClient, interaction: ButtonInteraction|AnySelectMenuInteraction): Promise<void> {
        if (!this.callback) {
            this.logger.error(`No callback found for interaction ID: ${interaction.customId}`);
            return Promise.resolve();
        }
        return this.callback(this.logger, client, interaction);
    }
}