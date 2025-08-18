import { MessageFlags, SlashCommandBuilder } from "discord.js";
import SlashCommand from "../classes/slash_command";
import { CommandCallbackLocalizations, CommandLocalization } from "@types";
import { LocalizeString } from "../utils/utils";

const command_localization: CommandLocalization = {
    name: {},
    description: {
        'fr': 'Envoyez une requête ping au bot pour vérifier s\'il est actif !',
        'de': 'Pingen Sie den Bot an, um zu überprüfen, ob er aktiv ist!',
    }
};

const callback_localizations: CommandCallbackLocalizations = {
    response: {
        default: 'Pong ! ({delay} ms)',
    },
}

export default new SlashCommand({
    name: 'ping',
    guildSpecific: true,
    hideFromHelp: false,
    slashcommand: new SlashCommandBuilder()
        .setName('ping')
        .setNameLocalizations(command_localization.name)
        .setDescription('Ping the bot to check if it is alive !')
        .setDescriptionLocalizations(command_localization.description),
    callback: async (logger, client, interaction) => {
        logger.success('Successfully received usage of /ping from discord API');
        await interaction.reply({
            // Ping is calculated by subtracting the current timestamp from the interaction created timestamp
            // This is not the best way to calculate ping, but it is a good approximation
            content: LocalizeString(
                callback_localizations.response, interaction.locale,
                { delay: interaction.createdTimestamp - Date.now() },
            ),
            flags: MessageFlags.Ephemeral,
        })
    }
});