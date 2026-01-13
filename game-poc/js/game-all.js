// Game configuration
const gameConfig = {
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
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Game state variables
let player;
let cursors;
let jumpButton;
let wasdKeys; // WASD keys
let platforms;
let isMobile;

// UI buttons
let menuButton;
let soundButton;
let dPad;
let actionButton;

// Sound
let backgroundMusic;
let soundEnabled = true;

// Movement state
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

// Animation state
let currentDirection = 'down'; // down, up, left, right
let isJumping = false;

// Stage management
let currentStage = 1; // 1, 2, or 3
let stageBackgrounds = {}; // Will hold background images

// Popup state
let popupOverlay = null;
let popupActive = false;
function preload() {
    // Detect if mobile
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Create simple spritesheets procedurally since we don't have actual assets
    createPlayerSpritesheet(this);
    createUISprites(this);
    createStageBackgrounds(this);
    createPopupSprites(this);
    createInterstitialImage(this);
    
    // Note: In a real implementation, you would load actual sprite files:
    // this.load.spritesheet('player', 'assets/spritesheets/player.png', {
    //     frameWidth: 32,
    //     frameHeight: 48
    // });
    
    // Create a simple background music using Web Audio API
    // In production, you'd load: this.load.audio('bgmusic', 'assets/audio/background.mp3');
}

function createPlayerSpritesheet(scene) {
    // Create a canvas to draw the spritesheet
    const canvas = document.createElement('canvas');
    const frameWidth = 32;
    const frameHeight = 48;
    const framesPerAnimation = 8;
    
    // Total frames: 1 standing + 4 directions * 8 walking + 4 directions * 8 jumping = 65 frames
    // Layout: 13 columns x 5 rows
    canvas.width = frameWidth * 13;
    canvas.height = frameHeight * 5;
    
    const ctx = canvas.getContext('2d');
    
    // Helper function to draw a simple character
    function drawCharacter(x, y, color, legOffset = 0) {
        // Head
        ctx.fillStyle = '#FFD1A3';
        ctx.fillRect(x + 10, y + 5, 12, 12);
        
        // Body
        ctx.fillStyle = color;
        ctx.fillRect(x + 8, y + 17, 16, 18);
        
        // Arms
        ctx.fillStyle = '#FFD1A3';
        ctx.fillRect(x + 4, y + 20, 6, 12);
        ctx.fillRect(x + 22, y + 20, 6, 12);
        
        // Legs
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(x + 10 + legOffset, y + 35, 5, 13);
        ctx.fillRect(x + 17 - legOffset, y + 35, 5, 13);
    }
    
    let frameIndex = 0;
    
    // Standing frame (1 frame)
    drawCharacter(frameIndex * frameWidth, 0, '#4169E1', 0);
    frameIndex++;
    
    // Walking animations (8 frames per direction)
    // Walking frames
    for (let dir = 0; dir < 4; dir++) {
        for (let i = 0; i < framesPerAnimation; i++) {
            const x = (1 + dir * framesPerAnimation + i) * frameWidth;
            const y = 0;
            const legOffset = Math.sin(i / framesPerAnimation * Math.PI * 2) * 2;
            drawCharacter(x, y, '#4169E1', legOffset);
        }
    }
    
    // Jumping frames (8 frames per direction)
    for (let dir = 0; dir < 4; dir++) {
        for (let i = 0; i < framesPerAnimation; i++) {
            const x = (1 + dir * framesPerAnimation + i) * frameWidth;
            const y = frameHeight;
            const jumpHeight = Math.sin(i / framesPerAnimation * Math.PI) * 10;
            drawCharacter(x, y - jumpHeight, '#4169E1', 0);
        }
    }
    
    // Add the spritesheet to Phaser
    scene.textures.addSpriteSheet('player', canvas, {
        frameWidth: frameWidth,
        frameHeight: frameHeight
    });
}

function createUISprites(scene) {
    // Create UI buttons spritesheet
    const canvas = document.createElement('canvas');
    const buttonSize = 64;
    canvas.width = buttonSize * 6; // 6 different buttons
    canvas.height = buttonSize;
    
    const ctx = canvas.getContext('2d');
    
    // Menu button (hamburger icon)
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, buttonSize, buttonSize);
    ctx.fillStyle = '#FFF';
    ctx.fillRect(10, 15, 44, 6);
    ctx.fillRect(10, 29, 44, 6);
    ctx.fillRect(10, 43, 44, 6);
    
    // Sound button (speaker icon)
    ctx.fillStyle = '#333';
    ctx.fillRect(buttonSize, 0, buttonSize, buttonSize);
    ctx.fillStyle = '#FFF';
    ctx.fillRect(buttonSize + 15, 24, 10, 16);
    ctx.beginPath();
    ctx.moveTo(buttonSize + 25, 24);
    ctx.lineTo(buttonSize + 40, 14);
    ctx.lineTo(buttonSize + 40, 50);
    ctx.lineTo(buttonSize + 25, 40);
    ctx.fill();
    
    // D-pad arrows
    const dpadX = buttonSize * 2;
    ctx.fillStyle = '#444';
    ctx.fillRect(dpadX, 0, buttonSize, buttonSize);
    // Up arrow
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.moveTo(dpadX + 32, 15);
    ctx.lineTo(dpadX + 42, 25);
    ctx.lineTo(dpadX + 22, 25);
    ctx.fill();
    
    // Down arrow
    const dpadX2 = buttonSize * 3;
    ctx.fillStyle = '#444';
    ctx.fillRect(dpadX2, 0, buttonSize, buttonSize);
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.moveTo(dpadX2 + 32, 49);
    ctx.lineTo(dpadX2 + 22, 39);
    ctx.lineTo(dpadX2 + 42, 39);
    ctx.fill();
    
    // Left arrow
    const dpadX3 = buttonSize * 4;
    ctx.fillStyle = '#444';
    ctx.fillRect(dpadX3, 0, buttonSize, buttonSize);
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.moveTo(dpadX3 + 15, 32);
    ctx.lineTo(dpadX3 + 25, 22);
    ctx.lineTo(dpadX3 + 25, 42);
    ctx.fill();
    
    // Right arrow
    const dpadX4 = buttonSize * 5;
    ctx.fillStyle = '#444';
    ctx.fillRect(dpadX4, 0, buttonSize, buttonSize);
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.moveTo(dpadX4 + 49, 32);
    ctx.lineTo(dpadX4 + 39, 22);
    ctx.lineTo(dpadX4 + 39, 42);
    ctx.fill();
    
    // Add the UI spritesheet to Phaser
    scene.textures.addSpriteSheet('ui-buttons', canvas, {
        frameWidth: buttonSize,
        frameHeight: buttonSize
    });
}

