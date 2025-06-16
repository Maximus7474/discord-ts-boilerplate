import { Client, Collection } from "discord.js";
import SlashCommand from "../classes/slash_command";

export type CommandCollection = Collection<string, (client: DiscordClient, interaction: ChatInputCommandInteraction) => void>;

export interface DiscordClient extends Client {
    commands: CommandCollection;
}