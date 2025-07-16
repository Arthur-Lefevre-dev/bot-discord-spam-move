// Spawn move effects definitions
// Each effect contains its name, description, color, emoji, animation frames, and associated audio file

const spawnEffects = {
  wiz: {
    name: "Wiz",
    description: "Performs a wiz on the user",
    color: 0x00ff00,
    emoji: "✨",
    animation: ["✨", "🌟", "💫", "⭐"],
    audioFile: "wiz.mp3",
  },
  poke: {
    name: "Poke",
    description: "Pokes the user",
    color: 0xff6b6b,
    emoji: "👆",
    animation: ["👆", "👉", "👈", "👆"],
    audioFile: "poke.mp3",
  },
  shake: {
    name: "Shake",
    description: "Shakes the user",
    color: 0xffa500,
    emoji: "🌪️",
    animation: ["🌪️", "🌀", "💨", "🌪️"],
    audioFile: "shake.mp3",
  },
  bounce: {
    name: "Bounce",
    description: "Makes the user bounce",
    color: 0x87ceeb,
    emoji: "🏀",
    animation: ["🏀", "⚽", "🏈", "🏀"],
    audioFile: "bounce.mp3",
  },
};

module.exports = spawnEffects;
