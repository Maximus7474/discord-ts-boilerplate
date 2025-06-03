import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { DiscordClient } from "../types";

import Logger from "../utils/logger";
import { magenta } from "../utils/console_colours";

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
        this.logger = new Logger(`${magenta('CMD')}:${name}`);
        this.guildSpecific = guildSpecific;
        this.command_data = slashcommand;
        this.callback = callback;
        this.setup = setup;
    }

    /**
     * Determines whether the slash command is specific to a guild.
     *
     * @returns {boolean} `true` if the command is guild-specific, otherwise `false`.
     */
    isGuildSpecific (): boolean {
        return this.guildSpecific;
    }

    /**
     * Registers the slash command by returning its command data.
     *
     * @returns The data representing the slash command.
     */
    register (): SlashCommandBuilder {
        return this.command_data;
    }

    /**
     * Initializes the slash command by invoking the `setup` method if it is defined.
     *
     * @param client - The Discord client instance used to initialize the command.
     */
    initialize (client: DiscordClient): void {
        if (!this.setup) return;
        try {
            this.setup(this.logger, client);
        } catch (error) {
            this.logger.error('Error during setup:', error);
        }
    }

    /**
     * Executes the slash command by invoking the associated callback function.
     *
     * @param client - The Discord client instance.
     * @param interaction - The interaction object representing the slash command invocation.
     * 
     * @remarks
     * If no callback function is defined, an error is logged and the method returns early.
     */
    execute (client: DiscordClient, interaction: ChatInputCommandInteraction): void {
        if (!this.callback) {
            this.logger.error('No callback function exists !');
            return;
        }
        this.callback(this.logger, client, interaction);
    }
}