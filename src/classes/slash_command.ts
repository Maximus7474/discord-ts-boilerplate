import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { DiscordClient } from "../types/client";

import Logger from "../utils/logger";

/**
 * Represents a Slash Command for a Discord bot.
 * This class encapsulates the data and behavior required to define, register, and execute a slash command.
 */
export default class SlashCommand {

    private logger: Logger;
    private guildSpecific: boolean = false;
    private command_data: SlashCommandBuilder;
    private callback: (logger: Logger, client: DiscordClient, interaction: ChatInputCommandInteraction) => Promise<void>;
    private setup?: (logger: Logger, client: DiscordClient) => Promise<void>;

    /**
     * Creates a new SlashCommand instance.
     * 
     * @param name - The name of the slash command.
     * @param guildSpecific - Whether the command is specific to a guild.
     * @param slashcommand - The SlashCommandBuilder instance containing the command's data.
     * @param callback - The function to execute when the command is invoked.
     * @param setup - (Optional) A setup function to initialize the command.
     */
    constructor (
        name: string,
        guildSpecific: boolean,
        slashcommand: SlashCommandBuilder,
        callback: (logger: Logger, client: DiscordClient, interaction: ChatInputCommandInteraction) => Promise<void>,
        setup?: (logger: Logger, client: DiscordClient) => Promise<void>,
    ) {
        this.logger = new Logger(`\x1b[35mCMD\x1b[0m:${name}`);
        this.guildSpecific = guildSpecific;
        this.command_data = slashcommand;
        this.callback = callback;
        if (setup) {
            this.setup = setup;
        }
    }

    isGuildSpecific (): boolean {
        return this.guildSpecific;
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