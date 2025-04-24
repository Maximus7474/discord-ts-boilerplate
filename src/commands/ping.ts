import { MessageFlags, SlashCommandBuilder } from "discord.js";
import SlashCommand from "../classes/slash_command";

export default new SlashCommand(
    'ping',
    new SlashCommandBuilder()
    .setName('ping'),
    async (logger, client, interaction) => {
        logger.success('Successfully received usage of /ping from discord API');
        await interaction.reply({
            content: `Pong ! (${Date.now() - interaction.createdTimestamp} ms)`,
            flags: MessageFlags.Ephemeral,
        })
    }
);