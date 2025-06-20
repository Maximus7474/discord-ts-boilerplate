/* eslint-disable */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const databaseHandlerPath = path.join(__dirname, '..', 'src', 'utils', 'database', 'index.ts');
const importRegex = /import DBHandler from '\.\/[A-Za-z0-9]+';/i;

const DB_CONNECTORS = {
    '1': {
        name: 'SQLite (better-sqlite3)',
        packageName: 'better-sqlite3',
        importLine: "import DBHandler from './sqlite';",
    },
    // ToDo: create implementation for it
    // '2': {
    //     name: 'MySQL (mysql2)',
    //     packageName: 'mysql2',
    //     importLine: "import DBHandler from './mysql';",
    // },
};

function detectPackageManager() {
    const userAgent = process.env.npm_config_user_agent;

    if (userAgent) {
        if (userAgent.includes('pnpm')) {
            return 'pnpm';
        }
        if (userAgent.includes('yarn')) {
            return 'yarn';
        }
        if (userAgent.includes('npm')) {
            return 'npm';
        }
    }

    throw new Error('Could not detect package manager from npm_config_user_agent.');
}

function installDBPackage(packageManager, packageName) {
    console.log(`\n--- Installing ${packageName} using ${packageManager} ---`);
    try {
        let command;
        if (packageManager === 'npm') {
            command = `npm install ${packageName}`;
        } else if (packageManager === 'pnpm') {
            command = `pnpm add ${packageName}`;
        } else if (packageManager === 'yarn') {
            command = `yarn add ${packageName}`;
        } else {
            throw new Error(`Unsupported package manager: ${packageManager}`);
        }
        console.log(command);
        execSync(command, { stdio: 'inherit' });
        console.log(`Successfully installed ${packageName}.`);
    } catch (error) {
        console.error(`Error installing ${packageName}:`, error.message);
        process.exit(1);
    }
}

function updateImportPath(filePath, searchRegex, newImportLine, newTestCode) {
    console.log(`\n--- Updating import path in ${filePath} ---`);
    try {
        let fileContent = fs.readFileSync(filePath, 'utf8');

        if (!searchRegex.test(fileContent)) {
            console.warn(`Warning: Placeholder import not found in ${filePath}. Skipping import update.`);
        }

        // Replace the specific placeholder import line
        fileContent = fileContent.replace(searchRegex, newImportLine);

        fs.writeFileSync(filePath, fileContent, 'utf8');
        console.log(`Successfully updated ${filePath} with the new import.`);
    } catch (error) {
        console.error(`Error updating ${filePath}:`, error.message);
        process.exit(1);
    }
}

async function chooseDBConnector(question, options) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        console.log(`\n${question}`);
        for (const key in options) {
            console.log(`  ${key}. ${options[key].name}`);
        }

        rl.question('\nEnter your choice: ', (answer) => {
            rl.close();
            if (options[answer]) {
                resolve(answer);
            } else {
                console.error('Invalid choice. Please run the script again and select a valid option.');
                process.exit(1);
            }
        });
    });
}

async function main() {
    console.log('Starting database setup script...');

    const packageManager = detectPackageManager();
    console.log(`Detected package manager: ${packageManager}`);

    const choice = await chooseDBConnector('Which database connector would you like to install?', DB_CONNECTORS);
    const selectedConnector = DB_CONNECTORS[choice];

    if (!selectedConnector) {
        console.error('No valid database connector selected. Exiting.');
        process.exit(1);
    }

    installDBPackage(packageManager, selectedConnector.packageName);

    updateImportPath(
        databaseHandlerPath,
        importRegex,
        selectedConnector.importLine,
        selectedConnector.testCode
    );

    console.log('\n--- Setup Complete! ---');
    console.log(`The database connector '${selectedConnector.packageName}' has been installed.`);
    console.log(`'${databaseHandlerPath}' has been updated.`);
    console.log('You may now want to review `src/database.js` to configure your connection details.');
}

main();