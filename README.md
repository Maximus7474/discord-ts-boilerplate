# Discord TS Boilerplate

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

## DO NOT MAKE THE .env FILE PUBLIC
By default, `.env` is git ignored (meaning it is ignored by git). If you disable this, there can be huge security risks such as
- Hackers being able to use your authentication token and using it for malicious purposes
- Bad in general

If you do not touch the `.gitignore` then you should be fine. But be sure not to remove the `.env` part from the `.gitignore`.
