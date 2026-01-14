#!/bin/bash
# Rebuild game-all.js with boot scene + config + preload + create + update

# Extract boot scene from current game-all.js
head -60 game-all.js > temp-boot.js

# Create new game-all.js
cat temp-boot.js > game-all-new.js
echo "" >> game-all-new.js

# Add config (simplified for admin game)
cat >> game-all-new.js << 'CONFIGEOF'
// Admin Game Configuration - No physics, no character
const gameConfigAdmin = {
    type: Phaser.AUTO,
    parent: 'phaser-game',
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    physics: {
        default: undefined
    },
    scene: [BootScene, GameScene]
};

CONFIGEOF

# Add game functions
cat preload.js >> game-all-new.js
echo "" >> game-all-new.js
cat create.js >> game-all-new.js
echo "" >> game-all-new.js
cat update.js >> game-all-new.js
echo "" >> game-all-new.js

# Add game initialization
cat >> game-all-new.js << 'GAMEEOF'

// Initialize game
const game = new Phaser.Game(gameConfigAdmin);
console.log('Admin Game initialized');
GAMEEOF

# Replace old file
mv game-all-new.js game-all.js
rm temp-boot.js
echo "Admin game-all.js rebuilt successfully"
