# Paper Ball - Phaser 3 Game POC Collection

A collection of 7 fully playable game prototypes built with **Phaser 3** game engine, demonstrating different game mechanics and genres.

## ⚠️ IMPORTANT: Games Require HTTP Server

**The games will show a BLACK SCREEN if you open HTML files directly.** This is due to browser CORS security policies that block local file loading.

**✅ SOLUTION:** Use an HTTP server (see instructions below)

## 🎮 Available Games

1. **Root (/)** - Main deployment (top-down game with particles)
2. **game-poc/** - Original top-down game with physics and particle effects
3. **side-scroller/** - Horizontal platformer with 50 collectible coins
4. **admin-game/** - Element placement and management system
5. **tower-defense/** - Strategic tower defense with monster waves
6. **physics-adventure/** - Momentum-based platformer with terrain
7. **rpg/** - Story-driven RPG with dialogs, NPCs, and house interiors

## 🚀 Quick Start

### Using the Helper Script (Linux/Mac)

```bash
./start-server.sh game-poc
# Then open http://localhost:8080
```

### Option 1: Using npm (Recommended)

```bash
cd game-poc          # or any game folder
npm start
# Then open http://localhost:8080
```

### Option 2: Using Python

```bash
cd game-poc          # or any game folder
python -m http.server 8080
# Then open http://localhost:8080
```

### Option 3: Using npx serve

```bash
cd game-poc          # or any game folder
npx serve
# Then open the URL shown (usually http://localhost:3000)
```

## 📖 Full Documentation

See [HOW-TO-RUN.md](HOW-TO-RUN.md) for detailed instructions and troubleshooting.

## ✨ Features

- **Phaser 3.70.0** game engine
- **PNG-based sprites** (no runtime generation)
- **4-directional character** animations
- **Particle effects** (smoke, sparks, confetti)
- **Loading screens** for all games
- **Mobile controls** (touch-enabled)
- **Physics systems** (Matter.js and Arcade)
- **Automated tests** (Jest + Playwright)
- **CI/CD pipeline** (GitHub Actions)

## 🎯 Game Details

### game-poc / Root
- Top-down movement with 4-directional sprites
- Particle effects (smoke trails, collision sparks, confetti)
- Multi-stage system with popups
- Physics-based interactions (push square dolls)

### side-scroller
- Horizontal scrolling camera (4000px world)
- 50 collectible gold coins
- Score tracking (+10 per coin)
- Platformer physics with gravity

### admin-game
- Click-based element placement
- CREATE button to enter placement mode
- Confirmation popups for actions
- Element demolish system

### tower-defense
- Strategic tower placement
- 30 monsters per stage with pathfinding
- Auto-targeting towers (150px range)
- 3 stages with unique layouts
- Win: Kill 20 monsters | Lose: 3 escape

### physics-adventure
- Momentum-based platforming
- Hills, valleys, and holes
- Charge mechanic (SHIFT for 2x speed)
- 3 stages with increasing difficulty

### rpg
- Opening dialog sequence
- Character selection (Warrior, Mage, Rogue)
- Clothing customization
- Explorable side-scrolling world
- Enterable houses with interiors
- NPC dialogs and interactions

## 🛠️ Technologies

- **Engine:** Phaser 3.70.0
- **Physics:** Matter.js / Arcade Physics
- **Testing:** Jest + Playwright
- **CI/CD:** GitHub Actions
- **Assets:** PNG spritesheets and images
- **Audio:** Web Audio API


## 📦 Project Structure

```
paper-ball/
├── index.html              # Root game (game-poc variant)
├── HOW-TO-RUN.md          # Detailed running instructions
├── start-server.sh        # Helper script to start HTTP server
├── game-poc/              # Original top-down game
├── side-scroller/         # Platformer with collectables
├── admin-game/            # Element management
├── tower-defense/         # Strategic TD game
├── physics-adventure/     # Momentum platformer
├── rpg/                   # Story-driven RPG
├── lib/                   # Phaser 3.70.0 library
├── assets/                # Shared PNG sprites
├── tests/                 # Jest test suites
└── .github/workflows/     # CI/CD automation
```

## ✅ Verified Working

All 7 games have been tested and verified working correctly when served via HTTP:
- Phaser 3.70.0 loads successfully
- Canvas renders at 800×600
- All PNG assets load correctly
- Game logic executes properly

**Screenshot proof:** The games work perfectly when accessed via `http://localhost:PORT`

## 🔧 Troubleshooting

### Black Screen Issue

**Problem:** Opening HTML files directly shows black screen.

**Solution:** Use HTTP server (see Quick Start section above).

**Why:** Modern browsers block local file access due to CORS security policies. An HTTP server serves files via `http://` protocol instead of `file://` protocol.

## 📊 CI/CD Pipeline

GitHub Actions workflow automatically:
- Runs Jest tests for all 7 games
- Generates 4 screenshots per game using Playwright
- Uploads test coverage reports
- Creates artifact bundles (30-day retention)
- Comments coverage on pull requests

## 📄 Documentation

- [HOW-TO-RUN.md](HOW-TO-RUN.md) - Detailed running instructions
- [ROOT-GAME-README.md](ROOT-GAME-README.md) - Root game documentation
- [GAME-VARIANTS.md](GAME-VARIANTS.md) - All variants documentation
- `.github/copilot-instructions/` - GitHub Copilot guidelines

## 🎮 Controls

### Desktop
- **Arrow keys** or **WASD** - Move character
- **Space** - Jump (where applicable)
- **SHIFT** - Charge/Sprint (physics-adventure)
- **Mouse** - Click to interact (admin-game, tower-defense)

### Mobile
- **On-screen D-pad** - Movement
- **Touch buttons** - Actions (Jump, etc.)
- **Tap** - Interact with UI elements

## 📝 License

MIT License - Feel free to use and modify!
