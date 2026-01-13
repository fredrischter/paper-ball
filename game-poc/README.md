# Game Structure POC

A proof of concept for an HTML5 game built with **Phaser 3**, featuring an animated sprite character, multi-stage gameplay, physics-based interactions, and demonstrating all the core requirements for a responsive, cross-platform game.

## 🎮 Features Implemented

### ✅ Pre-Generated PNG Assets
- **All sprites are PNG files** - No runtime procedural generation
- **Spritesheets for animations** - Character, UI buttons, popup buttons
- **Background images** - Stage backgrounds, popup, interstitial
- **Easy to customize** - Edit PNG files directly or regenerate with script
- **Performance optimized** - Faster loading, no canvas overhead

### ✅ Responsive Design
- **Playable on any screen size** - Uses Phaser 3's scaling system
- **UI elements positioned strategically:**
  - 🔝 **Top-left:** Menu button (hamburger icon)
  - 🔝 **Top-right:** Sound toggle button (speaker icon)
  - 🔝 **Middle-top:** Game title/status
  - 🔽 **Middle-bottom:** Control instructions
  - 🔽 **Bottom-left:** D-pad controls (mobile only)
  - 🔽 **Bottom-right:** Action button (mobile only)

### ✅ Animated Sprite Character
- **Complete animation set (65 frames total):**
  - 1 frame for standing position
  - 8 frames for walking down
  - 8 frames for walking left
  - 8 frames for walking right
  - 8 frames for walking up
  - 8 frames for jumping down
  - 8 frames for jumping left
  - 8 frames for jumping right
  - 8 frames for jumping up
- **All animations from PNG spritesheet** (`assets/spritesheets/character.png`)
- **Smooth transitions between directions**

### ✅ Control Systems
- **Keyboard controls:**
  - Arrow keys for directional movement
  - WASD as alternative movement keys
  - Space bar for jump action (disabled in top-down mode)
- **Mobile touch controls:**
  - On-screen D-pad for 4-directional movement
  - Action button for actions
  - Touch controls only visible on mobile devices

### ✅ Audio System
- Background sound implementation using Web Audio API
- Toggle button in top-right corner to enable/disable sound
- Visual feedback (button transparency) for sound state

### ✅ UI from Spritesheet
- All UI buttons loaded from PNG spritesheet (`assets/spritesheets/ui-buttons.png`)
- Menu button with hamburger icon
- Sound button with speaker icon
- D-pad arrows (up, down, left, right)
- Consistent visual style

## 🚀 How to Run

### Option 1: Direct Browser Access
Simply open `index.html` in any modern web browser.

**Phaser 3 is included locally** - No internet connection required!

### Option 2: Local Server (Recommended for development)
For testing advanced features or avoiding CORS issues:

```bash
# Using Python 3
python -m http.server 8080

# Using Node.js
npx http-server . -p 8080

# Using PHP
php -S localhost:8080

# Using npm (if you've run npm install)
npm start
```

Then navigate to `http://localhost:8080`

### Option 3: Live Server (VS Code)
If using Visual Studio Code:
1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 🎯 Technical Implementation

### Game Engine
- **Phaser 3** (v3.70.0) - Included locally in `lib/phaser.min.js`
- Industry-standard HTML5 game framework
- Built-in physics engine, animation system, and input handling
- Excellent cross-platform support (desktop and mobile)
- No internet connection required to run

### Architecture
```
game-poc/
├── index.html                 # Main HTML file
├── requirements.txt           # Detailed requirements document
├── README.md                  # This file
├── package.json              # NPM package configuration
├── lib/
│   └── phaser.min.js         # Phaser 3 library (local)
├── js/
│   ├── config.js             # Game configuration and state
│   ├── preload.js            # Asset loading and sprite generation
│   ├── create.js             # Game initialization and setup
│   ├── update.js             # Game loop and input handling
│   ├── game.js               # Main game initialization
│   └── game-all.js           # Combined game scripts
└── assets/
    ├── spritesheets/         # (Placeholder for sprite assets)
    └── audio/                # (Placeholder for audio assets)
```

### Code Structure

The game is modular and organized into separate files:
- **config.js** - Game configuration, constants, and global state variables
- **preload.js** - Asset loading and procedural sprite generation using Canvas API
- **create.js** - Scene setup, UI element creation, animation definitions, and event handlers
- **update.js** - Game loop that processes input and updates player state each frame
- **game.js** - Initializes the Phaser game instance with the configuration

For ease of deployment, these files are also combined into `game-all.js`.

## 📱 Mobile Support

The game automatically detects mobile devices and:
- Shows on-screen D-pad for movement
- Displays action button for jumping
- Adjusts text size for readability
- Prevents page scrolling during gameplay

## 🎨 Sprite System

### PNG-Based Assets
All sprites are **pre-generated PNG files** stored in `assets/` directory:

