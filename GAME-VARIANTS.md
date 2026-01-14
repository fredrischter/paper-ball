# Game POC Collection

A collection of 5 game proof-of-concepts built with **Phaser 3**, each demonstrating different game mechanics and genres.

## 🎮 Game Variants

### 1. game-poc/ - **Original Character Demo**
The base POC with all features:
- Top-down movement with Matter.js physics
- 4-directional character animations  
- Multi-stage system with popups
- Particle effects (smoke, sparks, confetti)
- Physics dolls to push
- Mobile + desktop controls

**Type:** Top-down demo
**Controls:** WASD/Arrows + Space
**Stages:** 3 (with transitions)

---

### 2. side-scroller/ - **Horizontal Platformer**
Side-scrolling platformer with collectables:
- Horizontal camera scrolling
- Extended stages (5x viewport width)
- Collectables (coins/gems)
- Score tracking system
- Jump mechanics

**Type:** Side-scrolling platformer
**Controls:** Left/Right + Jump
**Stages:** 3 (horizontal levels)
**Key Feature:** Camera follows player, collect items

---

### 3. admin-game/ - **Element Management**
Strategic placement and management:
- No character movement
- Click-to-place elements
- CREATE button for new elements
- Click elements to manage/demolish
- Confirmation popups

**Type:** Strategy/Management
**Controls:** Click only
**Stages:** 1 (persistent field)
**Key Feature:** Build and manage element layout

---

### 4. tower-defense/ - **Tower Defense**
Classic tower defense gameplay:
- Click to place towers
- Monsters follow predefined paths
- Auto-targeting tower system
- Wave-based progression
- Win/lose conditions (20 killed / 3 escaped)

**Type:** Tower Defense
**Controls:** Click to place towers
**Stages:** 3 (different paths)
**Key Feature:** Strategic tower placement

---

### 5. physics-adventure/ - **Momentum Platformer**
Physics-based 2D platformer:
- Arcade physics with gravity
- Hills, valleys, holes, platforms
- Charge mechanic (speed boost)
- Momentum affects jumps
- Terrain navigation

**Type:** Physics platformer
**Controls:** Move + Charge (Shift) + Jump
**Stages:** 3 (terrain challenges)
**Key Feature:** Momentum-based movement

---

## 🚀 Quick Start

Each game can be run independently:

```bash
# Navigate to any variant
cd game-poc/          # or side-scroller, admin-game, etc.

# Option 1: Direct browser
open index.html

# Option 2: Local server
npm start
```

## 📁 Project Structure

```
paper-ball/
├── game-poc/             ← Original (top-down, physics dolls)
├── side-scroller/        ← Platformer (scrolling, collectables)
├── admin-game/           ← Management (click placement)
├── tower-defense/        ← TD (monsters, towers)
├── physics-adventure/    ← Platformer (momentum, terrain)
└── GAME-VARIANTS.md      ← This file
```

Each folder is self-contained with:
- `index.html` - Main entry point
- `js/` - Game logic (config, preload, create, update)
- `assets/` - PNG spritesheets and images
- `lib/phaser.min.js` - Phaser 3 engine
- `README.md` - Variant-specific docs

## 🎯 Comparison Matrix

| Feature | game-poc | side-scroller | admin-game | tower-defense | physics-adventure |
|---------|----------|---------------|------------|---------------|-------------------|
| **Character** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Movement** | Top-down | Side-scroll | None | None | Side-scroll |
| **Physics** | Matter.js | Matter.js | None | None | Arcade |
| **Scrolling** | ❌ | ✅ | ❌ | ❌ | ✅ |
| **Collectables** | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Enemies** | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Placement** | ❌ | ❌ | ✅ | ✅ | ❌ |
| **Stages** | 3 | 3 | 1 | 3 | 3 |
| **Gravity** | No | No | N/A | N/A | Yes |

## 🛠️ Customization

All variants share the same PNG asset system:

```bash
# Regenerate sprites for any variant
cd <variant-folder>
npm run generate-sprites
```

Edit `scripts/generate-sprites.js` to customize appearance, or replace PNG files directly.

## 📚 Documentation

Each variant has its own README with:
- Game-specific features
- Controls and gameplay
- Running instructions
- Key differences from base POC

## 🎨 Asset Sharing

All variants use the same base assets:
- Character spritesheets
- UI buttons
- Background images
- Particle effects

Customize per-variant by editing the PNG files in each `assets/` folder.

## 💡 Use Cases

- **game-poc:** Learn Phaser basics, multi-stage systems
- **side-scroller:** Platform game prototypes
- **admin-game:** City-builders, RTS, management sims
- **tower-defense:** TD games, strategic placement
- **physics-adventure:** Momentum platformers, physics puzzles

---

**All variants built with Phaser 3.70.0** | **No CDN dependencies** | **Production-ready PNG assets**
