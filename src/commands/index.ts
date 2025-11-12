import SlashCommand from "../classes/slash_command";
import favorite_food from "./favorite_food";
import help from "./help";
import ping from "./ping";

export default [
    favorite_food,
    ping,
    help,
] as SlashCommand[];
