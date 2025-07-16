const spawnEffects = require("../effects/effects");
const { hasAdminPermission } = require("../utils/permissions");
const { executeSpawnMove } = require("./spawnMoveEffect");

/**
 * Handle the /pokerandom command
 * @param {CommandInteraction} interaction
 * @param {object} config
 */
async function handlePokeRandomCommand(interaction, config) {
  const effectType = interaction.options.getString("effet");

  if (!spawnEffects[effectType]) {
    return await interaction.reply({
      content: "❌ Invalid effect. Use `/spawnlist` to see available effects.",
      flags: 64,
    });
  }

  // Check admin permissions
  if (!hasAdminPermission(interaction.member, config.adminRoleId)) {
    return await interaction.reply({
      content: "❌ Access denied: Only admins can use this command.",
      flags: 64,
    });
  }

  // Get all voice channels in the guild
  const voiceChannels = interaction.guild.channels.cache.filter(
    (channel) => channel.type === 2 // Voice channel type
  );

  // Get all members connected to voice channels
  const connectedMembers = [];
  voiceChannels.forEach((channel) => {
    channel.members.forEach((member) => {
      if (member.id !== interaction.client.user.id) {
        connectedMembers.push(member);
      }
    });
  });

  if (connectedMembers.length === 0) {
    return await interaction.reply({
      content: "❌ No user is connected to a voice channel.",
      flags: 64,
    });
  }

  // Pick a random user
  const targetMember =
    connectedMembers[Math.floor(Math.random() * connectedMembers.length)];
  const targetUser = targetMember.user;

  // Execute the spawn move effect
  await executeSpawnMove(interaction, targetUser, effectType, config);
}

module.exports = { handlePokeRandomCommand };
