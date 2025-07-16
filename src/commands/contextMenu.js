const { hasAdminPermission } = require("../utils/permissions");
const { executeSpawnMove } = require("./spawnMoveEffect");
const spawnEffects = require("../effects/effects");
const { createErrorEmbed } = require("../utils/embed");

/**
 * Handle context menu commands for direct effects (Wiz, Shake, Bounce)
 * @param {UserContextMenuCommandInteraction} interaction
 * @param {string} effectType
 * @param {object} config
 */
async function handleContextMenuCommand(interaction, effectType, config) {
  // Check admin permissions
  if (!hasAdminPermission(interaction.member, config.adminRoleId)) {
    return await interaction.reply({
      content: "❌ Access denied: Only admins can use this command.",
      flags: 64,
    });
  }

  const targetUser = interaction.targetUser;
  const member = await interaction.guild.members.fetch(targetUser.id);
  if (!member.voice.channel) {
    const errorEmbed = createErrorEmbed(
      `❌ Not connected`,
      `**${targetUser.username}** is not connected to a voice channel.`
    );
    return await interaction.reply({ embeds: [errorEmbed], flags: 64 });
  }

  // Execute the spawn move effect
  await interaction.reply({
    content: `⚡ Executing ${spawnEffects[effectType].name} on ${targetUser.username}...`,
    flags: 64,
  });
  await executeSpawnMove(interaction, targetUser, effectType, config, true);
}

module.exports = { handleContextMenuCommand };
