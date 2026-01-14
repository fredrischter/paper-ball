# How to Run the Games

## ⚠️ IMPORTANT: Games Require an HTTP Server

**The games will show a BLACK SCREEN if you open the HTML files directly** by double-clicking them. This is because browsers block local file access for security reasons (CORS policy).

## Quick Start

### Option 1: Using npm (Recommended)

Each game folder has a `package.json` with a start script:

```bash
cd game-poc          # or any other game folder
npm start
```

Then open your browser to: **http://localhost:8080**

### Option 2: Using Python

If you have Python installed:

```bash
cd game-poc          # or any other game folder
python -m http.server 8080
```

Then open your browser to: **http://localhost:8080**

### Option 3: Using npx serve

```bash
cd game-poc          # or any other game folder
npx serve
```

Then open your browser to the URL shown in the terminal (usually **http://localhost:3000**)

### Option 4: Using http-server (Node.js)

```bash
npm install -g http-server
cd game-poc          # or any other game folder
http-server -p 8080
```

Then open your browser to: **http://localhost:8080**

## Available Games

1. **Root folder (/)** - Main game (game-poc variant)
2. **game-poc/** - Original top-down game with particles
3. **side-scroller/** - Horizontal platformer with collectables
4. **admin-game/** - Element management game
5. **tower-defense/** - Tower defense strategy game
6. **physics-adventure/** - Momentum-based platformer
7. **rpg/** - Story-driven RPG with dialogs and NPCs

## Troubleshooting

### Black Screen Issue

**Symptom:** You see only a black screen when opening the HTML file.

**Cause:** You're opening the file directly (file:// protocol) instead of using an HTTP server.

**Solution:** Use one of the HTTP server methods above.

### Why Do I Need a Server?

Modern browsers block local files from loading other local files (images, scripts, etc.) for security reasons. This is called the CORS (Cross-Origin Resource Sharing) policy. An HTTP server bypasses this restriction because the files are served via HTTP protocol instead of file:// protocol.

## Verification

To verify a game is working correctly via HTTP server:

1. Start the HTTP server in the game folder
2. Open your browser to the local URL
3. You should see:
   - A green "Loading..." screen with progress bar
   - Then the game loads with the character, UI buttons, and background
   - The browser console should show "Game POC initialized" and Phaser version

## Screenshots

When working correctly via HTTP server, the games look like this:

- **game-poc/side-scroller/rpg**: Character on green/brown background with UI
- **admin-game**: Green field with CREATE button on right side
- **tower-defense**: Path layout with tower placement indicators
- **physics-adventure**: Platformer with terrain

## Need Help?

If you've started an HTTP server and still see issues:

1. Check the browser console for errors (F12 → Console tab)
2. Verify you're accessing http://localhost:PORT not file://
3. Try a different browser (Chrome, Firefox, Edge)
4. Make sure the port isn't already in use

## For Developers

The games use:
- **Phaser 3.70.0** game engine
- **Matter.js / Arcade Physics** for physics
- **PNG assets** loaded via Phaser's loader
- **Web Audio API** for sound (requires user interaction)

All games are fully self-contained and work offline once loaded via HTTP.
