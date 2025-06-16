import { AutocompleteInteraction, ChatInputCommandInteraction, Events } from "discord.js";
import EventHandler from "../classes/event_handler";

export default new EventHandler (
    'COMMANDS',
    Events.InteractionCreate,
    "on",
    (logger, client, interaction: ChatInputCommandInteraction | AutocompleteInteraction) => {
        if (interaction.isChatInputCommand()) {
            const commandCallback = client.commands.get(interaction.commandName);
            if (!commandCallback) return;

            commandCallback(client, interaction);
            return;
        }
        
        if (interaction.isAutocomplete()) {
            const commandAutoComplete = client.autocompleteCommands.get(interaction.commandName);
            if (!commandAutoComplete) return;

            commandAutoComplete(client, interaction);
            return;
        }
    }
);