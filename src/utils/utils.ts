import { LocalizationCallbacks } from "@types";
import { Locale } from "discord.js";

const hasOwnProperty = Object.prototype.hasOwnProperty;

export function LocalizeString(
    locales: LocalizationCallbacks,
    localeKey: Locale,
    args: { [key: string]: string | number } = {},
): string {
    let localizedText = locales.default;

    if (locales[localeKey]) localizedText = locales[localeKey];

    if (!args) return localizedText;

    for (const argKey in args) {
        if (hasOwnProperty.call(args, argKey)) {
            const regex = new RegExp(`\\{${argKey}\\}`, 'g');
            localizedText = localizedText.replace(regex, String(args[argKey]));
        }
    }

    return localizedText;
}