```
assets/
├── spritesheets/          # Multi-frame spritesheets
│   ├── character.png      # 65-frame character (2080x48px)
│   ├── ui-buttons.png     # 7-frame UI buttons (448x64px)
│   └── popup-buttons.png  # 2-frame popup buttons (180x50px)
└── images/                # Single images
    ├── stage1-bg.png      # Stage 1 background (800x600px)
    ├── stage2-bg.png      # Stage 2 background (800x600px)
    ├── stage3-bg.png      # Stage 3 background (800x600px)
    ├── popup-bg.png       # Popup background (500x300px)
    ├── square-doll.png    # Square doll sprite (50x50px)
    └── interstitial.png   # Interstitial screen (800x600px)
```

### Generating Sprites

To regenerate all PNG assets:

```bash
npm run generate-sprites
```

This runs `scripts/generate-sprites.js` which creates all spritesheets and images.

### Customizing Sprites

**Option 1:** Edit the generation script
```bash
# Edit scripts/generate-sprites.js to change colors, sizes, etc.
npm run generate-sprites
```

**Option 2:** Edit PNG files directly
- Use any image editor (GIMP, Photoshop, Aseprite, etc.)
- Maintain frame sizes for spritesheets

**Option 3:** Replace with your own art
- Create PNG files with matching dimensions
- Update file paths in `js/preload.js` if needed

See `SPRITES.md` for detailed sprite documentation.

### Spritesheet Layout

**Character Spritesheet** (`character.png` - 32x48px per frame):
- Frame 0: Standing
- Frames 1-8: Walking down
- Frames 9-16: Walking left
- Frames 17-24: Walking right
- Frames 25-32: Walking up
- Frames 33-40: Jumping down
- Frames 41-48: Jumping left
- Frames 49-56: Jumping right
- Frames 57-64: Jumping up

**UI Buttons Spritesheet** (`ui-buttons.png` - 64x64px per frame):
- Frame 0: Menu button (hamburger)
- Frame 1: Sound button (speaker)
- Frame 2: D-pad up
- Frame 3: D-pad down
- Frame 4: D-pad left
- Frame 5: D-pad right

## 🔊 Audio System

### Current Implementation (POC)
Uses Web Audio API to generate simple tones as background music for demonstration.

### Production Implementation
Replace with actual audio files:

```javascript
// In preload():
this.load.audio('bgmusic', 'assets/audio/background.mp3');

// In create():
backgroundMusic = this.sound.add('bgmusic', { loop: true, volume: 0.5 });
if (soundEnabled) {
    backgroundMusic.play();
}
```

## 🎮 Controls Reference

### Desktop/Keyboard
- **↑ / W** - Move up (affects direction for jumping)
- **↓ / S** - Move down (affects direction for jumping)
- **← / A** - Move left
- **→ / D** - Move right
- **Space** - Jump

### Mobile/Touch
- **D-pad** - Four-directional movement
- **Action Button** - Jump

### UI
- **Menu Button** (top-left) - Opens menu with controls info
- **Sound Button** (top-right) - Toggle background music

## 🛠️ Customization

### Changing Player Speed
Edit in `update.js`:
```javascript
player.setVelocityX(-160);  // Change 160 to desired speed
```

### Changing Jump Height
Edit in `update.js` and `create.js`:
```javascript
player.setVelocityY(-400);  // Change 400 to desired jump force
```

### Changing Animation Speed
Edit in `create.js` (createAnimations function):
```javascript
frameRate: 10,  // Change to adjust animation speed
```

## 📋 Requirements Met

All requirements from `requirements.txt` have been implemented:
- ✅ Responsive design for all screen sizes
- ✅ UI elements in all specified positions
- ✅ Animated sprite with all required animation frames
- ✅ Keyboard directional controls
- ✅ On-screen D-pad for mobile
- ✅ Action button (jump)
- ✅ Background sound with toggle
- ✅ Menu button
- ✅ All UI from spritesheet
- ✅ Cross-platform compatibility

## 🚧 Next Steps for Production

1. **Replace procedural sprites with actual artwork**
   - Create professional character spritesheet
   - Design polished UI elements
   - Add visual effects and particles

2. **Add real audio**
   - Background music track
   - Sound effects (jump, land, UI clicks)
   - Audio sprite for efficiency

3. **Expand gameplay**
   - Add enemies, obstacles, collectibles
   - Implement levels or areas
   - Add scoring and progression

4. **Polish**
   - Particle effects
   - Screen transitions
   - Loading screen
   - Settings menu

5. **Optimization**
   - Asset compression
   - Texture atlases
   - Performance monitoring

## 📄 License

MIT License - Free to use and modify

## 🤝 Contributing

This is a proof of concept. For production use, consider:
- Professional sprite artwork
- Sound design
- Game design documentation
- Accessibility features
- Internationalization
