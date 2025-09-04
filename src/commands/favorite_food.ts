import { AutocompleteInteraction, ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { DiscordClient } from "../types";
import Logger from "../utils/logger";
import SlashCommand from "../classes/slash_command";
import { prisma } from "../utils/prisma";

const choices = ["apple", "banana", "orange", "grape", "strawberry", "blueberry", "kiwi", "mango", "pineapple"];

export default new SlashCommand({
    name: "testautocomplete",
    guildSpecific: false,
    hideFromHelp: false,
    slashcommand: new SlashCommandBuilder()
        .setName("favoritefruit")
        .setDescription("A question to test autocomplete.")
        .addStringOption(option =>
            option.setName("item")
                .setDescription("Choose an fruit from the list.")
                .setAutocomplete(true) 
        ),
    callback: async (logger: Logger, client: DiscordClient, interaction: ChatInputCommandInteraction) => {
        const selectedItem = interaction.options.getString("item");
        const user_id = interaction.user.id;

        if (selectedItem) {
            const isCustom = !choices.find(e => e === selectedItem);
            
            await prisma.fav_food.upsert({
                where: { discord_id: user_id },
                create: {
                    discord_id: user_id,
                    favourite_food: selectedItem,
                    custom_choice: isCustom,
                },
                update: {
                    favourite_food: selectedItem,
                    custom_choice: isCustom,
                }
            });

            await interaction.reply({ content: `You selected: **${selectedItem}**`, flags: MessageFlags.Ephemeral });
        } else {
            const prevAnswer = await prisma.fav_food.findUnique({
                where: { discord_id: user_id }
            });

            if (prevAnswer) {
                await interaction.reply({
                    content: `You previously said that you favoured **${prevAnswer.favourite_food}**${prevAnswer.custom_choice ? ', a fascinating choice.' : '.'}`,
                    flags: MessageFlags.Ephemeral
                });
            } else {
                await interaction.reply({ content: "No fruit was selected :( .", flags: MessageFlags.Ephemeral });
            }
        }
    },
    autocomplete: async (logger: Logger, client: DiscordClient, interaction: AutocompleteInteraction) => {
        const focusedValue = interaction.options.getFocused();
        
        const filtered = choices.filter(choice => 
            choice.toLowerCase().startsWith(focusedValue.toLowerCase())
        );

        const responseChoices = filtered.slice(0, 25).map(choice => ({ name: choice, value: choice }));
        
        await interaction.respond(responseChoices);
    }
});
