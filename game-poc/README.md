# Game Structure POC

A proof of concept for an HTML5 game with animated sprite character, demonstrating all the core requirements for a responsive, cross-platform game.

## 🎮 Features Implemented

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
- **Complete animation set:**
  - 1 frame for standing position
  - 8 frames for walking down
  - 8 frames for walking left
  - 8 frames for walking right
  - 8 frames for walking up
  - 8 frames for jumping down
  - 8 frames for jumping left
  - 8 frames for jumping right
  - 8 frames for jumping up
- **All animations mapped from a single spritesheet**
- **Smooth transitions between directions**

### ✅ Control Systems
- **Keyboard controls:**
  - Arrow keys for directional movement
  - WASD as alternative movement keys
  - Space bar for jump action
- **Mobile touch controls:**
  - On-screen D-pad for 4-directional movement
  - Action button for jumping
  - Touch controls only visible on mobile devices

### ✅ Audio System
- Background sound implementation using Web Audio API
- Toggle button in top-right corner to enable/disable sound
- Visual feedback (button transparency) for sound state

### ✅ UI from Spritesheet
- All UI buttons generated from a spritesheet
- Menu button with hamburger icon
- Sound button with speaker icon
- D-pad arrows (up, down, left, right)
- Consistent visual style

## 🚀 How to Run

### Option 1: Direct Browser Access (Recommended)
Simply open `index.html` in any modern web browser.

**No external dependencies required!** The default version (`index.html`) uses pure JavaScript/Canvas with procedurally generated sprites.

### Option 2: Phaser 3 Version
Open `index-phaser.html` for the Phaser 3 game engine version (requires internet connection to load Phaser from CDN).

### Option 3: Local Server
For testing advanced features or avoiding CORS issues:

```bash
# Using Python 3
python -m http.server 8080

# Using Node.js
npx http-server . -p 8080

# Using PHP
php -S localhost:8080
```

Then navigate to `http://localhost:8080`

### Option 4: Live Server (VS Code)
If using Visual Studio Code:
1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 🎯 Technical Implementation

### Game Engine Options

This POC includes two implementations:

#### 1. Pure JavaScript/Canvas Version (Default - `index.html`)
- **No external dependencies** - works offline
- Procedurally generated sprites using Canvas API
- Custom animation system
- Web Audio API for sound
- ~15KB of JavaScript code
- Works in any modern browser without internet

#### 2. Phaser 3 Version (`index-phaser.html`)
- **Phaser 3** (v3.70.0) - Loaded via CDN
- Industry-standard HTML5 game framework
- Built-in physics, animations, and input handling
- Excellent mobile support
- Requires internet connection to load Phaser library

### Architecture
```
game-poc/
├── index.html                 # Pure JS/Canvas version (main)
├── index-phaser.html          # Phaser 3 version
├── requirements.txt           # Detailed requirements document
├── README.md                  # This file
├── js/
│   ├── game-standalone.js     # Pure JS game implementation
│   ├── game-all.js           # Combined Phaser scripts
│   ├── config.js             # Phaser: Game configuration
│   ├── preload.js            # Phaser: Asset loading
│   ├── create.js             # Phaser: Game initialization
│   ├── update.js             # Phaser: Game loop
│   └── game.js               # Phaser: Main initialization
└── assets/
    ├── spritesheets/         # (Placeholder for sprite assets)
    └── audio/                # (Placeholder for audio assets)
```

### Code Structure

#### Pure JavaScript Version
The standalone game uses a class-based architecture:
- **Player class** - Character with animation state machine
- **Animation class** - Frame-based animation system
- **Procedural sprite generation** - Creates sprites at runtime
- **Game loop** - requestAnimationFrame-based rendering
- **Input system** - Keyboard and touch event handling

## 📱 Mobile Support

The game automatically detects mobile devices and:
- Shows on-screen D-pad for movement
- Displays action button for jumping
- Adjusts text size for readability
- Prevents page scrolling during gameplay

## 🎨 Sprite System

### Current Implementation (POC)
The POC generates spritesheets programmatically using HTML5 Canvas for demonstration purposes. This allows the game to run without external asset files.

### Production Implementation
For a production game, replace the procedural generation in `preload.js` with actual sprite loading:

```javascript
// Replace createPlayerSpritesheet() with:
this.load.spritesheet('player', 'assets/spritesheets/player.png', {
    frameWidth: 32,
    frameHeight: 48
});

// Replace createUISprites() with:
this.load.spritesheet('ui-buttons', 'assets/spritesheets/ui.png', {
    frameWidth: 64,
    frameHeight: 64
});
```

### Spritesheet Layout
**Player Spritesheet** (32x48 pixels per frame):
- Frame 0: Standing
- Frames 1-8: Walking down
- Frames 9-16: Walking left
- Frames 17-24: Walking right
- Frames 25-32: Walking up
- Frames 33-40: Jumping down
- Frames 41-48: Jumping left
- Frames 49-56: Jumping right
- Frames 57-64: Jumping up

**UI Spritesheet** (64x64 pixels per frame):
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
