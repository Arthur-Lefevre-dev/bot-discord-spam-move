const { EmbedBuilder } = require("discord.js");

/**
 * Create a success embed
 */
function createSuccessEmbed(
  title,
  description,
  color = 0x00ff00,
  thumbnail,
  footer
) {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setTimestamp();
  if (thumbnail) embed.setThumbnail(thumbnail);
  if (footer) embed.setFooter({ text: footer });
  return embed;
}

/**
 * Create an error embed
 */
function createErrorEmbed(title, description, color = 0xff0000) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setTimestamp();
}

/**
 * Create an animation embed (for effect steps)
 */
function createAnimationEmbed(title, description, color) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setTimestamp();
}

module.exports = {
  createSuccessEmbed,
  createErrorEmbed,
  createAnimationEmbed,
};
