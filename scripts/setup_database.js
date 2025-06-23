/* eslint-disable */
const { execSync } = require('child_process');
const { grey, red, green, blue } = require('colors');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const databaseHandlerPath = path.join(__dirname, '..', 'src', 'utils', 'database', 'index.ts');
const importRegex = /import DBHandler from '\.\/[A-Za-z0-9]+';/i;

const DB_CONNECTORS = [
    {
        name: 'SQLite (better-sqlite3)',
        packageName: 'better-sqlite3',
        importLine: "import DBHandler from './sqlite';",
    },
    // ToDo: create implementation for it
    // {
    //     name: 'MySQL (mysql2)',
    //     packageName: 'mysql2',
    //     importLine: "import DBHandler from './mysql';",
    // },
];

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

    throw new Error('❌ Could not detect package manager from npm_config_user_agent.');
}

function installDBPackage(packageManager, packageName) {
    console.log(`\n--- ⚙️  Installing ${packageName} using ${packageManager} ⚙️  ---\n`);
    try {
        let command;
        if (packageManager === 'npm') {
            command = `npm install ${packageName}`;
        } else if (packageManager === 'pnpm') {
            command = `pnpm add ${packageName}`;
        } else if (packageManager === 'yarn') {
            command = `yarn add ${packageName}`;
        } else {
            throw new Error(`❌ Unsupported package manager: ${packageManager}`);
        }

        execSync(command, { stdio: 'inherit' });
        console.log(green(`✅ Successfully installed ${packageName}.`));
    } catch (error) {
        throw new Error(`❌ Error installing ${packageName}: ${error.message}`);
    }
}

function updateImportPath(filePath, searchRegex, newImportLine) {
    console.log(`\n--- ⚙️  Updating import path in ${blue('./src/utils/database/index.ts')} ⚙️  ---\n`);
    try {
        let fileContent = fs.readFileSync(filePath, 'utf8');

        if (!searchRegex.test(fileContent)) {
            throw new Error(`Unable to find import path to implement new database connector.`)
        }

        fileContent = fileContent.replace(searchRegex, newImportLine);

        fs.writeFileSync(filePath, fileContent, 'utf8');
        console.log(green(`✅ Successfully updated file with the new import.\n`));
    } catch (error) {
        throw new Error(
            `❌ Error updating ${blue('./src/utils/database/index.ts')}: ${red(error.message)}\n`+
            `Complete filepath: ${filePath}`
        );
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
            console.log(`  ${grey(key)}. ${blue(options[key]?.name)}`);
        }

        rl.question('\nEnter your choice: ', (answer) => {
            rl.close();
            if (options[answer]) {
                resolve(answer);
            } else {
                throw new Error('❌ Invalid choice. Please run the script again and select a valid option.');
            }
        });
    });
}

async function checkForOtherDbConnector(packageManager) {
    const { dependencies } = require('../package.json');
    
    const currentPackages = Object.keys(dependencies);
    let isAnotherPackageInstalled = false;

    for (const key in DB_CONNECTORS) {
        const packageName = DB_CONNECTORS[key].packageName;

        if (currentPackages.includes(packageName)) {
            isAnotherPackageInstalled = packageName;
            break;
        }
    }

    if (!isAnotherPackageInstalled) return;

    function uninstallPackage(packageManager, package) {
        let command;
        if (packageManager === 'npm') {
            command = `npm uninstall ${package}`;
        } else if (packageManager === 'pnpm') {
            command = `pnpm remove ${package}`;
        } else if (packageManager === 'yarn') {
            command = `yarn remove ${package}`;
        } else {
            throw new Error(`❌ Unsupported package manager: ${packageManager}`);
        }

        execSync(command, { stdio: 'inherit' });
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(
            `\nℹ️  You've currently got ${blue(isAnotherPackageInstalled)} installed in your dependencies.\nDo you want to uninstall it ? (Y/N) `,
            (answer) => {
                rl.close();
                if (answer.toLowerCase() === 'y') {
                    console.log(`⚙️  Uninstalling ${blue(isAnotherPackageInstalled)}...`);
                    uninstallPackage(packageManager, isAnotherPackageInstalled);
                } else {
                    console.log('ℹ️  Not uninstalling previous package');
                }
                resolve();
            }
        );
    });
}

async function main() {
    console.log('--- ⚙️  Starting database setup script ⚙️ ---');

    const packageManager = detectPackageManager();
    console.log(`✅ Detected package manager: ${green(packageManager)}`);

    await checkForOtherDbConnector(packageManager);

    const choice = await chooseDBConnector('ℹ️  Which database connector would you like to install?', DB_CONNECTORS);
    const selectedConnector = DB_CONNECTORS[choice];

    if (!selectedConnector) {
        throw new Error('❌ No valid database connector selected. Exiting.');
    }

    installDBPackage(packageManager, selectedConnector.packageName);

    updateImportPath(
        databaseHandlerPath,
        importRegex,
        selectedConnector.importLine,
    );

    console.log(`\n--- ✅ ${green('Setup Complete!')} ✅ ---`);
    console.log(`ℹ️  The database connector '${blue(selectedConnector.packageName)}' has been installed.`);
    console.log(`ℹ️  ${blue('./src/utils/database/index.ts')} has been updated.\n`);
}

main()
.catch(err => console.error(red(err.message), '\n'));