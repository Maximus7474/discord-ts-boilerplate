import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { DiscordClient } from "../types/client";

import Logger from "../utils/logger";

export default class SlashCommand {

    private logger: Logger;
    private command_data: SlashCommandBuilder;
    private callback: (logger: Logger, client: DiscordClient, interaction: ChatInputCommandInteraction) => Promise<void>;
    private setup?: (logger: Logger, client: DiscordClient) => Promise<void>;

    constructor (
        name: string,
        slashcommand: SlashCommandBuilder,
        callback: (logger: Logger, client: DiscordClient, interaction: ChatInputCommandInteraction) => Promise<void>,
        setup?: (logger: Logger, client: DiscordClient) => Promise<void>,
    ) {
        this.logger = new Logger(name);
        this.command_data = slashcommand;
        this.callback = callback;
        if (setup) {
            this.setup = setup;
        }
    }

    register () {
        return this.command_data;
    }

    initialize (client: DiscordClient) {
        if (!this.setup) return;
        this.setup(this.logger, client);
    }

    execute (client: DiscordClient, interaction: ChatInputCommandInteraction) {
        if (!this.callback) {
            this.logger.error('No callback function exists !');
            return;
        }
        this.callback(this.logger, client, interaction);
    }
}