# RPG POC

A dialog-driven RPG adventure built with **Phaser 3**, featuring character customization, explorable world with house interiors, and NPC interactions.

## 🎮 Game Features

### ✅ Story & Dialog System
- **Bottom dialog box** - Visual novel style text display
- **Changing images** - Background scenes change during dialog
- **Long text support** - Multi-page dialog with continue prompt
- **Character portraits** - Show who's speaking

### ✅ Character Customization
- **Character selection screen** - Choose your protagonist
- **Clothing/style selection** - Customize appearance
- **Multiple options** - Different character sprites and outfits
- **Preview system** - See character before confirming

### ✅ Side-Scrolling World
- **Wide 2D world** - Horizontal scrolling (4000px+)
- **Multiple houses** - Buildings you can enter
- **Interior transitions** - Seamless scene switching
- **Exit system** - Return to outdoor world

### ✅ House Interiors
- **Interior view** - Different scene when inside
- **NPCs inside** - Characters to interact with
- **Furniture/objects** - Decorated interiors
- **Exit doors** - Return to outside

### ✅ NPC Interactions
- **Contact triggers** - Walk up to NPC to talk
- **Dialog sequences** - Multi-line conversations
- **Image changes** - Scenes/expressions during dialog
- **Quest hooks** - Story progression

## 🎯 How to Play

**Intro Sequence:**
1. Opening dialog with story introduction
2. Character selection screen
3. Clothing/style customization
4. Enter the game world

**Gameplay:**
- **Move:** Arrow keys or WASD
- **Enter house:** Walk to door and press UP/W
- **Talk to NPC:** Walk near them, dialog triggers
- **Continue dialog:** Press Space or click
- **Exit house:** Walk to door and press DOWN/S

## 🎮 Game Flow

```
Opening Dialog → Character Select → Clothing Select
     ↓
Side-Scrolling World → Enter House → Interior View
     ↓
Walk to NPC → Dialog Trigger → Story Scenes
     ↓
Exit House → Continue Exploring
```

## 🏠 World Structure

**Outdoor:** Wide side-scrolling map with multiple houses
**House 1:** Interior with NPC #1
**House 2:** Interior with NPC #2  
**House 3:** Interior with NPC #3

## 🚀 Running

```bash
open index.html  # or npm start
```

## 📁 Structure

```
rpg/
├── index.html
├── js/
│   ├── config.js          # RPG config
│   ├── preload.js         # Assets + dialog data
│   ├── create.js          # World, houses, NPCs
│   └── update.js          # Dialog, interactions
├── assets/
│   ├── spritesheets/
│   │   ├── character.png  # Player variations
│   │   └── npc.png        # NPC sprites
│   └── images/
│       ├── dialog-bg.png  # Dialog box
│       ├── scene-*.png    # Story images
│       ├── house-ext.png  # House exterior
│       └── house-int.png  # House interior
└── lib/phaser.min.js
```

## 🎨 Key Features

- **Dialog system** - Bottom text box with image display
- **Character creator** - Select character + clothing
- **Enter/exit houses** - Seamless transitions
- **NPC dialog** - Trigger conversations on contact
- **Story scenes** - Images change during dialog
- **Side-scrolling** - Wide explorable world

Based on side-scroller POC with RPG mechanics and dialog system.
