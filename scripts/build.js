/* eslint-disable */
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import pkg from 'colors';
const { red, green, blue } = pkg;
import migrateSQLFiles from "./migrate_database_templats.js";

const distPath = path.join(import.meta.url, "../dist");

if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
    console.log(green("✅ Cleaned old build files.\n"));
} else {
    console.log(blue("ℹ️  No previous build found, skipping clean.\n"));
}

exec("tsc", (error, stdout, stderr) => {
    if (error) {
        console.error(red(`❌ Build failed, ${error}`), `\n${stdout}`);
        process.exit(1);
    } else {
        console.log(green("✅ Build complete."));
        if (stdout) console.log(stdout);

        migrateSQLFiles();
        console.log(green("\n✅ SQL files migrated to dist folder."));
    }
});
