import { Events } from "discord.js";
import EventHandler from "../classes/event_handler";

export default new EventHandler (
    'COMMANDS',
    Events.InteractionCreate,
    "on",
    (logger, client, interaction) => {
        if (!interaction.isChatInputCommand()) return;
        
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        command(client, interaction);
    }
);