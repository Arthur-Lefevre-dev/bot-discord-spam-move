# 🤖 Bot Discord Spawn Move

Un bot Discord simple et efficace pour effectuer des "spawn moves" sur les utilisateurs, similaire aux fonctionnalités de wiz sur MSN ou poke sur Teamspeak.

## ✨ Fonctionnalités

- **🎮 Effets de Spawn Move** : Wiz, Poke, Shake, Bounce
- **⚡ Commandes Slash** : Intégration native Discord
- **🔐 Système de Permissions** : **Réservé aux administrateurs uniquement**
- **🎨 Animations** : Effets visuels avec embeds Discord
- **📱 Notifications** : Messages dans les canaux configurés
- **🔒 Sécurité** : Contrôle d'accès strict pour les administrateurs

## 🚀 Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Un bot Discord (voir [Guide de création](#création-du-bot-discord))

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd bot-discord-spam-move
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration

1. Copiez le fichier d'exemple :

```bash
cp env.example .env
```

2. Éditez le fichier `.env` avec vos informations :

```env
# Discord Bot Configuration
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_discord_client_id_here
DISCORD_GUILD_ID=your_guild_id_here

# Bot Configuration
ADMIN_ROLE_ID=your_admin_role_id_here
SPAWN_CHANNEL_ID=your_spawn_channel_id_here
```

### 4. Enregistrer les commandes slash

```bash
npm run deploy
```

### 5. Démarrer le bot

```bash
# Démarrer le bot Discord
npm start

# Ou en mode développement
npm run dev
```

## 🤖 Création du Bot Discord

### 1. Créer une application Discord

1. Allez sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Cliquez sur "New Application"
3. Donnez un nom à votre application
4. Notez l'**Application ID** (Client ID)

### 2. Créer le bot

1. Dans votre application, allez dans "Bot"
2. Cliquez sur "Add Bot"
3. Copiez le **Token** du bot
4. Activez les options suivantes :
   - **Message Content Intent**
   - **Server Members Intent**

### 3. Inviter le bot sur votre serveur

1. Allez dans "OAuth2" > "URL Generator"
2. Sélectionnez les scopes :
   - `bot`
   - `applications.commands`
3. Sélectionnez les permissions :
   - `Send Messages`
   - `Use Slash Commands`
   - `Embed Links`
   - `Read Message History`
   - `Move Members` (pour déplacer les utilisateurs)
   - `Manage Channels` (pour créer les canaux temporaires)
4. Utilisez l'URL générée pour inviter le bot

## 📋 Commandes Disponibles

> ⚠️ **IMPORTANT** : Toutes les commandes sont réservées aux **administrateurs uniquement**.

### `/poke`

Effectue un spawn move sur un utilisateur connecté.

**Permissions requises :**

- Permission **Administrateur** sur le serveur
- Ou rôle administrateur spécifique (si configuré)
- Ou être propriétaire du serveur

**Options :**

- `effet` : Le type d'effet (requis)
  - ✨ Wiz
  - 👆 Poke
  - 🌪️ Shake
  - 🏀 Bounce
- `mode` : Mode de sélection (optionnel)
  - 🎯 Sélection manuelle (par défaut)
  - 🎲 Aléatoire

**Utilisation :**

1. Tapez `/poke effet:wiz`
2. Sélectionnez l'utilisateur connecté dans la liste des boutons
3. Cliquez sur "Exécuter"

**Exemples :**

```
/poke effet:wiz                    # Mode manuel (par défaut)
/poke effet:wiz mode:random        # Mode aléatoire
```

### `/pokerandom`

Effectue un spawn move aléatoire sur un utilisateur connecté.

**Options :**

- `effet` : Le type d'effet (requis)
  - ✨ Wiz
  - 👆 Poke
  - 🌪️ Shake
  - 🏀 Bounce

**Utilisation :**

1. Tapez `/pokerandom effet:wiz`
2. L'utilisateur est sélectionné automatiquement
3. Cliquez sur "Exécuter"

**Exemple :**

```
/pokerandom effet:wiz
```

### Menu Clic Droit (Applications)

Vous pouvez aussi utiliser le menu clic droit sur un utilisateur :

- **Poke Wiz** - Effet Wiz direct
- **Poke Shake** - Effet Shake direct
- **Poke Bounce** - Effet Bounce direct

### `/spawnlist`

Affiche la liste des effets disponibles.

### `/spawnhelp`

Affiche l'aide et les instructions d'utilisation.

## 🎯 Utilisation

### Commande `/poke`

