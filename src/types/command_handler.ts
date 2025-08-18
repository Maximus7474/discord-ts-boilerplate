import { AutocompleteInteraction, ChatInputCommandInteraction, LocalizationMap, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import { DiscordClient } from "./client";
import type Logger from "../utils/logger";

export type SlashCommandBuilders = SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;

export interface SlashCommandOptions {
    name: string;
    guildSpecific?: boolean;
    hideFromHelp?: boolean;
    slashcommand: SlashCommandBuilders;
    callback: (logger: Logger, client: DiscordClient, interaction: ChatInputCommandInteraction) => Promise<void>;
    setup?: (logger: Logger, client: DiscordClient) => Promise<void>;
    autocomplete?: (logger: Logger, client: DiscordClient, interaction: AutocompleteInteraction) => Promise<void>;
}

type CommandOptionsLocalizations = {
    [key: string]: LocalizationMap;
};

export type LocalizationCallbacks = {
    default: string;
} & LocalizationMap;

export type CommandLocalization = {
    name: LocalizationMap;
    description: LocalizationMap;
    options?: CommandOptionsLocalizations;
};

export type CommandCallbackLocalizations = {
    [key: string]: LocalizationCallbacks;
}
