import { MessageFlags, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import SlashCommand from "../classes/slash_command";
import { CommandCallbackLocalizations, CommandLocalization } from "@types";
import { LocalizeString } from "../utils/utils";

const command_localization: CommandLocalization = {
    name: {
        'fr': 'aide',
        'de': 'hilfe',
    },
    description: {
        'fr': 'Afficher une liste de commandes disponibles.',
        'de': 'Eine Liste der verfügbaren Befehle anzeigen.',
    }
};

const callback_localizations: CommandCallbackLocalizations = {
    invalid_context: {
        default: 'This command only works in a server.',
        'fr': 'Cette commande ne fonctionne que sur un serveur.',
        'de': 'Dieser Befehl funktioniert nur auf einem Server.',
    },
    application_commands: {
        default: 'Application Commands',
        'fr': 'Commandes de l\'application',
        'de': 'Anwendungsbefehle',
    },
}

export default new SlashCommand({
    name: 'help',
    guildSpecific: false,
    hideFromHelp: true,
    slashcommand: new SlashCommandBuilder()
        .setName('help')
        .setNameLocalizations(command_localization.name)
        .setDescription('Displays a list of all available commands.')
        .setDescriptionLocalizations(command_localization.description),
    callback: async (logger, client, interaction) => {
        const locale = interaction.locale;

        if (!interaction.inGuild()) {
            await interaction.reply({
                content: LocalizeString(
                    callback_localizations.invalid_context,
                    locale
                ),
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        const memberPermissions = interaction.memberPermissions;

        const helpEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(LocalizeString(
                callback_localizations.application_commands,
                locale
            ));

        for (const [, cmd] of client.commands) {
            const commandData = cmd.register();

            if (
                    cmd.isHiddenForHelpCommand()
                || (
                        commandData.contexts
                    && interaction.context
                    && commandData.contexts.includes(interaction.context)
                )
            ) continue;
            
            const requiredPermissions = commandData.default_member_permissions;

            const resolvedPermissions = requiredPermissions !== undefined && requiredPermissions !== null
                ? BigInt(requiredPermissions)
                : null;

            const hasPermission = !resolvedPermissions || memberPermissions.has(resolvedPermissions);

            if (!(commandData.description && hasPermission)) continue;

            const commandName = commandData.name_localizations?.[locale] ?? commandData.name;
            const description = commandData.description_localizations?.[locale] ?? commandData.description;

            helpEmbed.addFields({
                name: `/${commandName}`,
                value: description,
                inline: false,
            });
        }

        await interaction.reply({
            embeds: [helpEmbed],
            flags: MessageFlags.Ephemeral,
        });
    }
});
