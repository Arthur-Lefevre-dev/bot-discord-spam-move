const {
  Client,
  GatewayIntentBits,
  Partials,
  InteractionType,
} = require("discord.js");
require("dotenv").config();

// Import command handlers
const { handlePokeCommand } = require("./commands/poke");
const { handlePokeRandomCommand } = require("./commands/pokerandom");
const { handleSpawnListCommand } = require("./commands/spawnlist");
const { handleSpawnHelpCommand } = require("./commands/spawnhelp");
const { handleContextMenuCommand } = require("./commands/contextMenu");
const { handleButton } = require("./commands/buttons");

// Bot configuration
const config = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
  guildId: process.env.DISCORD_GUILD_ID,
  adminRoleId: process.env.ADMIN_ROLE_ID,
  spawnChannelId: process.env.SPAWN_CHANNEL_ID,
};

// Create Discord client with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User],
});

// On ready
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// On interaction create
client.on("interactionCreate", async (interaction) => {
  try {
    // Slash commands
    if (interaction.isChatInputCommand()) {
      switch (interaction.commandName) {
        case "poke":
          await handlePokeCommand(interaction, config);
          break;
        case "pokerandom":
          await handlePokeRandomCommand(interaction, config);
          break;
        case "spawnlist":
          await handleSpawnListCommand(interaction);
          break;
        case "spawnhelp":
          await handleSpawnHelpCommand(interaction);
          break;
        default:
          await interaction.reply({ content: "Unknown command.", flags: 64 });
      }
    }
    // Context menu commands
    else if (interaction.isUserContextMenuCommand()) {
      switch (interaction.commandName) {
        case "Poke Wiz":
          await handleContextMenuCommand(interaction, "wiz", config);
          break;
        case "Poke Shake":
          await handleContextMenuCommand(interaction, "shake", config);
          break;
        case "Poke Bounce":
          await handleContextMenuCommand(interaction, "bounce", config);
          break;
        default:
          await interaction.reply({
            content: "Unknown context menu.",
            flags: 64,
          });
      }
    }
    // Button interactions
    else if (interaction.isButton()) {
      await handleButton(interaction, config);
    }
    // Other interactions (buttons, etc.) can be handled here if needed
  } catch (error) {
    console.error("Error handling interaction:", error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "❌ An error occurred.",
        flags: 64,
      });
    } else {
      await interaction.reply({ content: "❌ An error occurred.", flags: 64 });
    }
  }
});

// Login
client.login(config.token);
