import { AutocompleteInteraction, ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { DiscordClient } from "../types";
import Logger from "../utils/logger";
import SlashCommand from "../classes/slash_command";
import { CommandCallbackLocalizations, CommandLocalization } from "@types";
import { LocalizeString } from "../utils/utils";

const command_localization: CommandLocalization = {
    name: {
        'fr': 'fruitprefere',
        'de': 'lieblingsobst',
    },
    description: {
        'fr': 'Une question pour tester la saisie semi-automatique.',
        'de': 'Eine Frage zum Testen der Autovervollständigung.',
    },
    options: {
        item: {
            name: {
                'fr': 'fruit',
                'de': 'frucht',
            },
            description: {
                'fr': 'Choisissez un fruit dans la liste.',
                'de': 'Wählen Sie eine Frucht aus der Liste aus.',
            },
        }
    }
};

const callback_localizations: CommandCallbackLocalizations = {
    selected_item: {
        default: 'You selected **{item}**.',
        'fr': 'Vous avez sélectionné **{item}**.',
        'de': 'Sie haben **{item}** ausgewählt.',
    },
    no_selection: {
        default: 'No fruit was selected :( .',
        'fr': 'Aucun fruit n\'a été sélectionné :( .',
        'de': 'Es wurde keine Frucht ausgewählt :( .',
    },
}

export default new SlashCommand({
    name: "testautocomplete",
    guildSpecific: false,
    hideFromHelp: false,
    slashcommand: new SlashCommandBuilder()
        .setName("favoritefruit")
        .setNameLocalizations(command_localization.name)
        .setDescription("A question to test autocomplete.")
        .setDescriptionLocalizations(command_localization.description)
        .addStringOption(option =>
            option.setName("item")
                .setNameLocalizations(command_localization.options!.item.name)
                .setDescription("Choose an fruit from the list.")
                .setDescriptionLocalizations(command_localization.options!.item.description)
                .setAutocomplete(true) 
        ),
    callback: async (logger: Logger, client: DiscordClient, interaction: ChatInputCommandInteraction) => {
        const selectedItem = interaction.options.getString("item");
        if (selectedItem) {
            await interaction.reply({
                content: LocalizeString(
                    callback_localizations.selected_item, interaction.locale
                ),
                flags: MessageFlags.Ephemeral
            });
        } else {
            await interaction.reply({
                content: LocalizeString(
                    callback_localizations.no_selection, interaction.locale
                ),
                flags: MessageFlags.Ephemeral
            });
        }
    },
    autocomplete: async (logger: Logger, client: DiscordClient, interaction: AutocompleteInteraction) => {
        const focusedValue = interaction.options.getFocused();
        const choices = ["apple", "banana", "orange", "grape", "strawberry", "blueberry", "kiwi", "mango", "pineapple"];
        
        const filtered = choices.filter(choice => 
            choice.toLowerCase().startsWith(focusedValue.toLowerCase())
        );

        const responseChoices = filtered.slice(0, 25).map(choice => ({ name: choice, value: choice }));
        
        await interaction.respond(responseChoices);
    }
});
