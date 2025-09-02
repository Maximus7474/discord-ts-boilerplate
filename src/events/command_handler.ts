import { AutocompleteInteraction, ChatInputCommandInteraction, Events, MessageFlags } from "discord.js";
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

            try {
                command.execute(client, interaction);
            } catch (err: any) { // eslint-disable-line
                logger.error(`An error occured with the command callback of ${interaction.commandName}:`, err);

                if (!interaction.replied) {
                    interaction.reply({
                        content: 'An error occured, please contact the developers.',
                        flags: MessageFlags.Ephemeral,
                    });
                } else {
                    interaction.editReply({
                        content: 'An error occured during the command execution, please contact the developers.',
                    });
                }
            };

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