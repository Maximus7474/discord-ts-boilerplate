# Discord TS Boilerplate

*Inspired by [discord-js-template](https://github.com/Maximus7474/discord-js-template) originaly created by [Furious Feline](https://github.com/FissionFeline)*

---

## Table of Contents
  - [📦 Setup](#-setup)
  - [🗄️ Database Setup](#️-database-management)
  - [⚙️ Configuring](#️-configuring)
  - [🚀 Deploying](#-deploying)
  - [💿 Available Scripts](#-available-scripts)
  - [⚠️ Security Warning: DO NOT MAKE THE `.env` FILE PUBLIC](#️-security-warning-do-not-make-the-env-file-public)

---

## 📦 Setup

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.template .env
   ```

2. Replace the following values in the `.env` file:
   - `DISCORD_BOT_TOKEN`: Your bot's authentication token from Discord's developer portal.
   - `MAIN_GUILD_ID`: The Discord ID of your main guild.

Here are the guides for the "Configuring" sections, expanded with details and examples, following the structure you provided.

-----

## 🗄️ Database Setup

The bot uses **Prisma** as its ORM (Object-Relational Mapper) to interact with the database. By default, it's configured to use **SQLite**, making initial setup simple and quick since SQLite is file-based and requires no separate server.

### Changing the Database Provider

If you need to change from SQLite to a different database like PostgreSQL or MySQL, you can do so by modifying the Prisma schema.

1.  **Modify the `schema.prisma` file:** Open the `prisma/schema.prisma` file. Locate the `datasource db` block and change the `provider` field to your desired database.

    ```prisma
    // For PostgreSQL
    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }

    // For MySQL
    datasource db {
      provider = "mysql"
      url      = env("DATABASE_URL")
    }
    ```

2.  **Update the `.env` file:** Change the `DATABASE_URL` in your `.env` file to match your new database's connection string.

    ```env
    # For PostgreSQL
    DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

    # For MySQL
    DATABASE_URL="mysql://user:password@host:port/database"

    # For SQLite
    DATABASE_URL="file:./data.db"
    ```

-----

### Step-by-Step Guide for Schema Changes

When you make changes to your database schema in the `prisma/schema.prisma` file, you need to follow these steps to apply those changes to your database.

1.  **Generate the Prisma Client:** After editing your schema, run the `prisma generate` command. This command updates the generated Prisma Client with the new types and methods, ensuring your code remains type-safe.

    ```bash
    pnpm prisma generate
    ```

2.  **Run a Migration:** To apply the schema changes to your actual database, you'll use Prisma Migrate. The `migrate dev` command creates a new migration file and applies it.

    ```bash
    pnpm prisma migrate dev --name <migration_name>
    ```

    Replace `<migration_name>` with a descriptive name for your changes (e.g., `add-user-model`). This process ensures your database schema stays in sync with your Prisma schema.

For more detailed information on Prisma, including advanced migration strategies and different data modeling techniques, you can refer to the official documentation. 📖

**Prisma Documentation:** [https://www.prisma.io/docs/](https://www.google.com/search?q=https://www.prisma.io/docs/)

---

## ⚙️ Configuring

Each of the three features – **Commands**, **Events**, and **Static Messages** – are built upon a unified, class-based system. You create a dedicated class for each, which then gets correctly parsed and registered to set up and handle interactions. This approach ensures a consistent and streamlined development experience.

<details>
   <summary>Commands</summary>

   Creating commands is simplified to the best extent possible. The base structure is that all commands located in `src/commands/` will be loaded as long as they're built with the `SlashCommand` class. This is required to properly load commands to the Discord API and also appropriately handle callbacks to ensure easy and smooth operation.

   ### How Commands Work

   Commands are defined using the `SlashCommand` class. This class encapsulates all the necessary information for a Discord slash command, including its data (name, description, options), the logic to execute when the command is called, and optional setup and autocomplete functionalities.

   The bot automatically discovers and registers all `SlashCommand` instances found in the `src/commands/` directory. During deployment, these commands are sent to the Discord API, making them available in your server.

   ### Example Command (`src/commands/ping.ts`)

   ```typescript
   // Adjust path if needed
   import { SlashCommandBuilder } from 'discord.js';
   import SlashCommand from '../structures/SlashCommand'; 
   import { Logger } from '../utils/logger';
   import { DiscordClient } from '../types/customTypes';

   export default new SlashCommand({
      name: 'ping',
      // Set to true if this command should only exist in your MAIN_GUILD_ID
      guildSpecific: false,
      slashcommand: new SlashCommandBuilder()
         .setName('ping')
         .setDescription('Replies with Pong!'),
      callback: async (logger: Logger, client: DiscordClient, interaction) => {
         await interaction.reply('Pong!');
         logger.info('Ping command executed successfully.');
      },
      setup: async (logger: Logger, client: DiscordClient) => {
         // Optional setup logic for this specific command, runs once when the bot starts
         logger.debug('Ping command setup complete.');
      },
      autocomplete: async (logger: Logger, client: DiscordClient, interaction) => {
         // Optional autocomplete logic for options
         const focusedValue = interaction.options.getFocused();
         const choices = ['one', 'two', 'three'];
         const filtered = choices.filter(choice => choice.startsWith(focusedValue));
         await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
         );
      }
   });
   ```

   **Key Points:**

   * **`name`**: A unique identifier for your command.
   * **`guildSpecific`**: If `true`, the command will only be registered in the guild specified by `MAIN_GUILD_ID` in your `.env` file. Otherwise, it will be global.
   * **`slashcommand`**: This uses `SlashCommandBuilder` from `discord.js` to define the command's appearance and options in Discord.
   * **`callback`**: This function is executed whenever a user invokes the slash command. It receives a `Logger` instance, the `DiscordClient`, and the `ChatInputCommandInteraction`.
   * **`setup` (Optional)**: This function runs once when the bot starts, after the command has been loaded. It's useful for any initialization specific to this command (e.g., fetching data, setting up persistent listeners).
   * **`autocomplete` (Optional)**: If your command has options with `setAutocomplete(true)`, this function will be called when a user types into that option, allowing you to provide dynamic suggestions.

</details>

<details>
   <summary>Events</summary>

   Events are fundamental for a Discord bot to react to various activities, such as messages being sent, users joining, or reactions being added. The base structure is that all event handlers located in `src/events/` will be loaded as long as they're built with the `EventHandler` class. This is required to properly register event listeners with the Discord client.

   ### How Events Work

   Event handlers are defined using the `EventHandler` class. This class allows you to specify which Discord event you want to listen to, whether it should trigger "on" every occurrence or "once," and the callback function to execute when the event fires.

   The bot automatically scans the `src/events/` directory, loads all `EventHandler` instances, and registers them with the Discord client.

   ### Example Event (`src/events/ready.ts`)

   ```typescript
   import EventHandler from '../structures/EventHandler'; // Adjust path if needed
   import { Logger } from '../utils/logger'; // Adjust path if needed
   import { DiscordClient } from '../types/customTypes'; // Adjust path if needed

   export default new EventHandler({
      name: 'client-ready', // A unique name for your event handler
      eventName: 'ready', // The Discord.js event name (from ClientEvents)
      type: 'once', // 'on' for multiple triggers, 'once' for a single trigger
      callback: async (logger: Logger, client: DiscordClient) => {
         logger.info(`Logged in as ${client.user?.tag}!`);
         // You can perform actions here once the bot is ready
      },
      setup: async (logger: Logger, client: DiscordClient) => {
         // Optional setup logic for this specific event handler, runs once when loaded
         logger.debug('Ready event handler setup complete.');
      }
   });
   ```

   ### Example Event (`src/events/guildMemberAdd.ts`)

   ```typescript
   import EventHandler from '../structures/EventHandler'; // Adjust path if needed
   import { Logger } from '../utils/logger'; // Adjust path if needed
   import { DiscordClient } from '../types/customTypes'; // Adjust path if needed
   import { GuildMember } from 'discord.js';

   export default new EventHandler({
      name: 'member-join',
      eventName: 'guildMemberAdd',
      type: 'on',
      callback: async (logger: Logger, client: DiscordClient, member: GuildMember) => {
         logger.info(`New member joined: ${member.user.tag} in ${member.guild.name}`);
         // Example: Send a welcome message to a specific channel
         const welcomeChannel = member.guild.channels.cache.get('YOUR_WELCOME_CHANNEL_ID'); // Replace with your channel ID
         if (welcomeChannel && welcomeChannel.isTextBased()) {
               await welcomeChannel.send(`Welcome, ${member.user.tag}! Enjoy your stay.`);
         }
      }
   });
   ```

   **Key Points:**

   * **`name`**: A unique name for your event handler.
   * **`eventName`**: This must be a valid event name from `discord.js`'s `ClientEvents` interface (e.g., `'ready'`, `'messageCreate'`, `'interactionCreate'`).
   * **`type`**: Determines how many times the event listener will fire:
         * `'on'`: The callback will be executed every time the event occurs.
         * `'once'`: The callback will be executed only the first time the event occurs, then the listener is removed.
   * **`callback`**: The function that runs when the event is triggered. It receives a `Logger` instance, the `DiscordClient`, and any arguments specific to that Discord event (e.g., for `messageCreate`, it receives the `Message` object).
   * **`setup` (Optional)**: Similar to commands, this runs once when the event handler is loaded, allowing for any pre-initialization.

</details>

<details>
   <summary>Static Messages</summary>

   Static messages (or persistent messages) are a powerful feature for creating interactive and dynamic messages that remain in a channel and respond to user interactions (e.g., button clicks, select menu selections). The base structure is that all static message handlers located in `src/static_messages/` will be loaded as long as they're built with the `StaticMessage` class. This is required to properly set up the initial message and handle subsequent interactions.

   ### How Static Messages Work

   Static messages are defined using the `StaticMessage` class. This class is designed to:

   1.  **Initialize the message**: The `setup` function is responsible for sending or fetching the message that will be considered "static."
   2.  **Handle interactions**: The `callback` function responds to interactions (like button clicks) on that static message, based on `customIds`.

   The bot loads all `StaticMessage` instances from `src/static_messages/` and calls their `initialize` method to set up the messages. It then listens for interactions with matching `customIds` and dispatches them to the appropriate `handleInteraction` method.

   ### Example Static Message (`src/static_messages/rolePanel.ts`)

   ```typescript
   import { ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js';
   import StaticMessage from '../structures/StaticMessage'; // Adjust path if needed
   import { Logger } from '../utils/logger'; // Adjust path if needed
   import { DiscordClient } from '../types/customTypes'; // Adjust path if needed

   export default new StaticMessage({
      name: 'role-panel', // A unique name for your static message handler
      customIds: ['give_role_button'], // Custom IDs this handler will listen for
      setup: async (logger: Logger, client: DiscordClient) => {
         const channelId = 'YOUR_CHANNEL_ID'; // Replace with the ID of the channel where the message should be
         const channel = client.channels.cache.get(channelId) as TextChannel;

         if (!channel) {
            logger.error(`Channel with ID ${channelId} not found for role-panel.`);
            return;
         }

         const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
               new ButtonBuilder()
                  .setCustomId('give_role_button')
                  .setLabel('Get Member Role')
                  .setStyle(ButtonStyle.Primary),
            );

         // Check if message already exists (optional, but good for persistence)
         // You might store message IDs in a database or a config file
         let message;
         try {
            // Attempt to fetch an existing message if you know its ID
            // For simplicity, this example just sends a new one or updates
            const messages = await channel.messages.fetch({ limit: 10 }); // Fetch recent messages
            message = messages.find(m => m.author.id === client.user?.id && m.content.includes('Click the button'));

            if (message) {
               await message.edit({ content: 'Click the button below to get the Member role!', components: [row] });
               logger.info(`Updated existing role panel message in ${channel.name}.`);
            } else {
               message = await channel.send({ content: 'Click the button below to get the Member role!', components: [row] });
               logger.info(`Sent new role panel message in ${channel.name}.`);
            }
         } catch (error) {
            logger.error('Failed to send/update role panel message:', error);
         }
      },
      callback: async (logger: Logger, client: DiscordClient, interaction) => {
         if (interaction.customId === 'give_role_button') {
            await interaction.deferReply({ ephemeral: true }); // Acknowledge the interaction
            const roleId = 'YOUR_MEMBER_ROLE_ID'; // Replace with your member role ID
            const role = interaction.guild?.roles.cache.get(roleId);

            if (!role) {
               await interaction.editReply('Role not found!');
               logger.warn(`Role with ID ${roleId} not found in guild ${interaction.guild?.name}.`);
               return;
            }

            if (interaction.member && interaction.member instanceof (await import('discord.js')).GuildMember) {
               if (interaction.member.roles.cache.has(roleId)) {
                  await interaction.editReply('You already have this role!');
               } else {
                  await interaction.member.roles.add(role);
                  await interaction.editReply(`You have been given the ${role.name} role!`);
                  logger.info(`${interaction.user.tag} received ${role.name} role.`);
               }
            } else {
               await interaction.editReply('Could not assign role. Are you in a guild?');
               logger.error('Interaction member is not a GuildMember.');
            }
         }
      }
   });
   ```

   **Key Points:**

   * **`name`**: A unique name for your static message handler.
   * **`customIds`**: An array of `customId` strings that this `StaticMessage` instance will respond to. These IDs are typically set on interactive components like `ButtonBuilder` or `SelectMenuBuilder`.
   * **`setup`**: This asynchronous function is crucial. It runs once when the bot starts and is responsible for:
      * Fetching or sending the static message to a specific channel.
      * Attaching interactive components (buttons, select menus) to the message.
      * (Optional but recommended) Logic to check if the message already exists to prevent sending duplicates on bot restarts.
   * **`callback` (Optional)**: This asynchronous function is executed when a user interacts with a component whose `customId` matches one in the `customIds` array for this `StaticMessage`. It receives a `Logger`, the `DiscordClient`, and the specific `ButtonInteraction` or `AnySelectMenuInteraction`.

</details>

-----

## 🚀 Deploying

- The TypeScript code is built using `tsc`.  
- The `scripts/build.js` file also transfers the `base.sql` files from the `database` folder to ensure smooth operation.

**Note:**  
Building the project does not deploy the slash commands to Discord's API. You must run the `deploy` script to do so.

### Deployment Steps:
1. Build the project:
   ```bash
   pnpm run build
   ```
2. Deploy the slash commands:
   ```bash
   pnpm run deploy
   ```

**Important:**  
The deploy script reads command data from the `dist/` directory. Ensure you run the build script before deploying.

---

## 💿 Available Scripts

This project comes with several pre-defined scripts to streamline development, deployment, and management tasks. You can run them using your package manager (e.g., `npm run <script-name>`, `pnpm run <script-name>`, or `yarn <script-name>`).

### Development Commands

  * `pnpm run dev`

      * This is your primary command for local development. It starts the bot in watch mode using `tsx`, automatically recompiling and restarting the application whenever you make changes to your source files.
      * **Usage:**
        ```bash
        pnpm run dev
        ```

  * `pnpm run lint`

      * Runs ESLint to check your TypeScript source code (`src/**/*.ts`) for potential errors, style inconsistencies, and adherence to defined coding standards.
      * **Usage:**
        ```bash
        pnpm run lint
        ```

  * `pnpm run clear-commands`

      * A utility script to unregister all previously deployed Discord application commands (global or guild).
      * **Usage:**
        ```bash
        pnpm run clear-commands
        ```

### Build & Deployment Commands

  * `pnpm run build`

      * Compiles your TypeScript source code (`src/`) into production-ready JavaScript files (`dist/`).
      * **Usage:**
        ```bash
        pnpm run build
        ```

  * `pnpm run deploy`

      * Registers your Discord application commands with the Discord API. This makes your bot's slash commands visible and usable in Discord servers. This requires the project to have been already built.
      * **Usage:**
        ```bash
        pnpm run deploy
        ```

  * `pnpm run dev-deploy`

      * A convenient compound command that first builds your project (`pnpm run build`) and then immediately deploys your Discord application commands (`pnpm run deploy`).
      * **Usage:**
        ```bash
        pnpm run dev-deploy
        ```

  * `pnpm run start`

      * Runs the compiled JavaScript version of your bot from the `dist/` directory.
      * **Usage:**
        ```bash
        pnpm run start
        ```

### Database Management Commands

  * `pnpm run setup-db`
      * This interactive script guides you through setting up your preferred database connector. It will detect your package manager, help you install the necessary database driver and its types, and configure the bot's internal database handler.
      **You must run this script before using the bot for the first time or if you wish to switch database types.**
      * **Usage:**
        ```bash
        pnpm run setup-db
        ```
      * **Note:** After running this, remember to configure the appropriate database connection details in your `.env` file as described in the [Database Management](#️-database-management) section.

---

## ⚠️ Security Warning: DO NOT MAKE THE `.env` FILE PUBLIC

By default, the `.env` file is ignored by Git (via `.gitignore`).  
If you disable this, it can lead to severe security risks, such as:

- Hackers gaining access to your authentication token and using it maliciously.
- Other unintended consequences.

**To stay safe:**
- Do not remove `.env` from the `.gitignore` file.
- Ensure your `.env` file remains private.

---
