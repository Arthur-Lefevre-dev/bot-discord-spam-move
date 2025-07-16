const spawnEffects = require("../effects/effects");
const { createAudioPlayback } = require("../audio/audioManager");
const { hasAdminPermission } = require("../utils/permissions");
const { createSuccessEmbed, createErrorEmbed } = require("../utils/embed");
const {
  joinVoiceChannel,
  AudioPlayerStatus,
  createAudioResource,
  createAudioPlayer,
} = require("@discordjs/voice");
const path = require("path");
const { executeSpawnMove } = require("./spawnMoveEffect");

/**
 * Handle the /poke command
 * @param {CommandInteraction} interaction
 * @param {object} config
 */
async function handlePokeCommand(interaction, config) {
  const effectType = interaction.options.getString("effet");
  const mode = interaction.options.getString("mode") || "manual";

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

  // If random mode is selected, pick a random user
  let targetMember;
  if (mode === "random") {
    targetMember =
      connectedMembers[Math.floor(Math.random() * connectedMembers.length)];
  } else {
    // Manual mode: for now, pick the first (UI selection can be added later)
    targetMember = connectedMembers[0];
  }
  const targetUser = targetMember.user;

  // Execute the spawn move effect
  await executeSpawnMove(interaction, targetUser, effectType, config, false);
}

module.exports = { handlePokeCommand };
