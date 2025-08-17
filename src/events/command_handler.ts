import { AutocompleteInteraction, ChatInputCommandInteraction, Events } from "discord.js";
import EventHandler from "../classes/event_handler";
import Logger from "../utils/logger";
import { DiscordClient } from "../types";

export default new EventHandler({
    name: 'COMMANDS',
    eventName: Events.InteractionCreate,
    type: "on",
    callback: (logger: Logger, client: DiscordClient, interaction: ChatInputCommandInteraction | AutocompleteInteraction) => {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            command.execute(client, interaction);
            return;
        }
        
        if (interaction.isAutocomplete()) {
            const command = client.autocompleteCommands.get(interaction.commandName);
            if (!command) return;

            command.executeAutocomplete(client, interaction);
            return;
        }
    }
});