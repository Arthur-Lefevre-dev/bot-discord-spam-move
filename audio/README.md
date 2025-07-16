# 🎵 Audio Files for Spawn Move Bot

This folder contains the MP3 files used by the bot for spawn move effects.

## 📁 File Structure

```
audio/
├── wiz.mp3      # Sound for the Wiz effect (magical/stars)
├── poke.mp3     # Sound for the Poke effect (short/quick)
├── shake.mp3    # Sound for the Shake effect (shaking)
├── bounce.mp3   # Sound for the Bounce effect (bouncing)
└── README.md    # This file
```

## 🎯 Required Files

Place the following MP3 files in this folder:

### **wiz.mp3**

- **Recommended duration**: 1 to 3 seconds
- **Style**: Magical sound, stars, sparkle
- **Format**: MP3, 44.1kHz, 128-320kbps

### **poke.mp3**

- **Recommended duration**: 0.5 to 1 second
- **Style**: Short, quick, "pop" sound
- **Format**: MP3, 44.1kHz, 128-320kbps

### **shake.mp3**

- **Recommended duration**: 2 to 4 seconds
- **Style**: Shaking, vibration, tremor
- **Format**: MP3, 44.1kHz, 128-320kbps

### **bounce.mp3**

- **Recommended duration**: 1 to 2 seconds
- **Style**: Bouncing, ball, bounce
- **Format**: MP3, 44.1kHz, 128-320kbps

## 🎵 Recommended Sources

You can find free sounds at:

- **Freesound.org** – Royalty-free sounds
- **Zapsplat.com** – Free sound effects
- **Soundbible.com** – Short sounds and effects
- **YouTube Audio Library** – Free music and effects

## ⚠️ Important

- Files must be in **MP3** format
- File names must be **exactly** as indicated
- Recommended size: less than 1 MB per file
- Quality: 128-320kbps for a good quality/size balance

## 🔧 Test

Once the files are in place, restart the bot and test:

```bash
npm run dev
```

Then in Discord:

```
/poke effect:wiz
```

The bot should then play the corresponding sound during the voice ping-pong!
