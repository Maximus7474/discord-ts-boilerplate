import { AutocompleteInteraction, Client, Collection } from "discord.js";
import SlashCommand from "../classes/slash_command";

export type CommandCollection = Collection<string, SlashCommand>;
export type CommandAutocompleteCollections = Collection<string, (client: DiscordClient, interaction: AutocompleteInteraction) => void>;

export interface DiscordClient extends Client {
    commands: CommandCollection;
    autocompleteCommands: CommandCollection;
}