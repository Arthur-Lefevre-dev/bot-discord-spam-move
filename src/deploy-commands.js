const {
  REST,
  Routes,
  SlashCommandBuilder,
  ContextMenuCommandBuilder,
  ApplicationCommandType,
} = require("discord.js");
require("dotenv").config();

const commands = [
  new SlashCommandBuilder()
    .setName("poke")
    .setDescription("Effectuer un spawn move sur un utilisateur connecté")
    .addStringOption((option) =>
      option
        .setName("effet")
        .setDescription("Le type d'effet à appliquer")
        .setRequired(true)
        .addChoices(
          { name: "✨ Wiz", value: "wiz" },
          { name: "👆 Poke", value: "poke" },
          { name: "🌪️ Shake", value: "shake" },
          { name: "🏀 Bounce", value: "bounce" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("mode")
        .setDescription("Mode de sélection de l'utilisateur")
        .setRequired(false)
        .addChoices(
          { name: "🎯 Sélection manuelle", value: "manual" },
          { name: "🎲 Aléatoire", value: "random" }
        )
    ),

  new SlashCommandBuilder()
    .setName("spawnlist")
    .setDescription("Afficher la liste des effets de spawn move disponibles"),

  new SlashCommandBuilder()
    .setName("spawnhelp")
    .setDescription("Afficher l'aide pour les commandes de spawn move"),

  // Context menu commands for right-click on users
  new ContextMenuCommandBuilder()
    .setName("Poke Wiz")
    .setType(ApplicationCommandType.User),

  new ContextMenuCommandBuilder()
    .setName("Poke Shake")
    .setType(ApplicationCommandType.User),

  new ContextMenuCommandBuilder()
    .setName("Poke Bounce")
    .setType(ApplicationCommandType.User),

  // Random effect commands
  new SlashCommandBuilder()
    .setName("pokerandom")
    .setDescription(
      "Effectuer un spawn move aléatoire sur un utilisateur connecté"
    )
    .addStringOption((option) =>
      option
        .setName("effet")
        .setDescription("Le type d'effet à appliquer")
        .setRequired(true)
        .addChoices(
          { name: "✨ Wiz", value: "wiz" },
          { name: "👆 Poke", value: "poke" },
          { name: "🌪️ Shake", value: "shake" },
          { name: "🏀 Bounce", value: "bounce" }
        )
    ),
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("🔄 Début de l'enregistrement des commandes slash...");

    // Register commands for a specific guild (faster for development)
    if (process.env.DISCORD_GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(
          process.env.DISCORD_CLIENT_ID,
          process.env.DISCORD_GUILD_ID
        ),
        { body: commands }
      );
      console.log(
        "✅ Commandes slash enregistrées pour le serveur spécifique."
      );
    } else {
      // Register commands globally (takes up to 1 hour to update)
      await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
        { body: commands }
      );
      console.log("✅ Commandes slash enregistrées globalement.");
    }

    console.log("📋 Commandes enregistrées:");
    commands.forEach((cmd) => {
      console.log(`  - /${cmd.name}: ${cmd.description}`);
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'enregistrement des commandes:", error);
  }
})();
