const spawnEffects = require("../effects/effects");
const { createAudioPlayback } = require("../audio/audioManager");
const { createSuccessEmbed, createErrorEmbed } = require("../utils/embed");
const {
  joinVoiceChannel,
  createAudioResource,
  createAudioPlayer,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const path = require("path");

/**
 * Execute the spawn move effect: create temp category/channel, move user, alternate audio, cleanup
 * @param {CommandInteraction|UserContextMenuCommandInteraction} interaction
 * @param {User} targetUser
 * @param {string} effectType
 * @param {object} config
 * @param {boolean} alreadyDeferred - If true, do not deferReply (the handler already replied)
 */
async function executeSpawnMove(
  interaction,
  targetUser,
  effectType,
  config,
  alreadyDeferred = false
) {
  const effect = spawnEffects[effectType];
  if (!effect) return;

  // Only defer the reply if not already done
  if (!alreadyDeferred) {
    await interaction.deferReply({ ephemeral: true });
  }

  // Send initial message
  const initialEmbed = createSuccessEmbed(
    `🎮 ${effect.name} in progress...`,
    `${effect.emoji} Preparing ${effect.name} on **${targetUser.username}**`,
    effect.color
  );
  if (!alreadyDeferred) {
    await interaction.editReply({ embeds: [initialEmbed] });
  } else {
    await interaction.followUp({ embeds: [initialEmbed], flags: 64 });
  }

  try {
    // Get the guild and check if user is in a voice channel
    const guild = interaction.guild;
    const member = await guild.members.fetch(targetUser.id);
    if (!member.voice.channel) {
      const errorEmbed = createErrorEmbed(
        `❌ ${effect.name} cancelled`,
        `**${targetUser.username}** disconnected from the voice channel.\nEffect cannot be executed.`
      );
      await interaction.followUp({ embeds: [errorEmbed], flags: 64 });
      return;
    }

    // Save original channel
    const originalChannel = member.voice.channel;

    // Create a temporary category for the spawn move
    const tempCategory = await guild.channels.create({
      name: `🎮 ${effect.name} - ${targetUser.username}`,
      type: 4, // Category
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: ["Connect", "Speak", "ViewChannel"],
        },
        {
          id: targetUser.id,
          allow: ["Connect", "Speak", "ViewChannel"],
        },
      ],
    });

    // Create a single temporary voice channel inside the category
    const tempChannel = await guild.channels.create({
      name: `🔊-${effect.name}-${targetUser.username}`,
      type: 2, // Voice channel
      parent: tempCategory.id,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: ["Connect", "Speak"],
        },
        {
          id: targetUser.id,
          allow: ["Connect", "Speak"],
        },
      ],
    });

    // Move user to the temporary channel
    await member.voice.setChannel(tempChannel);

    // Prepare two audio clients (VoiceConnection + AudioPlayer)
    const audioClients = [0, 1].map(() => ({ connection: null, player: null }));
    const audioPath = path.join(__dirname, "../../audio", effect.audioFile);

    // Helper to connect, play, and disconnect one client
    async function connectPlayDisconnect(clientIdx) {
      audioClients[clientIdx].connection = joinVoiceChannel({
        channelId: tempChannel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false,
      });
      const resource = createAudioResource(audioPath, {
        inputType: "arbitrary",
        inlineVolume: true,
      });
      resource.volume.setVolume(10.0); // 1000% volume
      audioClients[clientIdx].player = createAudioPlayer();
      audioClients[clientIdx].connection.subscribe(
        audioClients[clientIdx].player
      );
      audioClients[clientIdx].player.play(resource);
      // Wait exactly 2 seconds from the moment the connection is established
      await new Promise((resolve) => setTimeout(resolve, 2000));
      audioClients[clientIdx].connection.destroy();
      audioClients[clientIdx].connection = null;
      audioClients[clientIdx].player = null;
    }

    // Start alternated connections for 10 seconds, switching every 2 seconds
    const startTime = Date.now();
    let current = 0;
    let stopped = false;
    while (Date.now() - startTime < 10000 && !stopped) {
      // Check if user is still in the temp channel
      const updatedMember = await guild.members.fetch(targetUser.id);
      if (
        !updatedMember.voice.channel ||
        updatedMember.voice.channel.id !== tempChannel.id
      ) {
        stopped = true;
        break;
      }
      await connectPlayDisconnect(current);
      current = 1 - current;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // Move user back to original channel if still connected
    const finalMember = await guild.members.fetch(targetUser.id);
    if (
      finalMember.voice.channel &&
      finalMember.voice.channel.id === tempChannel.id
    ) {
      await finalMember.voice.setChannel(originalChannel);
    }

    // Delete the temporary channel and category
    setTimeout(async () => {
      try {
        await tempChannel.delete();
        await tempCategory.delete();
      } catch (e) {
        console.log("Error deleting temp channel or category:", e);
      }
    }, 2000);

    // Final success message
    const successEmbed = createSuccessEmbed(
      `✅ ${effect.name} finished!`,
      `${effect.emoji} **${effect.name}** was performed on **${targetUser.username}** by **${interaction.user.username}**`,
      0x00ff00,
      targetUser.displayAvatarURL(),
      "Spawn Move Bot"
    );
    await interaction.followUp({ embeds: [successEmbed], flags: 64 });

    // Send notification to spawn channel if configured
    if (
      config.spawnChannelId &&
      config.spawnChannelId !== interaction.channel.id
    ) {
      const spawnChannel = await interaction.client.channels.fetch(
        config.spawnChannelId
      );
      if (spawnChannel && spawnChannel.isTextBased()) {
        const notificationEmbed = createSuccessEmbed(
          `🎮 Spawn Move Executed`,
          `${effect.emoji} **${effect.name}** was performed on **${targetUser.username}** by **${interaction.user.username}** in <#${interaction.channel.id}>`,
          effect.color
        );
        await spawnChannel.send({ embeds: [notificationEmbed] });
      }
    }
  } catch (error) {
    console.error("Error during spawn move execution:", error);
    const errorEmbed = createErrorEmbed(
      `❌ Error during execution`,
      `An error occurred while executing ${effectType} on **${targetUser.username}**.`
    );
    await interaction.followUp({ embeds: [errorEmbed], flags: 64 });
  }
}

module.exports = { executeSpawnMove };
