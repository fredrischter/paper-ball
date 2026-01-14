#!/bin/bash
# Rebuild game-all.js for a variant with boot scene

VARIANT=$1

if [ -z "$VARIANT" ]; then
    echo "Usage: $0 <variant-folder>"
    exit 1
fi

cd "$VARIANT/js" || exit 1

# Create boot scene (same for all)
cat > temp-boot.js << 'BOOTEOF'
// Boot Scene - Shows loading screen while assets load
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.add.rectangle(width / 2, height / 2, width, height, 0x2d5016);
        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            font: '32px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);

        const progressBarBg = this.add.rectangle(width / 2, height / 2 + 20, 400, 30, 0x555555);
        const progressBar = this.add.rectangle(width / 2 - 200, height / 2 + 20, 0, 26, 0xffffff);
        progressBar.setOrigin(0, 0.5);

        const progressText = this.add.text(width / 2, height / 2 + 60, '0%', {
            font: '20px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.load.on('progress', (value) => {
            progressBar.width = 400 * value;
            progressText.setText(Math.floor(value * 100) + '%');
        });

        this.load.on('complete', () => {
            loadingText.setText('Ready!');
            setTimeout(() => {
                this.scene.start('GameScene');
            }, 500);
        });

        preload.call(this);
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        create.call(this);
    }

    update() {
        update.call(this);
    }
}

BOOTEOF

# Create new game-all.js
cat temp-boot.js > game-all-new.js
echo "" >> game-all-new.js

# Add config if exists, otherwise use default
if [ -f config.js ]; then
    cat config.js >> game-all-new.js
    echo "" >> game-all-new.js
fi

# Add game functions
if [ -f preload.js ]; then
    cat preload.js >> game-all-new.js
    echo "" >> game-all-new.js
fi

if [ -f create.js ]; then
    cat create.js >> game-all-new.js
    echo "" >> game-all-new.js
fi

if [ -f update.js ]; then
    cat update.js >> game-all-new.js
    echo "" >> game-all-new.js
fi

# Add game initialization if there's a custom config name pattern
# Otherwise use standard gameConfig variable name
if grep -q "gameConfig" config.js 2>/dev/null; then
    CONFIG_VAR=$(grep -o "const [a-zA-Z]*Config" config.js | head -1 | awk '{print $2}')
    cat >> game-all-new.js << GAMEEOF

// Initialize game
const game = new Phaser.Game(${CONFIG_VAR:-gameConfig});
console.log('$VARIANT game initialized');
GAMEEOF
else
    cat >> game-all-new.js << 'GAMEEOF'

// Initialize game  
const game = new Phaser.Game(gameConfig);
GAMEEOF
fi

# Replace old file
mv game-all-new.js game-all.js
rm temp-boot.js
echo "$VARIANT game-all.js rebuilt successfully"
