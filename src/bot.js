const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  MessageFlags,
} = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  entersState,
} = require("@discordjs/voice");
const { spawn } = require("child_process");
const path = require("path");
require("dotenv").config();

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

// Bot configuration
const config = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
  guildId: process.env.DISCORD_GUILD_ID,
  adminRoleId: process.env.ADMIN_ROLE_ID,
  spawnChannelId: process.env.SPAWN_CHANNEL_ID,
};

// Audio bot configuration
const audioBot = {
  isConnected: false,
  connection: null,
  player: null,
  currentChannel: null,
};

// Spawn move effects with audio files
const spawnEffects = {
  wiz: {
    name: "Wiz",
    description: "Effectue un wiz sur l'utilisateur",
    color: 0x00ff00,
    emoji: "✨",
    animation: ["✨", "🌟", "💫", "⭐"],
    audioFile: "wiz.mp3",
  },
  poke: {
    name: "Poke",
    description: "Poke l'utilisateur",
    color: 0xff6b6b,
    emoji: "👆",
    animation: ["👆", "👉", "👈", "👆"],
    audioFile: "poke.mp3",
  },
  shake: {
    name: "Shake",
    description: "Secoue l'utilisateur",
    color: 0xffa500,
    emoji: "🌪️",
    animation: ["🌪️", "🌀", "💨", "🌪️"],
    audioFile: "shake.mp3",
  },
  bounce: {
    name: "Bounce",
    description: "Fait rebondir l'utilisateur",
    color: 0x87ceeb,
    emoji: "🏀",
    animation: ["🏀", "⚽", "🏈", "🏀"],
    audioFile: "bounce.mp3",
  },
};

// Check if user has admin permissions
function hasAdminPermission(member) {
  // Check if user has Administrator permission
  if (member.permissions.has(PermissionFlagsBits.Administrator)) {
    return true;
  }

  // Check if user has the specific admin role (if configured)
  if (config.adminRoleId && member.roles.cache.has(config.adminRoleId)) {
    return true;
  }

  // Check if user is the server owner
  if (member.id === member.guild.ownerId) {
    return true;
  }

  return false;
}

// Create spawn move effect embed
function createSpawnMoveEffect(targetUser, effectType) {
  const effect = spawnEffects[effectType];
  if (!effect) return null;

  const embed = new EmbedBuilder()
    .setTitle(`${effect.emoji} ${effect.name} sur ${targetUser.username}`)
    .setDescription(`${effect.description}`)
    .setColor(effect.color)
    .setThumbnail(targetUser.displayAvatarURL())
    .setTimestamp()
    .setFooter({ text: "Spawn Move Bot" });

  return embed;
}

// Play audio file (returns the resource and player)
function createAudioPlayback(audioFile) {
  const audioPath = path.join(__dirname, "../audio", audioFile);
  const resource = createAudioResource(audioPath, {
    inputType: "arbitrary",
    inlineVolume: true,
  });
  resource.volume.setVolume(5.0); // Volume à 500%
  const player = createAudioPlayer();
  return { resource, player };
}

// Connect audio bot to a voice channel
async function connectAudioBot(channel) {
  try {
    if (audioBot.isConnected) {
      audioBot.connection.destroy();
    }

    audioBot.connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false,
    });

    audioBot.player = createAudioPlayer();
    audioBot.connection.subscribe(audioBot.player);
    audioBot.currentChannel = channel;
    audioBot.isConnected = true;

    // Handle connection state changes
    audioBot.connection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        await Promise.race([
          entersState(
            audioBot.connection,
            VoiceConnectionStatus.Signalling,
            5_000
          ),
          entersState(
            audioBot.connection,
            VoiceConnectionStatus.Connecting,
            5_000
          ),
        ]);
      } catch (error) {
        audioBot.connection.destroy();
        audioBot.isConnected = false;
      }
    });

    return true;
  } catch (error) {
    console.error("Erreur lors de la connexion du bot audio:", error);
    return false;
  }
}