function createStageBackgrounds(scene) {
    // Create background images for each stage
    const backgrounds = [
        { key: 'bg-stage1', color1: '#2d5a3d', color2: '#1a3d2d' },
        { key: 'bg-stage2', color1: '#5a3d2d', color2: '#3d2d1a' },
        { key: 'bg-stage3', color1: '#3d2d5a', color2: '#2d1a3d' }
    ];
    
    backgrounds.forEach(bg => {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, 600);
        gradient.addColorStop(0, bg.color1);
        gradient.addColorStop(1, bg.color2);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);
        
        // Add some decorative elements
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 800;
            const y = Math.random() * 500;
            const size = Math.random() * 30 + 10;
            ctx.fillRect(x, y, size, size);
        }
        
        scene.textures.addCanvas(bg.key, canvas);
    });
}

function createPopupSprites(scene) {
    // Create popup background
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    // Background with border
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, 500, 300);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 496, 296);
    
    // Inner decoration
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(10, 10, 480, 280);
    
    scene.textures.addCanvas('popup-bg', canvas);
    
    // Create button sprites (OK and Cancel)
    const buttonCanvas = document.createElement('canvas');
    buttonCanvas.width = 200;
    buttonCanvas.height = 50;
    const btnCtx = buttonCanvas.getContext('2d');
    
    // OK button (green)
    btnCtx.fillStyle = '#4CAF50';
    btnCtx.fillRect(0, 0, 90, 50);
    btnCtx.strokeStyle = '#fff';
    btnCtx.lineWidth = 2;
    btnCtx.strokeRect(1, 1, 88, 48);
    
    // Cancel button (red)
    btnCtx.fillStyle = '#f44336';
    btnCtx.fillRect(110, 0, 90, 50);
    btnCtx.strokeStyle = '#fff';
    btnCtx.lineWidth = 2;
    btnCtx.strokeRect(111, 1, 88, 48);
    
    scene.textures.addSpriteSheet('popup-buttons', buttonCanvas, {
        frameWidth: 90,
        frameHeight: 50
    });
}

