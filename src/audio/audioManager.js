const {
  createAudioResource,
  createAudioPlayer,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const path = require("path");

/**
 * Create an audio player and resource for a given file and volume
 * @param {string} audioFile - The filename of the audio (relative to /audio)
 * @param {number} volume - The volume (1.0 = 100%)
 * @returns {{ resource, player }}
 */
function createAudioPlayback(audioFile, volume = 1.0) {
  // Build the absolute path to the audio file
  const audioPath = path.join(__dirname, "../../audio", audioFile);
  // Create the audio resource with inline volume
  const resource = createAudioResource(audioPath, {
    inputType: "arbitrary",
    inlineVolume: true,
  });
  resource.volume.setVolume(volume);
  // Create the audio player
  const player = createAudioPlayer();
  return { resource, player };
}

module.exports = {
  createAudioPlayback,
};
