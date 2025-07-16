# 🎵 Fichiers audio pour le bot Spawn Move

Ce dossier contient les fichiers MP3 utilisés par le bot pour les effets de spawn move.

## 📁 Structure des fichiers

```
audio/
├── wiz.mp3      # Son pour l'effet Wiz (magique/étoiles)
├── poke.mp3     # Son pour l'effet Poke (court/rapide)
├── shake.mp3    # Son pour l'effet Shake (tremblement)
├── bounce.mp3   # Son pour l'effet Bounce (rebond)
└── README.md    # Ce fichier
```

## 🎯 Fichiers requis

Placez les fichiers MP3 suivants dans ce dossier :

### **wiz.mp3**

- **Durée recommandée** : 1 à 3 secondes
- **Style** : Son magique, étoiles, scintillement
- **Format** : MP3, 44.1kHz, 128-320kbps

### **poke.mp3**

- **Durée recommandée** : 0,5 à 1 seconde
- **Style** : Son court, rapide, "pop"
- **Format** : MP3, 44.1kHz, 128-320kbps

### **shake.mp3**

- **Durée recommandée** : 2 à 4 secondes
- **Style** : Tremblement, vibration, secousse
- **Format** : MP3, 44.1kHz, 128-320kbps

### **bounce.mp3**

- **Durée recommandée** : 1 à 2 secondes
- **Style** : Rebond, ballon, bounce
- **Format** : MP3, 44.1kHz, 128-320kbps

## 🎵 Sources recommandées

Vous pouvez trouver des sons gratuits sur :

- **Freesound.org** – Sons libres de droits
- **Zapsplat.com** – Effets sonores gratuits
- **Soundbible.com** – Sons courts et effets
- **YouTube Audio Library** – Musique et effets gratuits

## ⚠️ Important

- Les fichiers doivent être au format **MP3**
- Les noms de fichiers doivent être **exactement** ceux indiqués
- Taille recommandée : moins de 1 Mo par fichier
- Qualité : 128-320kbps pour un bon équilibre qualité/taille

## 🔧 Test

Une fois les fichiers placés, redémarrez le bot et testez :

```bash
npm run dev
```

Puis dans Discord :

```
/poke effet:wiz
```

Le bot doit alors jouer le son correspondant lors du ping-pong vocal !