1. **Tapez `/poke effet:wiz`** dans un canal
2. **Sélectionnez l'utilisateur** dans la liste des boutons (seuls les utilisateurs connectés apparaissent)
3. **Cliquez sur "Exécuter"**

### Commande `/pokerandom`

1. **Tapez `/pokerandom effet:wiz`** dans un canal
2. **L'utilisateur est sélectionné automatiquement** au hasard
3. **Cliquez sur "Exécuter"**

### Menu Clic Droit

1. **Clic droit** sur un utilisateur
2. **Applications** → Choisissez l'effet :
   - **Poke Wiz** - Effet Wiz direct
   - **Poke Shake** - Effet Shake direct
   - **Poke Bounce** - Effet Bounce direct

> 💡 **Note** : L'utilisateur doit être connecté à un canal vocal pour que les effets fonctionnent.

## 🔧 Configuration Avancée

### Variables d'Environnement

| Variable            | Description                                      | Requis |
| ------------------- | ------------------------------------------------ | ------ |
| `DISCORD_TOKEN`     | Token du bot Discord                             | ✅     |
| `DISCORD_CLIENT_ID` | ID de l'application Discord                      | ✅     |
| `DISCORD_GUILD_ID`  | ID du serveur (optionnel)                        | ❌     |
| `ADMIN_ROLE_ID`     | ID du rôle administrateur spécifique (optionnel) | ❌     |
| `SPAWN_CHANNEL_ID`  | ID du canal de spawn                             | ❌     |

### Configuration des Permissions Administrateur

Le bot vérifie les permissions dans cet ordre :

1. **Permission Administrateur** sur le serveur
2. **Rôle administrateur spécifique** (si `ADMIN_ROLE_ID` est configuré)
3. **Propriétaire du serveur**

### Permissions Bot

Le bot nécessite les permissions suivantes sur Discord :

- **Send Messages** : Envoyer des messages
- **Use Slash Commands** : Utiliser les commandes slash
- **Embed Links** : Envoyer des embeds
- **Read Message History** : Lire l'historique des messages
- **Move Members** : Déplacer les membres entre canaux vocaux
- **Manage Channels** : Créer et gérer les canaux temporaires
- **Connect** : Se connecter aux canaux vocaux
- **Speak** : Parler dans les canaux vocaux (pour l'audio)

## 🎨 Personnalisation

### Ajouter de nouveaux effets

1. Éditez `src/bot.js`
2. Ajoutez un nouvel effet dans `spawnEffects` :

```javascript
const spawnEffects = {
  // ... effets existants
  nouveau: {
    name: "Nouveau",
    description: "Description du nouvel effet",
    color: 0x00ff00,
    emoji: "🌟",
    animation: ["🌟", "⭐", "💫", "🌟"],
  },
};
```

3. Mettez à jour les commandes dans `src/deploy-commands.js`
4. Redéployez les commandes : `npm run deploy`

## 🐛 Dépannage

### Le bot ne répond pas

1. Vérifiez que le token est correct
2. Assurez-vous que les intents sont activés
3. Vérifiez les permissions du bot

### Les commandes slash ne fonctionnent pas

1. Exécutez `npm run deploy`
2. Attendez jusqu'à 1 heure pour les commandes globales
3. Vérifiez que le bot a la permission "Use Slash Commands"

### L'ID utilisateur ne fonctionne pas

1. Vérifiez que l'ID est correct
2. Assurez-vous que l'utilisateur existe
3. Vérifiez que le bot peut voir l'utilisateur

### Erreur "Accès refusé" ou "Permissions insuffisantes"

1. **Vérifiez vos permissions** :

   - Vous devez avoir la permission **Administrateur** sur le serveur
   - Ou être propriétaire du serveur
   - Ou avoir le rôle administrateur spécifique (si configuré)

2. **Vérifiez la configuration** :

   - Si vous utilisez `ADMIN_ROLE_ID`, vérifiez que l'ID du rôle est correct
   - Assurez-vous que vous avez bien le rôle configuré

3. **Vérifiez les permissions du bot** :
   - Le bot doit avoir les permissions "Move Members" et "Manage Channels"
   - Vérifiez que le bot est bien dans le serveur avec les bonnes permissions

## 📝 Structure du Projet

```
bot-discord-spam-move/
├── src/
│   ├── bot.js              # Bot Discord principal
│   └── deploy-commands.js  # Déploiement des commandes
├── package.json            # Dépendances
├── env.example            # Variables d'environnement
└── README.md              # Documentation
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez la section [Dépannage](#dépannage)
2. Consultez les [Issues](https://github.com/votre-repo/issues)
3. Créez une nouvelle issue avec les détails du problème

---

**Développé avec ❤️ pour la communauté Discord**
