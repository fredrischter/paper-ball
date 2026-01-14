// Game configuration - Physics Adventure Variant
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
            gravity: { y: 800 }, // Strong gravity for platformer feel
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
let shiftKey;
let wasdKeys;
let platforms;
let isMobile;
let ground;

// Terrain elements
let terrain = [];
let goalFlag;

// Movement state
let isCharging = false;
let moveSpeed = 200; // Normal speed
let chargeSpeed = 400; // Speed boost when holding Shift
let jumpPower = 400; // Base jump power

// Stage management
let currentStage = 1;
let stageText;

// UI buttons
let menuButton;
let soundButton;

// Sound
let backgroundMusic;
let soundEnabled = true;
let moveUp = false;
let moveDown = false;
let mobileJumpPressed = false; // Track mobile jump button press

// Animation state
let currentDirection = 'down'; // down, up, left, right
let isJumping = false;

// Stage management
let currentStage = 1; // 1, 2, or 3
let stageBackgrounds = {}; // Will hold background images

// Popup state
let popupOverlay = null;
let popupActive = false;

// Particle systems
let smokeParticles = null;     // Running smoke particles
let sparkParticles = null;      // Collision spark particles
let celebrationParticles = null; // Level complete celebration
function preload() {
    // Detect if mobile
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Load character spritesheet (65 frames: 1 stand + 32 walk + 32 jump)
    this.load.spritesheet('player', 'assets/spritesheets/character.png', {
        frameWidth: 32,
        frameHeight: 48
    });
    
    // Load UI buttons spritesheet (7 frames: menu, sound, dpad-up, dpad-down, dpad-left, dpad-right, action)
    this.load.spritesheet('ui-buttons', 'assets/spritesheets/ui-buttons.png', {
        frameWidth: 64,
        frameHeight: 64
    });
    
    // Load popup buttons spritesheet (2 frames: OK, Cancel)
    this.load.spritesheet('popup-buttons', 'assets/spritesheets/popup-buttons.png', {
        frameWidth: 90,
        frameHeight: 50
    });
    
    // Load stage backgrounds
    this.load.image('bg-stage1', 'assets/images/stage1-bg.png');
    this.load.image('bg-stage2', 'assets/images/stage2-bg.png');
    this.load.image('bg-stage3', 'assets/images/stage3-bg.png');
    
    // Load popup background
    this.load.image('popup-bg', 'assets/images/popup-bg.png');
    
    // Load square doll sprite
    this.load.image('square-doll', 'assets/images/square-doll.png');
    
    // Load interstitial image
    this.load.image('interstitial', 'assets/images/interstitial.png');
    
    // Load particle textures
    this.load.image('particle-smoke', 'assets/images/particle-smoke.png');
    this.load.image('particle-spark', 'assets/images/particle-spark.png');
    this.load.image('particle-confetti', 'assets/images/particle-confetti.png');
    this.load.image('particle-confetti1', 'assets/images/particle-confetti1.png');
    this.load.image('particle-confetti2', 'assets/images/particle-confetti2.png');
    this.load.image('particle-confetti3', 'assets/images/particle-confetti3.png');
    this.load.image('particle-confetti4', 'assets/images/particle-confetti4.png');
    
    // Note: Background music uses Web Audio API (no file to load)
    // In production, you could load: this.load.audio('bgmusic', 'assets/audio/background.mp3');
}
function create() {
    // Add scrolling background
    const bg = this.add.rectangle(2000, 300, 4000, 600, 0x87CEEB).setDepth(-1); // Sky blue
    
    // Create player sprite with Arcade physics
    player = this.physics.add.sprite(100, 400, 'player', 0);
    player.setCollideWorldBounds(false); // Allow falling off
    player.setBounce(0);
    player.setGravityY(0); // Use world gravity
    
    // Create animations for player
    createPlayerAnimations(this);
    
    // Generate terrain for stage 1
    generateTerrain(this, 1);
    
    // Enable collisions between player and terrain
    this.physics.add.collider(player, terrain);
    
    // Set up controls
    setupPhysicsControls(this);
    
    // Create UI elements
    createPhysicsUI(this);
    
    // Initialize sound (Web Audio API)
    initSound(this);
}

