const { EmbedBuilder } = require("discord.js");

/**
 * Handle the /spawnhelp command
 * @param {CommandInteraction} interaction
 */
async function handleSpawnHelpCommand(interaction) {
  const embed = new EmbedBuilder()
    .setTitle("❓ Help - Spawn Move Bot")
    .setDescription(
      "This bot allows you to perform special actions on users.\n\n" +
        "🔒 **Bot reserved for administrators only**"
    )
    .setColor(0x00ff00)
    .addFields(
      {
        name: "📋 Commands",
        value:
          "`/poke` - Perform a spawn move\n" +
          "`/pokerandom` - Random spawn move\n" +
          "`/spawnlist` - See available effects\n" +
          "`/spawnhelp` - Show this help",
      },
      {
        name: "🔐 Required Permissions",
        value:
          "• **Administrator** permission\n" +
          "• Specific admin role (if configured)\n" +
          "• Server owner",
      },
      {
        name: "🎯 Usage",
        value:
          "1. Use `/poke effet: [effect]`\n" +
          "2. Select the connected user from the list\n" +
          '3. Click "Execute"',
      },
      {
        name: "🎲 Random Mode",
        value:
          "1. Use `/pokerandom effet: [effect]`\n" +
          "2. Or `/poke effet: [effect] mode:random`\n" +
          "3. The user is selected automatically",
      },
      {
        name: "🖱️ Context Menu",
        value:
          "Right-click on a user → Applications → Choose the effect:\n" +
          "• **Poke Wiz** - Direct Wiz effect\n" +
          "• **Poke Shake** - Direct Shake effect\n" +
          "• **Poke Bounce** - Direct Bounce effect",
      },
      {
        name: "⚠️ Important",
        value:
          "• The user must be connected to a voice channel\n" +
          "• All commands are reserved for administrators",
      }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed], flags: 64 });
}

module.exports = { handleSpawnHelpCommand };