// Play audio file
async function playAudio(audioFile) {
  try {
    const audioPath = path.join(__dirname, "../audio", audioFile);
    const resource = createAudioResource(audioPath);
    audioBot.player.play(resource);

    return new Promise((resolve, reject) => {
      audioBot.player.on(AudioPlayerStatus.Idle, () => {
        resolve();
      });
      audioBot.player.on("error", (error) => {
        console.error("Erreur audio:", error);
        reject(error);
      });
    });
  } catch (error) {
    console.error("Erreur lors de la lecture audio:", error);
  }
}

// Move audio bot to a channel
async function moveAudioBot(channel) {
  try {
    if (audioBot.isConnected && audioBot.currentChannel) {
      audioBot.connection.rejoin({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });
      audioBot.currentChannel = channel;
    }
  } catch (error) {
    console.error("Erreur lors du déplacement du bot audio:", error);
  }
}

// Execute spawn move with animation and channel movement
async function executeSpawnMove(channel, targetUser, effectType, executor) {
  const effect = spawnEffects[effectType];
  if (!effect) return;

  // Send initial message
  const initialEmbed = new EmbedBuilder()
    .setTitle(`🎮 ${effect.name} in progress...`)
    .setDescription(
      `${effect.emoji} Preparing ${effect.name} on **${targetUser.username}**`
    )
    .setColor(effect.color)
    .setTimestamp();

  const message = await channel.send({ embeds: [initialEmbed] });

  try {
    // Get the guild and check if user is in a voice channel
    const guild = channel.guild;
    const member = await guild.members.fetch(targetUser.id);

    // Check if user is still connected to a voice channel
    if (!member.voice.channel) {
      const errorEmbed = new EmbedBuilder()
        .setTitle(`❌ ${effect.name} cancelled`)
        .setDescription(
          `**${targetUser.username}** disconnected from the voice channel.\nEffect cannot be executed.`
        )
        .setColor(0xff0000)
        .setTimestamp();

      await message.edit({ embeds: [errorEmbed] });
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
    const audioPath = path.join(__dirname, "../audio", effect.audioFile);

    // Helper to connect, play, and disconnect one client
    async function connectPlayDisconnect(clientIdx) {
      // Create connection
      audioClients[clientIdx].connection = joinVoiceChannel({
        channelId: tempChannel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false,
      });
      // Create player and resource
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
      // Disconnect
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
      // Alternate audio clients
      await connectPlayDisconnect(current);
      current = 1 - current;
      // Wait 2 seconds between alternations
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
    const successEmbed = new EmbedBuilder()
      .setTitle(`✅ ${effect.name} finished!`)
      .setDescription(
        `${effect.emoji} **${effect.name}** was performed on **${targetUser.username}** by **${executor.username}**`
      )
      .setColor(0x00ff00)
      .setThumbnail(targetUser.displayAvatarURL())
      .setTimestamp()
      .setFooter({ text: "Spawn Move Bot" });

    await message.edit({ embeds: [successEmbed] });

    // Send notification to spawn channel if configured
    if (config.spawnChannelId && config.spawnChannelId !== channel.id) {
      const spawnChannel = await client.channels.fetch(config.spawnChannelId);
      if (spawnChannel && spawnChannel.isTextBased()) {
        const notificationEmbed = new EmbedBuilder()
          .setTitle(`🎮 Spawn Move Executed`)
          .setDescription(
            `${effect.emoji} **${effect.name}** was performed on **${targetUser.username}** by **${executor.username}** in <#${channel.id}>`
          )
          .setColor(effect.color)
          .setTimestamp();

        await spawnChannel.send({ embeds: [notificationEmbed] });
      }
    }
  } catch (error) {
    console.error("Error during spawn move execution:", error);
    const errorEmbed = new EmbedBuilder()
      .setTitle(`❌ Error during execution`)
      .setDescription(
        `An error occurred while executing ${effect.name} on **${targetUser.username}**.`
      )
      .setColor(0xff0000)
      .setTimestamp();
    await message.edit({ embeds: [errorEmbed] });
  }
}

// Bot ready event
client.once("ready", () => {
  console.log(`🤖 Bot connecté en tant que ${client.user.tag}`);
  console.log(`📊 Servant ${client.guilds.cache.size} serveurs`);

  // Set bot status
  client.user.setActivity("Spawn Move", { type: "PLAYING" });
});

// Message interaction handler
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand() && !interaction.isButton()) return;

  try {
    if (interaction.isCommand()) {
      await handleCommand(interaction);
    } else if (interaction.isButton()) {
      await handleButton(interaction);
    }
  } catch (error) {
    console.error("Erreur lors du traitement de l'interaction:", error);
    const errorMessage =
      "Une erreur est survenue lors de l'exécution de la commande.";

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: errorMessage, flags: 64 });
    } else {
      await interaction.reply({ content: errorMessage, flags: 64 });
    }
  }
});

