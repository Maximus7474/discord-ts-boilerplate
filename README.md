# Discord TS Boilerplate

*Inspired by [discord-js-template](https://github.com/Maximus7474/discord-js-template) originaly created by [Furious Feline](https://github.com/FissionFeline)*

> [!IMPORTANT]  
> This repository is work in progress.

## Setup
Copy the `.env.example` file to `.env`
```bash
cp .env.template .env
```

Replace the `DISCORD_BOT_TOKEN` in the `.env` file with your own Authentication Token given to you by Discord in their portal 
Replace the `MAIN_GUIlD_ID` in the `.env` file with the discord ID of your main discord guild 

Once your discord bot is generated and the token inserted, you will need to run the deployment command so that the slashcommands are all registered to Discords API.
This is done via `npm` or `pnpm` depending on your preference, running the `deploy` script:
```bash
npm run deploy
pnpm deploy
```

## Deploying
The ts code is built using `tsc`, using the `scripts/build.js` file it also transfers over the `base.sql` files from the database folder allowing it to run smoothly. Building does not deploy the slash commands to Discord's API, you'll still need to run the `deploy` script to do so.

Please note that the deploy script will only work with a built project, it reads the data for the commands from the `dist/` directory, so it will fail if you haven't run the build script.

## Database Management
The current bot "supports" multiple database systems, however is only configured to run with `sqlite`.
The project is open to external contributions, such as creating integrations for other database systems (mysql, mariadb, postgres, mongodb, etc...). However the main point of *concern* is that I want to avoid adding dependencies to the project that will not be used.

## DO NOT MAKE THE .env FILE PUBLIC
By default, `.env` is git ignored (meaning it is ignored by git). If you disable this, there can be huge security risks such as
- Hackers being able to use your authentication token and using it for malicious purposes
- Bad in general

If you do not touch the `.gitignore` then you should be fine. But be sure not to remove the `.env` part from the `.gitignore`.