function createInterstitialImage(scene) {
    // Create full-screen interstitial image
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    // Create a radial gradient
    const gradient = ctx.createRadialGradient(400, 300, 50, 400, 300, 400);
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(0.5, '#FFA500');
    gradient.addColorStop(1, '#FF6347');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);
    
    // Add "Loading..." or transition text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Stage Transition', 400, 280);
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Loading...', 400, 340);
    
    scene.textures.addCanvas('interstitial', canvas);
}
function create() {
    // Add stage background
    stageBackgrounds.bg1 = this.add.image(400, 300, 'bg-stage1').setDepth(-1);
    stageBackgrounds.bg2 = this.add.image(400, 300, 'bg-stage2').setDepth(-1).setVisible(false);
    stageBackgrounds.bg3 = this.add.image(400, 300, 'bg-stage3').setDepth(-1).setVisible(false);
    
    // Create platforms (simple ground)
    platforms = this.physics.add.staticGroup();
    const ground = platforms.create(400, 580, null);
    ground.setSize(800, 40);
    ground.setDisplaySize(800, 40);
    ground.refreshBody();
    
    // Draw the ground
    const graphics = this.add.graphics();
    graphics.fillStyle(0x654321, 1);
    graphics.fillRect(0, 560, 800, 40);
    
    // Create player sprite
    player = this.physics.add.sprite(400, 450, 'player', 0);
    player.setBounce(0.1);
    player.setCollideWorldBounds(false); // Changed to false to detect edge exits
    
    // Create animations
    createAnimations(this);
    
    // Set up keyboard input
    cursors = this.input.keyboard.createCursorKeys();
    jumpButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    // WASD keys as alternative
    wasdKeys = {
        W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };
    
    // Collisions
    this.physics.add.collider(player, platforms);
    
    // Create UI elements
    createUI(this);
    
    // Initialize sound (Web Audio API)
    initSound(this);
}

function createAnimations(scene) {
    // Standing animation
    scene.anims.create({
        key: 'stand',
        frames: [{ key: 'player', frame: 0 }],
        frameRate: 10
    });
    
    // Walking animations (8 frames each)
    const directions = ['down', 'left', 'right', 'up'];
    
    directions.forEach((dir, index) => {
        scene.anims.create({
            key: `walk-${dir}`,
            frames: scene.anims.generateFrameNumbers('player', { 
                start: 1 + index * 8, 
                end: 1 + index * 8 + 7 
            }),
            frameRate: 10,
            repeat: -1
        });
    });
    
    // Jumping animations (8 frames each)
    directions.forEach((dir, index) => {
        scene.anims.create({
            key: `jump-${dir}`,
            frames: scene.anims.generateFrameNumbers('player', { 
                start: 33 + index * 8, 
                end: 33 + index * 8 + 7 
            }),
            frameRate: 10,
            repeat: 0
        });
    });
}