// Handle slash commands and context menu commands
async function handleCommand(interaction) {
  const { commandName } = interaction;

  // Check admin permissions for all commands
  if (!hasAdminPermission(interaction.member)) {
    return await interaction.reply({
      content:
        "❌ **Accès refusé** : Seuls les administrateurs peuvent utiliser les commandes de ce bot.\n\n" +
        "🔐 **Permissions requises :**\n" +
        "• Permission Administrateur\n" +
        "• Rôle administrateur spécifique (si configuré)\n" +
        "• Propriétaire du serveur",
      flags: 64,
    });
  }

  switch (commandName) {
    case "poke":
      await handlePokeCommand(interaction);
      break;
    case "pokerandom":
      await handlePokeRandomCommand(interaction);
      break;
    case "spawnlist":
      await handleSpawnListCommand(interaction);
      break;
    case "spawnhelp":
      await handleSpawnHelpCommand(interaction);
      break;
    case "Poke Wiz":
      await handleContextMenuCommand(interaction, "wiz");
      break;
    case "Poke Shake":
      await handleContextMenuCommand(interaction, "shake");
      break;
    case "Poke Bounce":
      await handleContextMenuCommand(interaction, "bounce");
      break;
    default:
      await interaction.reply({
        content: "Commande inconnue.",
        flags: 64,
      });
  }
}

// Handle poke command
async function handlePokeCommand(interaction) {
  const effectType = interaction.options.getString("effet");
  const mode = interaction.options.getString("mode") || "manual";

  if (!spawnEffects[effectType]) {
    return await interaction.reply({
      content:
        "❌ Effet invalide. Utilisez `/spawnlist` pour voir les effets disponibles.",
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
      // Exclude the bot itself
      if (member.id !== client.user.id) {
        connectedMembers.push(member);
      }
    });
  });

  if (connectedMembers.length === 0) {
    return await interaction.reply({
      content: "❌ Aucun utilisateur n'est connecté à un canal vocal.",
      flags: 64,
    });
  }

  // If random mode is selected, execute immediately
  if (mode === "random") {
    const randomMember =
      connectedMembers[Math.floor(Math.random() * connectedMembers.length)];
    const targetUser = randomMember.user;

    // Create spawn move interface
    const embed = createSpawnMoveEffect(targetUser, effectType);
    embed.setTitle(`${embed.data.title} 🎲 (Aléatoire)`);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`spawn_${targetUser.id}_${effectType}`)
        .setLabel("Exécuter")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("⚡"),
      new ButtonBuilder()
        .setCustomId(`cancel_${targetUser.id}_${effectType}`)
        .setLabel("Annuler")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("❌")
    );

    return await interaction.reply({
      embeds: [embed],
      components: [row],
      flags: 64,
    });
  }

  // Manual mode - show selection interface
  const effect = spawnEffects[effectType];
  const embed = new EmbedBuilder()
    .setTitle(`${effect.emoji} ${effect.name} - Sélection d'utilisateur`)
    .setDescription(
      `Choisissez l'utilisateur à cibler pour l'effet **${effect.name}** :\n\n` +
        connectedMembers
          .map(
            (member, index) =>
              `${index + 1}. **${member.user.username}** (${
                member.voice.channel.name
              })`
          )
          .join("\n")
    )
    .setColor(effect.color)
    .setTimestamp();

  // Create buttons for each connected user (max 5 buttons per row, Discord limit)
  const rows = [];
  const maxButtonsPerRow = 5;

  for (let i = 0; i < connectedMembers.length; i += maxButtonsPerRow) {
    const row = new ActionRowBuilder();
    const userBatch = connectedMembers.slice(i, i + maxButtonsPerRow);

    userBatch.forEach((member, batchIndex) => {
      const globalIndex = i + batchIndex;
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`select_user_${member.id}_${effectType}`)
          .setLabel(`${globalIndex + 1}. ${member.user.username}`)
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("👤")
      );
    });

    rows.push(row);
  }

  // Add cancel button to the last row
  if (rows.length > 0) {
    const lastRow = rows[rows.length - 1];
    if (lastRow.components.length < maxButtonsPerRow) {
      lastRow.addComponents(
        new ButtonBuilder()
          .setCustomId(`cancel_selection_${effectType}`)
          .setLabel("Annuler")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("❌")
      );
    } else {
      // Create a new row for the cancel button
      const cancelRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`cancel_selection_${effectType}`)
          .setLabel("Annuler")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("❌")
      );
      rows.push(cancelRow);
    }
  }

  await interaction.reply({
    embeds: [embed],
    components: rows,
    flags: 64,
  });
}