function createPlayerAnimations(scene) {
    // Simple walk animation
    if (!scene.anims.exists('walk-right')) {
        scene.anims.create({
            key: 'walk-right',
            frames: scene.anims.generateFrameNumbers('player', { start: 1, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    }
}

function createPhysicsUI(scene) {
    // Stage text
    stageText = scene.add.text(16, 16, 'Stage 1', {
        fontSize: '24px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
    }).setScrollFactor(0).setDepth(100);
    
    // Instructions
    const instructions = scene.add.text(400, 16, 'Arrow keys to move | SHIFT to charge | UP/W to jump', {
        fontSize: '18px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
        align: 'center'
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100);
    
    // Menu button (top left)
    menuButton = scene.add.rectangle(50, 50, 60, 60, 0x333333)
        .setInteractive()
        .setScrollFactor(0)
        .setDepth(100);
    scene.add.text(50, 50, 'MENU', {
        fontSize: '14px',
        fill: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
    
    // Sound button (top right)
    soundButton = scene.add.rectangle(750, 50, 60, 60, 0x333333)
        .setInteractive()
        .setScrollFactor(0)
        .setDepth(100);
    scene.add.text(750, 50, 'SOUND', {
        fontSize: '14px',
        fill: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
}

function initSound(scene) {
    // Placeholder for sound
    soundEnabled = false;
}


function createParticleSystems(scene) {
    // Smoke particles - emit when player is running
    smokeParticles = scene.add.particles(0, 0, 'particle-smoke', {
        speed: { min: 10, max: 30 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.5, end: 0 },
        alpha: { start: 0.6, end: 0 },
        lifespan: 500,
        frequency: 80,
        emitting: false,
        blendMode: 'ADD'
    });
    smokeParticles.setDepth(5);
    
    // Spark particles - emit when hitting blocks
    sparkParticles = scene.add.particles(0, 0, 'particle-spark', {
        speed: { min: 50, max: 150 },
        angle: { min: 0, max: 360 },
        scale: { start: 1, end: 0.2 },
        alpha: { start: 1, end: 0 },
        lifespan: 300,
        gravityY: 0,
        emitting: false,
        blendMode: 'ADD'
    });
    sparkParticles.setDepth(100);
    
    // Celebration particles - shower when level completes
    celebrationParticles = scene.add.particles(0, 0, 'particle-confetti', {
        speed: { min: 100, max: 300 },
        angle: { min: 240, max: 300 },
        scale: { start: 1, end: 0.5 },
        alpha: { start: 1, end: 0.5 },
        lifespan: 2000,
        gravityY: 0,
        rotate: { min: 0, max: 360 },
        emitting: false,
        blendMode: 'NORMAL'
    });
    celebrationParticles.setDepth(200);
}

function emitCollisionSparks(x, y) {
    if (!sparkParticles) return;
    
    sparkParticles.emitParticleAt(x, y, 8);
}

function startCelebration(scene) {
    if (!celebrationParticles) return;
    
    // Create multiple confetti emitters across the screen
    const confettiTextures = ['particle-confetti', 'particle-confetti1', 'particle-confetti2', 'particle-confetti3', 'particle-confetti4'];
    
    // Emit celebration particles from multiple points
    for (let i = 0; i < 5; i++) {
        const x = 160 + i * 160;
        const texture = confettiTextures[i % confettiTextures.length];
        
        // Create temporary emitter for each confetti type
        const emitter = scene.add.particles(x, 50, texture, {
            speed: { min: 100, max: 300 },
            angle: { min: 60, max: 120 },
            scale: { start: 1, end: 0.3 },
            alpha: { start: 1, end: 0 },
            lifespan: 2000,
            gravityY: 0,
            rotate: { min: 0, max: 360 },
            quantity: 3,
            frequency: 50,
            blendMode: 'NORMAL'
        });
        emitter.setDepth(200);
        
        // Stop after 2 seconds
        scene.time.delayedCall(2000, () => {
            emitter.stop();
            scene.time.delayedCall(2500, () => {
                emitter.destroy();
            });
        });
    }
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
        mobileJumpPressed = true;
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
    player.setPosition(100, 300);
    player.setVelocity(0, 0);
    
    // Remove old square dolls and create new ones
    destroySquareDolls();
    createSquareDollsForStage(scene, 1);
}

function switchToStage(scene, stageNumber) {
    currentStage = stageNumber;
    
    if (stageNumber === 2) {
        // Trigger celebration for completing stage 1
        startCelebration(scene);
        
        // Wait 2 seconds for celebration, then switch
        scene.time.delayedCall(2000, () => {
            // Switch to stage 2
            stageBackgrounds.bg1.setVisible(false);
            stageBackgrounds.bg2.setVisible(true);
            stageBackgrounds.bg3.setVisible(false);
            
            // Position player at left side
            player.setPosition(50, 300);
            player.setVelocity(0, 0);
            
            // Remove old square dolls and create new ones for stage 2
            destroySquareDolls();
            createSquareDollsForStage(scene, 2);
        });
    } else if (stageNumber === 3) {
        // Trigger celebration for completing stage 2
        startCelebration(scene);
        
        // Wait 2 seconds for celebration, then show interstitial
        scene.time.delayedCall(2000, () => {
            // Show interstitial
            showInterstitial(scene);
        });
    }
}

function createSquareDollsForStage(scene, stage) {
    // Create two square dolls for the current stage
    const positions = [
        { x: 250, y: 200 },
        { x: 550, y: 400 }
    ];
    
    squareDolls = [];
    
    positions.forEach(pos => {
        const doll = scene.matter.add.sprite(pos.x, pos.y, 'square-doll');
        doll.setFriction(0.5);
        doll.setMass(3); // Lighter than player so it can be pushed
        doll.setBounce(0.2);
        doll.setFixedRotation(); // Prevent rotation
        
        squareDolls.push(doll);
    });
}

function destroySquareDolls() {
    squareDolls.forEach(doll => {
        if (doll && doll.scene) {
            doll.destroy();
        }
    });
    squareDolls = [];
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
    // Update physics-based movement
    updatePhysicsMovement(this);
}
// Physics Adventure Implementation
// Terrain generation and momentum-based platforming

function generateTerrain(scene, stage) {
    // Clear existing terrain
    terrain.forEach(t => t.destroy());
    terrain = [];
    
    const worldWidth = 4000;
    const worldHeight = 600;
    
    // Create camera world bounds
    scene.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    scene.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    
    // Stage-specific terrain layouts
    if (stage === 1) {
        // Stage 1: Gentle hills and a few holes
        createGround(scene, 0, 500, 800, 50); // Starting platform
        createGround(scene, 900, 520, 400, 30); // Lower platform
        createGround(scene, 1400, 480, 500, 50); // Hill up
        // Hole from 1900-2100
        createGround(scene, 2100, 520, 600, 30); // After hole
        createGround(scene, 2800, 450, 700, 50); // Higher platform
        createGround(scene, 3600, 500, 400, 50); // End platform
    } else if (stage === 2) {
        // Stage 2: More challenging with valleys
        createGround(scene, 0, 500, 600, 50);
        createGround(scene, 700, 480, 300, 30); // Small hill
        createGround(scene, 1100, 540, 400, 20); // Valley
        createGround(scene, 1600, 460, 500, 40); // Hill
        // Hole from 2100-2400
        createGround(scene, 2400, 520, 300, 30);
        createGround(scene, 2800, 440, 600, 60); // Big hill
        createGround(scene, 3500, 500, 500, 50); // End
    } else {
        // Stage 3: Complex terrain with multiple holes
        createGround(scene, 0, 500, 500, 50);
        createGround(scene, 600, 520, 300, 30);
        // Hole from 900-1100
        createGround(scene, 1100, 480, 400, 50);
        createGround(scene, 1600, 520, 300, 30);
        // Hole from 1900-2200
        createGround(scene, 2200, 450, 500, 50);
        createGround(scene, 2800, 520, 400, 30);
        // Hole from 3200-3400
        createGround(scene, 3400, 500, 600, 50); // End platform
    }
    
    // Create goal flag at end
    if (goalFlag) goalFlag.destroy();
    goalFlag = scene.add.rectangle(3900, 460, 30, 80, 0x00ff00);
    scene.physics.add.existing(goalFlag, true); // Static body
}

function createGround(scene, x, y, width, height) {
    const platform = scene.add.rectangle(x + width/2, y + height/2, width, height, 0x8b4513);
    scene.physics.add.existing(platform, true); // Static body
    terrain.push(platform);
    return platform;
}

function setupPhysicsControls(scene) {
    // Keyboard controls
    cursors = scene.input.keyboard.createCursorKeys();
    wasdKeys = scene.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });
    shiftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
}

function updatePhysicsMovement(scene) {
    if (!player || !player.body) return;
    
    const body = player.body;
    const onGround = body.touching.down;
    
    // Check if charging (Shift held)
    isCharging = shiftKey.isDown;
    const currentSpeed = isCharging ? chargeSpeed : moveSpeed;
    
    // Horizontal movement
    if (cursors.left.isDown || wasdKeys.left.isDown) {
        body.setVelocityX(-currentSpeed);
        player.flipX = true;
    } else if (cursors.right.isDown || wasdKeys.right.isDown) {
        body.setVelocityX(currentSpeed);
        player.flipX = false;
    } else {
        // Apply friction when not moving
        body.setVelocityX(body.velocity.x * 0.85);
    }
    
    // Jump (only when on ground)
    if (Phaser.Input.Keyboard.JustDown(cursors.up) || Phaser.Input.Keyboard.JustDown(wasdKeys.up)) {
        if (onGround) {
            // Momentum-based jump: faster horizontal speed = longer jump
            const horizontalSpeed = Math.abs(body.velocity.x);
            const jumpBonus = horizontalSpeed / 10; // Extra jump power based on speed
            body.setVelocityY(-(jumpPower + jumpBonus));
        }
    }
    
    // Camera follow
    scene.cameras.main.scrollX = Phaser.Math.Clamp(player.x - 400, 0, 4000 - 800);
    
    // Check if reached goal
    if (goalFlag && Phaser.Geom.Rectangle.Overlaps(player.getBounds(), goalFlag.getBounds())) {
        completeStage(scene);
    }
    
    // Check if fell off map
    if (player.y > 700) {
        resetPlayerPosition(scene);
    }
}

function resetPlayerPosition(scene) {
    player.setPosition(100, 400);
    player.setVelocity(0, 0);
}

function completeStage(scene) {
    if (currentStage < 3) {
        currentStage++;
        stageText.setText(`Stage ${currentStage}`);
        generateTerrain(scene, currentStage);
        resetPlayerPosition(scene);
    } else {
        // Victory!
        const victoryText = scene.add.text(player.x, 250, 'Victory!\n\nAll Stages Complete!', {
            fontSize: '48px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);
        
        scene.time.delayedCall(3000, () => {
            currentStage = 1;
            stageText.setText(`Stage ${currentStage}`);
            generateTerrain(scene, currentStage);
            resetPlayerPosition(scene);
            victoryText.destroy();
        });
    }
}
