import { Client, Collection } from "discord.js";

export type CommandCollection = Collection<string, { execute: (...args: any[]) => void }>;

export interface DiscordClient extends Client {
    commands?: CommandCollection;
}