// Handle poke random command
async function handlePokeRandomCommand(interaction) {
  const effectType = interaction.options.getString("effet");

  if (!spawnEffects[effectType]) {
    return await interaction.reply({
      content:
        "❌ Effet invalide. Utilisez `/spawnlist` pour voir les effets disponibles.",
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
      // Exclude the bot itself
      if (member.id !== client.user.id) {
        connectedMembers.push(member);
      }
    });
  });

  if (connectedMembers.length === 0) {
    return await interaction.reply({
      content: "❌ Aucun utilisateur n'est connecté à un canal vocal.",
      flags: 64,
    });
  }

  // Select random member
  const randomMember =
    connectedMembers[Math.floor(Math.random() * connectedMembers.length)];
  const targetUser = randomMember.user;

  // Create spawn move interface
  const embed = createSpawnMoveEffect(targetUser, effectType);
  embed.setTitle(`${embed.data.title} 🎲 (Aléatoire)`);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`spawn_${targetUser.id}_${effectType}`)
      .setLabel("Exécuter")
      .setStyle(ButtonStyle.Primary)
      .setEmoji("⚡"),
    new ButtonBuilder()
      .setCustomId(`cancel_${targetUser.id}_${effectType}`)
      .setLabel("Annuler")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("❌")
  );

  await interaction.reply({
    embeds: [embed],
    components: [row],
    flags: 64,
  });
}

// Handle context menu commands
async function handleContextMenuCommand(interaction, effectType) {
  const targetUser = interaction.targetUser;

  // Check if user is connected to a voice channel
  const member = await interaction.guild.members.fetch(targetUser.id);
  if (!member.voice.channel) {
    return await interaction.reply({
      content: `❌ **${targetUser.username}** n'est pas connecté à un canal vocal.`,
      flags: 64,
    });
  }

  // Execute the spawn move directly
  await interaction.reply({
    content: `⚡ Exécution du ${spawnEffects[effectType].name} sur ${targetUser.username}...`,
    flags: 64,
  });

  try {
    // Execute the spawn move in the channel
    await executeSpawnMove(
      interaction.channel,
      targetUser,
      effectType,
      interaction.user
    );
  } catch (error) {
    console.error("Erreur lors de l'exécution du menu contexte:", error);

    // Check if it's a disconnection error
    if (error.code === 40032) {
      await interaction.followUp({
        content: `❌ **${targetUser.username}** s'est déconnecté du canal vocal.`,
        flags: 64,
      });
    } else {
      await interaction.followUp({
        content: "❌ Erreur lors de l'exécution du spawn move.",
        flags: 64,
      });
    }
  }
}