function createUI(scene) {
    // Top-left: Menu button
    menuButton = scene.add.sprite(40, 40, 'ui-buttons', 0)
        .setInteractive()
        .setScrollFactor(0)
        .setScale(0.8);
    
    menuButton.on('pointerdown', () => {
        console.log('Menu clicked');
        alert('Menu\n\nControls:\n- Arrow keys or WASD to move\n- Space to jump\n- Click sound button to toggle music');
    });
    
    // Top-right: Sound button
    soundButton = scene.add.sprite(760, 40, 'ui-buttons', 1)
        .setInteractive()
        .setScrollFactor(0)
        .setScale(0.8);
    
    soundButton.on('pointerdown', () => {
        toggleSound();
        updateSoundButton();
    });
    
    // Middle-top: Score/title text
    const titleText = scene.add.text(400, 30, 'Game POC - Character Demo', {
        fontSize: '24px',
        fill: '#fff',
        stroke: '#000',
        strokeThickness: 4
    }).setOrigin(0.5, 0).setScrollFactor(0);
    
    // Middle-bottom: Instructions text
    const instructionsText = scene.add.text(400, 560, 
        isMobile ? 'Use D-pad to move, Action to jump' : 'Arrow keys or WASD to move, Space to jump', 
        {
            fontSize: '16px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5, 0).setScrollFactor(0);
    
    // Mobile controls
    if (isMobile) {
        createMobileControls(scene);
    }
}

function createMobileControls(scene) {
    // D-pad (bottom-left area)
    const dpadX = 100;
    const dpadY = 500;
    const buttonSpacing = 70;
    
    // Up button
    const upButton = scene.add.sprite(dpadX, dpadY - buttonSpacing, 'ui-buttons', 2)
        .setInteractive()
        .setScrollFactor(0)
        .setAlpha(0.7);
    
    upButton.on('pointerdown', () => { moveUp = true; });
    upButton.on('pointerup', () => { moveUp = false; });
    upButton.on('pointerout', () => { moveUp = false; });
    
    // Down button
    const downButton = scene.add.sprite(dpadX, dpadY + buttonSpacing, 'ui-buttons', 3)
        .setInteractive()
        .setScrollFactor(0)
        .setAlpha(0.7);
    
    downButton.on('pointerdown', () => { moveDown = true; });
    downButton.on('pointerup', () => { moveDown = false; });
    downButton.on('pointerout', () => { moveDown = false; });
    
    // Left button
    const leftButton = scene.add.sprite(dpadX - buttonSpacing, dpadY, 'ui-buttons', 4)
        .setInteractive()
        .setScrollFactor(0)
        .setAlpha(0.7);
    
    leftButton.on('pointerdown', () => { moveLeft = true; });
    leftButton.on('pointerup', () => { moveLeft = false; });
    leftButton.on('pointerout', () => { moveLeft = false; });
    
    // Right button
    const rightButton = scene.add.sprite(dpadX + buttonSpacing, dpadY, 'ui-buttons', 5)
        .setInteractive()
        .setScrollFactor(0)
        .setAlpha(0.7);
    
    rightButton.on('pointerdown', () => { moveRight = true; });
    rightButton.on('pointerup', () => { moveRight = false; });
    rightButton.on('pointerout', () => { moveRight = false; });
    
    // Action button (bottom-right)
    actionButton = scene.add.circle(700, 500, 40, 0xFF6B6B)
        .setInteractive()
        .setScrollFactor(0)
        .setAlpha(0.7);
    
    const actionText = scene.add.text(700, 500, 'JUMP', {
        fontSize: '14px',
        fill: '#fff',
        fontStyle: 'bold'
    }).setOrigin(0.5).setScrollFactor(0);
    
    actionButton.on('pointerdown', () => {
        if (player.body.touching.down) {
            player.setVelocityY(-400);
            isJumping = true;
        }
    });
}

function initSound(scene) {
    // Create a simple background sound using Web Audio API
    // In production, you would use: backgroundMusic = scene.sound.add('bgmusic', { loop: true });
    
    // For this POC, we'll create a simple tone
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a simple melody loop
        window.gameSoundContext = audioContext;
        window.playBackgroundMusic = function() {
            if (!soundEnabled) return;
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 2);
            
            // Loop
            if (soundEnabled) {
                setTimeout(window.playBackgroundMusic, 2000);
            }
        };
        
        if (soundEnabled) {
            window.playBackgroundMusic();
        }
    } catch (e) {
        console.log('Web Audio API not supported');
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    if (soundEnabled && window.playBackgroundMusic) {
        window.playBackgroundMusic();
    }
}

function updateSoundButton() {
    // Visual feedback for sound state
    if (soundButton) {
        soundButton.setAlpha(soundEnabled ? 1.0 : 0.5);
    }
}

function showPopup(scene) {
    if (popupActive) return;
    
    popupActive = true;
    
    // Create semi-transparent overlay
    const overlay = scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.7).setDepth(1000);
    
    // Create popup background
    const popupBg = scene.add.image(400, 300, 'popup-bg').setDepth(1001);
    
    // Add text
    const titleText = scene.add.text(400, 200, 'Demonstration Pop-up', {
        fontSize: '32px',
        fill: '#fff',
        fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(1002);
    
    const messageText = scene.add.text(400, 260, 'You went off the left edge!', {
        fontSize: '20px',
        fill: '#ccc'
    }).setOrigin(0.5).setDepth(1002);
    
    // Create OK button
    const okButton = scene.add.sprite(300, 360, 'popup-buttons', 0)
        .setInteractive()
        .setDepth(1002)
        .setScale(1.5);
    
    const okText = scene.add.text(300, 360, 'OK', {
        fontSize: '20px',
        fill: '#fff',
        fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(1003);
    
    // Create Cancel button
    const cancelButton = scene.add.sprite(500, 360, 'popup-buttons', 1)
        .setInteractive()
        .setDepth(1002)
        .setScale(1.5);
    
    const cancelText = scene.add.text(500, 360, 'Cancel', {
        fontSize: '20px',
        fill: '#fff',
        fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(1003);
    
    // Store popup elements
    popupOverlay = {
        overlay,
        popupBg,
        titleText,
        messageText,
        okButton,
        okText,
        cancelButton,
        cancelText
    };
    
    // Close popup function
    const closePopup = () => {
        if (!popupActive) return;
        
        // Destroy all popup elements
        overlay.destroy();
        popupBg.destroy();
        titleText.destroy();
        messageText.destroy();
        okButton.destroy();
        okText.destroy();
        cancelButton.destroy();
        cancelText.destroy();
        
        popupOverlay = null;
        popupActive = false;
        
        // Reset game to beginning
        resetGame(scene);
    };
    
    // Button event handlers
    okButton.on('pointerdown', closePopup);
    okButton.on('pointerover', () => okButton.setTint(0xcccccc));
    okButton.on('pointerout', () => okButton.clearTint());
    
    cancelButton.on('pointerdown', closePopup);
    cancelButton.on('pointerover', () => cancelButton.setTint(0xcccccc));
    cancelButton.on('pointerout', () => cancelButton.clearTint());
}

function resetGame(scene) {
    // Reset to stage 1
    currentStage = 1;
    stageBackgrounds.bg1.setVisible(true);
    stageBackgrounds.bg2.setVisible(false);
    stageBackgrounds.bg3.setVisible(false);
    
    // Reset player position
    player.setPosition(100, 450);
    player.setVelocity(0, 0);
}

function switchToStage(scene, stageNumber) {
    currentStage = stageNumber;
    
    if (stageNumber === 2) {
        // Switch to stage 2
        stageBackgrounds.bg1.setVisible(false);
        stageBackgrounds.bg2.setVisible(true);
        stageBackgrounds.bg3.setVisible(false);
        
        // Position player at left side
        player.setPosition(50, 450);
        player.setVelocity(0, 0);
    } else if (stageNumber === 3) {
        // Show interstitial
        showInterstitial(scene);
    }
}

function showInterstitial(scene) {
    // Create full-screen interstitial
    const interstitial = scene.add.image(400, 300, 'interstitial').setDepth(2000);
    
    // After 3 seconds, remove interstitial and go back to stage 1
    scene.time.delayedCall(3000, () => {
        interstitial.destroy();
        resetGame(scene);
    });
}
function update() {
    if (!player || popupActive) return;
    
    // Check for edge exits
    if (player.x < -20) {
        // Player exited left - show popup
        showPopup(this);
        return;
    } else if (player.x > 820) {
        // Player exited right - switch stage
        if (currentStage === 1) {
            switchToStage(this, 2);
        } else if (currentStage === 2) {
            switchToStage(this, 3);
        }
        return;
    }
    
    // Get input from keyboard or mobile controls
    const leftPressed = cursors.left.isDown || wasdKeys.A.isDown || moveLeft;
    const rightPressed = cursors.right.isDown || wasdKeys.D.isDown || moveRight;
    const upPressed = cursors.up.isDown || wasdKeys.W.isDown || moveUp;
    const downPressed = cursors.down.isDown || wasdKeys.S.isDown || moveDown;
    const jumpPressed = Phaser.Input.Keyboard.JustDown(jumpButton);
    
    // Horizontal movement
    if (leftPressed) {
        player.setVelocityX(-160);
        currentDirection = 'left';
    } else if (rightPressed) {
        player.setVelocityX(160);
        currentDirection = 'right';
    } else {
        player.setVelocityX(0);
    }
    
    // Vertical movement (for top-down style, though we have gravity)
    // In a pure top-down game, you'd use setVelocityY instead of jump
    if (upPressed && player.body.touching.down) {
        currentDirection = 'up';
    } else if (downPressed && player.body.touching.down) {
        currentDirection = 'down';
    }
    
    // Jump
    if (jumpPressed && player.body.touching.down) {
        player.setVelocityY(-400);
        isJumping = true;
    }
    
    // Update animations
    updatePlayerAnimation();
    
    // Reset jumping state when landing
    if (player.body.touching.down && isJumping) {
        isJumping = false;
    }
}

function updatePlayerAnimation() {
    if (!player.body) return;
    
    // Jumping animations
    if (!player.body.touching.down) {
        const jumpAnim = `jump-${currentDirection}`;
        if (player.anims.currentAnim?.key !== jumpAnim) {
            player.anims.play(jumpAnim, true);
        }
        return;
    }
    
    // Walking animations
    if (player.body.velocity.x !== 0) {
        const walkAnim = `walk-${currentDirection}`;
        if (player.anims.currentAnim?.key !== walkAnim) {
            player.anims.play(walkAnim, true);
        }
    } else {
        // Standing
        if (player.anims.currentAnim?.key !== 'stand') {
            player.anims.play('stand', true);
        }
    }
}
// Initialize the Phaser game
const game = new Phaser.Game(gameConfig);

// Log game info
console.log('Game POC initialized');
console.log('Phaser version:', Phaser.VERSION);
console.log('Controls: Arrow keys or WASD to move, Space to jump');
console.log('Mobile: Use on-screen D-pad and action button');
