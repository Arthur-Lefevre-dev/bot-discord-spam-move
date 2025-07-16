const spawnEffects = require("../effects/effects");
const { executeSpawnMove } = require("./spawnMoveEffect");
const { createErrorEmbed, createSuccessEmbed } = require("../utils/embed");

/**
 * Handle button interactions (user selection, execution, cancel)
 * @param {ButtonInteraction} interaction
 * @param {object} config
 */
async function handleButton(interaction, config) {
  const customIdParts = interaction.customId.split("_");
  const action = customIdParts[0];

  if (action === "spawn") {
    // Button to execute the effect on a user
    const [, userId, effectType] = customIdParts;
    try {
      const targetUser = await interaction.client.users.fetch(userId);
      if (!targetUser || !spawnEffects[effectType]) {
        return await interaction.reply({
          content: "❌ Error: User or effect not found.",
          flags: 64,
        });
      }
      await executeSpawnMove(interaction, targetUser, effectType, config);
    } catch (error) {
      await interaction.reply({
        content: "❌ Error executing spawn move.",
        flags: 64,
      });
    }
  } else if (action === "select") {
    // Button to select a user (not implemented: UI selection logic)
    await interaction.reply({
      content:
        "🔧 User selection via button is not implemented in this version.",
      flags: 64,
    });
  } else if (action === "cancel") {
    // Button to cancel the action
    const embed = createSuccessEmbed(
      "❌ Action cancelled",
      "The action has been cancelled.",
      0xff0000
    );
    await interaction.update({ embeds: [embed], components: [] });
  } else {
    await interaction.reply({
      content: "❌ Unknown button action.",
      flags: 64,
    });
  }
}

module.exports = { handleButton };