// Handle spawn list command
async function handleSpawnListCommand(interaction) {
  const embed = new EmbedBuilder()
    .setTitle("🎮 Effets de Spawn Move Disponibles")
    .setDescription("Voici tous les effets que vous pouvez utiliser :")
    .setColor(0x0099ff)
    .setTimestamp();

  Object.entries(spawnEffects).forEach(([key, effect]) => {
    embed.addFields({
      name: `${effect.emoji} ${effect.name}`,
      value: `${effect.description}\nCommande: \`/poke effet: ${key}\``,
      inline: true,
    });
  });

  embed.addFields({
    name: "🖱️ Menu Clic Droit",
    value:
      "Vous pouvez aussi utiliser le menu clic droit sur un utilisateur pour des effets rapides :\n• **Poke Wiz** - Effet Wiz direct\n• **Poke Shake** - Effet Shake direct\n• **Poke Bounce** - Effet Bounce direct",
    inline: false,
  });

  embed.addFields({
    name: "📋 Utilisation",
    value:
      '1. Tapez `/poke effet: [effet]`\n2. Sélectionnez l\'utilisateur connecté dans la liste\n3. Cliquez sur "Exécuter"',
    inline: false,
  });

  embed.addFields({
    name: "🎲 Mode Aléatoire",
    value:
      "• `/poke effet: [effet] mode:random` - Sélection aléatoire\n• `/pokerandom effet: [effet]` - Commande dédiée aléatoire",
    inline: false,
  });

  await interaction.reply({ embeds: [embed], flags: 64 });
}

// Handle spawn help command
async function handleSpawnHelpCommand(interaction) {
  const embed = new EmbedBuilder()
    .setTitle("❓ Aide - Spawn Move Bot")
    .setDescription(
      "Ce bot permet d'effectuer des actions spéciales sur les utilisateurs.\n\n" +
        "🔒 **Bot réservé aux administrateurs uniquement**"
    )
    .setColor(0x00ff00)
    .addFields(
      {
        name: "📋 Commandes",
        value:
          "`/poke` - Effectuer un spawn move\n`/pokerandom` - Spawn move aléatoire\n`/spawnlist` - Voir les effets disponibles\n`/spawnhelp` - Afficher cette aide",
      },
      {
        name: "🔐 Permissions Requises",
        value:
          "• Permission **Administrateur**\n" +
          "• Rôle administrateur spécifique (si configuré)\n" +
          "• Propriétaire du serveur",
      },
      {
        name: "🎯 Utilisation",
        value:
          '1. Utilisez `/poke effet: [effet]`\n2. Sélectionnez l\'utilisateur connecté dans la liste\n3. Cliquez sur "Exécuter"',
      },
      {
        name: "🎲 Mode Aléatoire",
        value:
          "1. Utilisez `/pokerandom effet: [effet]`\n2. Ou `/poke effet: [effet] mode:random`\n3. L'utilisateur est sélectionné automatiquement",
      },
      {
        name: "🖱️ Menu Clic Droit",
        value:
          "Clic droit sur un utilisateur → Applications → Choisir l'effet :\n• **Poke Wiz** - Effet Wiz direct\n• **Poke Shake** - Effet Shake direct\n• **Poke Bounce** - Effet Bounce direct",
      },
      {
        name: "⚠️ Important",
        value:
          "• L'utilisateur doit être connecté à un canal vocal\n• Toutes les commandes sont réservées aux administrateurs",
      }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed], flags: 64 });
}

// Handle button interactions
async function handleButton(interaction) {
  // Check admin permissions for button interactions
  if (!hasAdminPermission(interaction.member)) {
    return await interaction.reply({
      content:
        "❌ **Accès refusé** : Seuls les administrateurs peuvent utiliser les boutons de ce bot.",
      flags: 64,
    });
  }

  const customIdParts = interaction.customId.split("_");
  const action = customIdParts[0];

  if (action === "spawn") {
    const [, userId, effectType] = customIdParts;
    await handleSpawnExecution(interaction, userId, effectType);
  } else if (action === "cancel") {
    await handleSpawnCancel(interaction);
  } else if (action === "select") {
    const [, , userId, effectType] = customIdParts;
    await handleUserSelection(interaction, userId, effectType);
  } else if (action === "cancel" && customIdParts[1] === "selection") {
    await handleSelectionCancel(interaction);
  }
}

