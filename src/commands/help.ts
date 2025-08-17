import { MessageFlags, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import SlashCommand from "../classes/slash_command";

export default new SlashCommand({
    name: 'help',
    guildSpecific: false,
    slashcommand: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays a list of all available commands.'),
    callback: async (logger, client, interaction) => {
        if (!interaction.inGuild()) {
            await interaction.reply({
                content: "This command only works in a server.",
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        const memberPermissions = interaction.memberPermissions;

        const helpEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Available Commands');

        client.commands.forEach(command => {
            const commandData = command.register();
            
            const requiredPermissions = commandData.default_member_permissions;

            const resolvedPermissions = requiredPermissions !== undefined && requiredPermissions !== null
                ? BigInt(requiredPermissions)
                : null;


            const hasPermission = !resolvedPermissions || memberPermissions.has(resolvedPermissions);

            if (commandData.description && hasPermission) {
                helpEmbed.addFields({
                    name: `/${commandData.name}`,
                    value: commandData.description,
                    inline: false,
                });
            }
        });

        await interaction.reply({
            embeds: [helpEmbed],
            flags: MessageFlags.Ephemeral,
        });
    }
});
