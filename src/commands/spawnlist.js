const spawnEffects = require("../effects/effects");
const { EmbedBuilder } = require("discord.js");

/**
 * Handle the /spawnlist command
 * @param {CommandInteraction} interaction
 */
async function handleSpawnListCommand(interaction) {
  const embed = new EmbedBuilder()
    .setTitle("🎮 Available Spawn Move Effects")
    .setDescription("Here are all the effects you can use:")
    .setColor(0x0099ff)
    .setTimestamp();

  Object.entries(spawnEffects).forEach(([key, effect]) => {
    embed.addFields({
      name: `${effect.emoji} ${effect.name}`,
      value: `${effect.description}\nCommand: \/poke effet: ${key}`,
      inline: true,
    });
  });

  await interaction.reply({ embeds: [embed], flags: 64 });
}

module.exports = { handleSpawnListCommand };