// Handle spawn execution
async function handleSpawnExecution(interaction, userId, effectType) {
  try {
    const targetUser = await client.users.fetch(userId);
    const effect = spawnEffects[effectType];

    if (!targetUser || !effect) {
      return await interaction.reply({
        content: "❌ Erreur: Utilisateur ou effet introuvable.",
        flags: 64,
      });
    }

    // Check if user is still connected to a voice channel
    const member = await interaction.guild.members.fetch(userId);
    if (!member.voice.channel) {
      const errorEmbed = new EmbedBuilder()
        .setTitle(`❌ ${effect.name} annulé`)
        .setDescription(
          `**${targetUser.username}** n'est plus connecté à un canal vocal.\nL'effet ne peut pas être exécuté.`
        )
        .setColor(0xff0000)
        .setTimestamp();

      await interaction.update({
        embeds: [errorEmbed],
        components: [],
      });
      return;
    }

    // Update the message to show execution
    const executingEmbed = new EmbedBuilder()
      .setTitle(`⚡ Exécution en cours...`)
      .setDescription(
        `${effect.emoji} Exécution du ${effect.name} sur ${targetUser.username}`
      )
      .setColor(effect.color)
      .setTimestamp();

    await interaction.update({
      embeds: [executingEmbed],
      components: [],
    });

    // Execute the spawn move in the channel
    await executeSpawnMove(
      interaction.channel,
      targetUser,
      effectType,
      interaction.user
    );
  } catch (error) {
    console.error("Erreur lors de l'exécution:", error);

    // Check if it's a disconnection error
    if (error.code === 40032) {
      await interaction.followUp({
        content: "❌ L'utilisateur s'est déconnecté du canal vocal.",
        flags: 64,
      });
    } else {
      await interaction.followUp({
        content: "❌ Erreur lors de l'exécution du spawn move.",
        flags: 64,
      });
    }
  }
}

// Handle user selection
async function handleUserSelection(interaction, userId, effectType) {
  try {
    const targetUser = await client.users.fetch(userId);
    const effect = spawnEffects[effectType];

    if (!targetUser || !effect) {
      return await interaction.reply({
        content: "❌ Erreur: Utilisateur ou effet introuvable.",
        flags: 64,
      });
    }

    // Create spawn move interface
    const embed = createSpawnMoveEffect(targetUser, effectType);
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`spawn_${targetUser.id}_${effectType}`)
        .setLabel("Exécuter")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("⚡"),
      new ButtonBuilder()
        .setCustomId(`cancel_${targetUser.id}_${effectType}`)
        .setLabel("Annuler")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("❌")
    );

    await interaction.update({
      embeds: [embed],
      components: [row],
    });
  } catch (error) {
    console.error("Erreur lors de la sélection d'utilisateur:", error);
    await interaction.reply({
      content: "❌ Erreur lors de la sélection d'utilisateur.",
      flags: 64,
    });
  }
}

// Handle selection cancel
async function handleSelectionCancel(interaction) {
  const embed = new EmbedBuilder()
    .setTitle("❌ Sélection Annulée")
    .setDescription("La sélection d'utilisateur a été annulée.")
    .setColor(0xff0000)
    .setTimestamp();

  await interaction.update({
    embeds: [embed],
    components: [],
  });
}

// Handle spawn cancel
async function handleSpawnCancel(interaction) {
  const embed = new EmbedBuilder()
    .setTitle("❌ Spawn Move Annulé")
    .setDescription("L'action a été annulée.")
    .setColor(0xff0000)
    .setTimestamp();

  await interaction.update({
    embeds: [embed],
    components: [],
  });
}

// Error handling
client.on("error", (error) => {
  console.error("Erreur Discord:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("Promesse rejetée non gérée:", error);
});

// Login to Discord
client.login(config.token);

module.exports = { client, spawnEffects };
