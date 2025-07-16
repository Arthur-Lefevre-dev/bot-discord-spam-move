# 🤖 Discord Spawn Move Bot

A simple and efficient Discord bot to perform "spawn moves" on users, inspired by the classic MSN wiz or Teamspeak poke features.

## ✨ Features

- **🎮 Spawn Move Effects**: Wiz, Poke, Shake, Bounce
- **⚡ Slash Commands**: Native Discord integration
- **🔐 Permission System**: **Admins only**
- **🎨 Animations**: Visual effects with Discord embeds
- **📱 Notifications**: Messages in configured channels
- **🔒 Security**: Strict admin access control

## 🚀 Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- A Discord bot (see [Creating the Discord Bot](#creating-the-discord-bot))

### 1. Clone the project

```bash
git clone <your-repo>
cd bot-discord-spam-move
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configuration

1. Copy the example file:

```bash
cp env.example .env
```

2. Edit the `.env` file with your information:

```env
# Discord Bot Configuration
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_application_client_id
DISCORD_GUILD_ID=your_guild_id

# Bot Configuration
ADMIN_ROLE_ID=your_admin_role_id
SPAWN_CHANNEL_ID=your_spawn_channel_id
```

### 4. Deploy slash commands

```bash
npm run deploy
```

### 5. Start the bot

```bash
# Start the Discord bot
npm start

# Or in development mode
npm run dev
```

## 🤖 Creating the Discord Bot

### 1. Create a Discord application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give your application a name
4. Note the **Application ID** (Client ID)

### 2. Create the bot

1. In your application, go to "Bot"
2. Click "Add Bot"
3. Copy the **Bot Token**
4. Enable the following options:
   - **Message Content Intent**
   - **Server Members Intent**

### 3. Invite the bot to your server

1. Go to "OAuth2" > "URL Generator"
2. Select the scopes:
   - `bot`
   - `applications.commands`
3. Select the permissions:
   - `Send Messages`
   - `Use Slash Commands`
   - `Embed Links`
   - `Read Message History`
   - `Move Members` (to move users)
   - `Manage Channels` (to create temporary channels)
4. Use the generated URL to invite the bot

## 📋 Available Commands

> ⚠️ **IMPORTANT**: All commands are **admin only**.

### `/poke`

Triggers a spawn move on a connected user.

**Required permissions:**

- **Administrator** permission on the server
- Or a specific admin role (if configured)
- Or be the server owner

**Options:**

- `effect`: Type of effect (required)
  - ✨ Wiz
  - 👆 Poke
  - 🌪️ Shake
  - 🏀 Bounce
- `mode`: Selection mode (optional)
  - 🎯 Manual selection (default)
  - 🎲 Random

**Usage:**

1. Type `/poke effect:wiz`
2. Select the connected user from the list
3. Click "Execute"

**Examples:**

```
/poke effect:wiz                    # Manual mode (default)
/poke effect:wiz mode:random        # Random mode
```

### `/pokerandom`

Triggers a random spawn move on a connected user.

**Options:**

- `effect`: Type of effect (required)
  - ✨ Wiz
  - 👆 Poke
  - 🌪️ Shake
  - 🏀 Bounce

**Usage:**

1. Type `/pokerandom effect:wiz`
2. The user is selected automatically
3. Click "Execute"

**Example:**

```
/pokerandom effect:wiz
```

### Right-Click Menu (Applications)

You can also use the right-click menu on a user:

- **Poke Wiz** – Direct Wiz effect
- **Poke Shake** – Direct Shake effect
- **Poke Bounce** – Direct Bounce effect

### `/spawnlist`

Shows the list of available effects.

### `/spawnhelp`

Shows help and usage instructions.

## 🎯 Usage

### `/poke` command

1. **Type `/poke effect:wiz`** in a channel
2. **Select the user** from the list (only connected users appear)
3. **Click "Execute"**

### `/pokerandom` command

1. **Type `/pokerandom effect:wiz`** in a channel
2. **The user is selected automatically** at random
3. **Click "Execute"**

### Right-Click Menu

1. **Right-click** on a user
2. **Applications** → Choose the effect:
   - **Poke Wiz** – Direct Wiz effect
   - **Poke Shake** – Direct Shake effect
   - **Poke Bounce** – Direct Bounce effect

> 💡 **Note**: The user must be connected to a voice channel for the effects to work.

## 🔧 Advanced Configuration

### Environment Variables

| Variable            | Description                       | Required |
| ------------------- | --------------------------------- | -------- |
| `DISCORD_TOKEN`     | Discord bot token                 | ✅       |
| `DISCORD_CLIENT_ID` | Discord application ID            | ✅       |
| `DISCORD_GUILD_ID`  | Server ID (optional)              | ❌       |
| `ADMIN_ROLE_ID`     | Specific admin role ID (optional) | ❌       |
| `SPAWN_CHANNEL_ID`  | Spawn channel ID                  | ❌       |

### Admin Permission Configuration

The bot checks permissions in this order:

1. **Administrator** permission on the server
2. **Specific admin role** (if `ADMIN_ROLE_ID` is set)
3. **Server owner**

### Bot Permissions

The bot requires the following Discord permissions:

- **Send Messages**
- **Use Slash Commands**
- **Embed Links**
- **Read Message History**
- **Move Members** (to move users)
- **Manage Channels** (to create temporary channels)
- **Connect** to voice channels
- **Speak** in voice channels (for audio)

## 🎨 Customization

### Add new effects

1. Edit `src/bot.js`
2. Add a new effect in `spawnEffects`:

```javascript
const spawnEffects = {
  // ... existing effects
  newEffect: {
    name: "New Effect",
    description: "Description of the new effect",
    color: 0x00ff00,
    emoji: "🌟",
    animation: ["🌟", "⭐", "💫", "🌟"],
  },
};
```

3. Update the commands in `src/deploy-commands.js`
4. Redeploy the commands: `npm run deploy`

## 🐛 Troubleshooting

### The bot does not respond

1. Check that the token is correct
2. Make sure the required intents are enabled
3. Check the bot's permissions

### Slash commands do not work

1. Run `npm run deploy`
2. Wait up to 1 hour for global commands
3. Check that the bot has the "Use Slash Commands" permission

### User ID does not work

1. Check that the ID is correct
2. Make sure the user exists
3. Check that the bot can see the user

### "Access denied" or "Insufficient permissions" error

1. **Check your permissions:**
   - You must have the **Administrator** permission on the server
   - Or be the server owner
   - Or have the specific admin role (if set)
2. **Check the configuration:**
   - If you use `ADMIN_ROLE_ID`, make sure the role ID is correct
   - Make sure you have the configured role
3. **Check the bot's permissions:**
   - The bot must have "Move Members" and "Manage Channels" permissions
   - Make sure the bot is in the server with the correct permissions

## 📝 Project Structure

```
bot-discord-spam-move/
├── src/
│   ├── bot.js              # Main Discord bot
│   └── deploy-commands.js  # Command deployment
├── package.json            # Dependencies
├── env.example             # Environment variables
└── README.md               # Documentation
```

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the project
2. Create a branch for your feature
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 🆘 Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. See the [Issues](https://github.com/your-repo/issues)
3. Create a new issue with details about your problem

---

**Developed with ❤️ for the Discord community**
