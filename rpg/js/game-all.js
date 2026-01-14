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
        default: 'matter',
        matter: {
            gravity: { y: 0 }, // No gravity as requested
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

// Physics dolls (squares)
let squareDolls = [];

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
    // Add stage backgrounds
    stageBackgrounds.bg1 = this.add.image(400, 300, 'bg-stage1').setDepth(-1);
    stageBackgrounds.bg2 = this.add.image(400, 300, 'bg-stage2').setDepth(-1).setVisible(false);
    stageBackgrounds.bg3 = this.add.image(400, 300, 'bg-stage3').setDepth(-1).setVisible(false);
    
    // Set up keyboard input first (needed for RPG)
    cursors = this.input.keyboard.createCursorKeys();
    jumpButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    // WASD keys as alternative
    wasdKeys = {
        W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };
    
    // Initialize RPG-specific features
    // Player will be created during world setup
    
    // Create animations
    createAnimations(this);
    
    // Start RPG flow with opening dialog
    initializeRPG(this);
    
    // Create UI elements
    createUI(this);
    
    // Initialize sound (Web Audio API)
    initSound(this);
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
    // RPG-specific update logic
    updateRPG(this);
    
    // Only handle player movement if in world or interior state
    if (currentRPGState !== RPGStates.WORLD && currentRPGState !== RPGStates.INTERIOR) {
        return;
    }
    
    if (!player || !player.body) return;
    
    // Get input from keyboard or mobile controls
    const leftPressed = cursors.left.isDown || wasdKeys.A.isDown || moveLeft;
    const rightPressed = cursors.right.isDown || wasdKeys.D.isDown || moveRight;
    
    // Movement speed
    const speed = 200; // pixels per second
    
    // Horizontal movement (side-scrolling style)
    if (leftPressed) {
        player.setVelocityX(-speed);
        currentDirection = 'left';
        if (player.anims) {
            player.anims.play('walk-left', true);
        }
    } else if (rightPressed) {
        player.setVelocityX(speed);
        currentDirection = 'right';
        if (player.anims) {
            player.anims.play('walk-right', true);
        }
    } else {
        player.setVelocityX(0);
        if (player.anims && !player.anims.isPlaying) {
            player.anims.play(`stand-${currentDirection}`, true);
        }
    }
    
    // Jump mechanic (only in world mode with gravity)
    if (currentRPGState === RPGStates.WORLD) {
        const jumpPressed = Phaser.Input.Keyboard.JustDown(jumpButton) || mobileJumpPressed;
        if (jumpPressed && Math.abs(player.body.velocity.y) < 0.5) {
            player.setVelocityY(-10); // Jump force
        }
    }
    
    // Reset mobile jump flag
    if (mobileJumpPressed) {
        mobileJumpPressed = false;
    }
}

function performJump() {
    // Set jumping state
    isJumping = true;
    
    // Play jump animation for current direction
    const jumpAnim = `jump-${currentDirection}`;
    player.anims.play(jumpAnim, true);
    
    // Reset jumping state after animation completes
    const resetJump = () => {
        isJumping = false;
    };
    
    player.once('animationcomplete', resetJump);
    
    // Fallback timeout in case animation doesn't complete (e.g., player destroyed)
    setTimeout(() => {
        if (isJumping) {
            isJumping = false;
        }
    }, 1000); // 8 frames at 10fps = 800ms, so 1000ms is safe
}

function updatePlayerAnimation() {
    if (!player.body) return;
    
    // Don't change animation if jumping
    if (isJumping) return;
    
    const velocityX = Math.abs(player.body.velocity.x);
    const velocityY = Math.abs(player.body.velocity.y);
    const isMoving = velocityX > 0.5 || velocityY > 0.5;
    
    // Control smoke particles based on movement
    if (smokeParticles) {
        if (isMoving) {
            // Emit smoke particles when running
            smokeParticles.startFollow(player, 0, 10); // Follow player with offset below
            if (!smokeParticles.emitting) {
                smokeParticles.start();
            }
        } else {
            // Stop emitting when standing still
            if (smokeParticles.emitting) {
                smokeParticles.stop();
            }
        }
    }
    
    // Walking animations
    if (isMoving) {
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
// RPG Implementation - Complete dialog, character customization, and NPC system
// This file contains the full RPG variant implementation

// ============================================================================
// RPG GAME STATE MANAGEMENT
// ============================================================================

const RPGStates = {
    OPENING_DIALOG: 'opening_dialog',
    CHARACTER_SELECT: 'character_select',
    CLOTHING_SELECT: 'clothing_select',
    WORLD: 'world',
    INTERIOR: 'interior',
    NPC_DIALOG: 'npc_dialog'
};

let currentRPGState = RPGStates.OPENING_DIALOG;
let dialogIndex = 0;
let selectedCharacter = 0; // 0-2 for different character types
let selectedClothing = 0; // 0-2 for different clothing styles
let currentHouse = null;
let nearNPC = null;

// ============================================================================
// DIALOG SYSTEM
// ============================================================================

const openingDialogs = [
    {
        text: "Welcome to the village of Pixelton...",
        background: 'bg-stage1' // Forest scene
    },
    {
        text: "A mysterious phenomenon has occurred in the land.",
        background: 'bg-stage2' // Mountain scene
    },
    {
        text: "You must uncover the truth. Choose your hero!",
        background: 'bg-stage1' // Back to forest
    }
];

const npcDialogs = {
    elder: [
        { text: "Greetings, traveler. Welcome to my humble home.", background: 'interior-1' },
        { text: "Dark forces are stirring in the east...", background: 'interior-1' },
        { text: "Be careful on your journey.", background: 'interior-1' }
    ],
    merchant: [
        { text: "Looking to trade? I have rare items!", background: 'interior-2' },
        { text: "Come back anytime, friend.", background: 'interior-2' }
    ]
};

// ============================================================================
// DIALOG BOX RENDERING
// ============================================================================

function createDialogBox(scene) {
    const dialogBox = scene.add.graphics();
    dialogBox.fillStyle(0x000000, 0.8);
    dialogBox.fillRect(50, 450, 700, 120);
    dialogBox.lineStyle(4, 0xffffff);
    dialogBox.strokeRect(50, 450, 700, 120);
    dialogBox.setDepth(1000);
    dialogBox.setScrollFactor(0); // Fixed to camera
    return dialogBox;
}

function createDialogText(scene, text) {
    const dialogText = scene.add.text(70, 470, text, {
        font: '20px Arial',
        fill: '#ffffff',
        wordWrap: { width: 660 }
    });
    dialogText.setDepth(1001);
    dialogText.setScrollFactor(0); // Fixed to camera
    return dialogText;
}

function showDialog(scene, dialogData) {
    // Change background if specified
    if (dialogData.background) {
        changeBackground(scene, dialogData.background);
    }
    
    // Create or update dialog box
    if (!scene.dialogBox) {
        scene.dialogBox = createDialogBox(scene);
        scene.dialogText = createDialogText(scene, dialogData.text);
    } else {
        scene.dialogText.setText(dialogData.text);
    }
    
    // Show continue indicator
    if (!scene.continueText) {
        scene.continueText = scene.add.text(720, 550, 'Press SPACE to continue', {
            font: '14px Arial',
            fill: '#aaaaaa'
        });
        scene.continueText.setDepth(1002);
        scene.continueText.setScrollFactor(0);
    }
}

function hideDialog(scene) {
    if (scene.dialogBox) {
        scene.dialogBox.destroy();
        scene.dialogBox = null;
    }
    if (scene.dialogText) {
        scene.dialogText.destroy();
        scene.dialogText = null;
    }
    if (scene.continueText) {
        scene.continueText.destroy();
        scene.continueText = null;
    }
}

// ============================================================================
// CHARACTER SELECTION SCREEN
// ============================================================================

function showCharacterSelect(scene) {
    hideDialog(scene);
    
    // Create character selection UI
    scene.add.text(400, 100, 'Choose Your Character', {
        font: 'bold 32px Arial',
        fill: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0);
    
    const characterTypes = [
        { name: 'Warrior', x: 200 },
        { name: 'Mage', x: 400 },
        { name: 'Rogue', x: 600 }
    ];
    
    scene.characterButtons = [];
    characterTypes.forEach((char, index) => {
        const button = scene.add.rectangle(char.x, 300, 150, 200, 0x4444ff);
        button.setInteractive();
        button.setScrollFactor(0);
        
        const label = scene.add.text(char.x, 420, char.name, {
            font: '20px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0);
        
        button.on('pointerdown', () => {
            selectedCharacter = index;
            transitionToClothingSelect(scene);
        });
        
        scene.characterButtons.push({ button, label });
    });
}

function transitionToClothingSelect(scene) {
    // Clean up character select
    scene.characterButtons.forEach(item => {
        item.button.destroy();
        item.label.destroy();
    });
    
    currentRPGState = RPGStates.CLOTHING_SELECT;
    showClothingSelect(scene);
}

// ============================================================================
// CLOTHING SELECTION SCREEN
// ============================================================================

function showClothingSelect(scene) {
    scene.add.text(400, 100, 'Choose Your Style', {
        font: 'bold 32px Arial',
        fill: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0);
    
    const clothingTypes = [
        { name: 'Light Armor', x: 200 },
        { name: 'Heavy Armor', x: 400 },
        { name: 'Casual', x: 600 }
    ];
    
    scene.clothingButtons = [];
    clothingTypes.forEach((cloth, index) => {
        const button = scene.add.rectangle(cloth.x, 300, 150, 200, 0x44ff44);
        button.setInteractive();
        button.setScrollFactor(0);
        
        const label = scene.add.text(cloth.x, 420, cloth.name, {
            font: '20px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0);
        
        button.on('pointerdown', () => {
            selectedClothing = index;
            transitionToWorld(scene);
        });
        
        scene.clothingButtons.push({ button, label });
    });
}

function transitionToWorld(scene) {
    // Clean up clothing select
    scene.clothingButtons.forEach(item => {
        item.button.destroy();
        item.label.destroy();
    });
    
    // Clear any remaining text
    scene.children.list.forEach(child => {
        if (child.type === 'Text' && child.scrollFactorX === 0) {
            child.destroy();
        }
    });
    
    currentRPGState = RPGStates.WORLD;
    setupWorld(scene);
}

// ============================================================================
// WORLD SETUP (Side-scrolling explorable map)
// ============================================================================

function setupWorld(scene) {
    // Change to world background
    changeBackground(scene, 'bg-stage1');
    
    // Create extended world bounds
    scene.matter.world.setBounds(0, 0, 4000, 600);
    scene.cameras.main.setBounds(0, 0, 4000, 600);
    
    // Create player if not exists
    if (!player) {
        player = scene.matter.add.sprite(200, 400, 'player', 0);
        player.setFriction(0.1);
        player.setMass(10);
        player.setFixedRotation();
        player.scene = scene;
    } else {
        player.setPosition(200, 400);
        player.setVelocity(0, 0);
    }
    
    // Camera follows player
    scene.cameras.main.startFollow(player, true, 0.1, 0.1);
    
    // Create ground platform
    const ground = scene.matter.add.rectangle(2000, 580, 4000, 40, {
        isStatic: true,
        friction: 1
    });
    
    // Create houses
    createHouses(scene);
    
    // Enable gravity for world mode
    scene.matter.world.setGravity(0, 1);
    
    // Show instructions
    const instructions = scene.add.text(400, 50, 'Arrow keys to move, UP at door to enter house', {
        font: '16px Arial',
        fill: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 }
    }).setScrollFactor(0).setDepth(100);
    
    scene.time.delayedCall(5000, () => {
        if (instructions) instructions.destroy();
    });
}

// ============================================================================
// HOUSE SYSTEM
// ============================================================================

const houses = [
    { x: 800, y: 500, npc: 'elder', doorY: 480 },
    { x: 1600, y: 500, npc: 'merchant', doorY: 480 },
    { x: 2800, y: 500, npc: 'elder', doorY: 480 }
];

function createHouses(scene) {
    scene.houses = [];
    houses.forEach((houseData, index) => {
        // House structure (brown rectangle)
        const house = scene.add.rectangle(houseData.x, houseData.y, 200, 150, 0x8b4513);
        house.setStrokeStyle(4, 0x000000);
        
        // Door (darker brown rectangle)
        const door = scene.add.rectangle(houseData.x, houseData.doorY, 50, 80, 0x654321);
        door.setStrokeStyle(2, 0x000000);
        
        // Door marker
        const doorText = scene.add.text(houseData.x, houseData.doorY - 60, '↓ DOOR', {
            font: 'bold 14px Arial',
            fill: '#ffff00',
            backgroundColor: '#000000',
            padding: { x: 5, y: 2 }
        }).setOrigin(0.5);
        
        scene.houses.push({
            data: houseData,
            structure: house,
            door: door,
            marker: doorText,
            index: index
        });
    });
}

function checkHouseProximity(scene) {
    if (currentRPGState !== RPGStates.WORLD) return;
    
    currentHouse = null;
    scene.houses.forEach(house => {
        const dist = Phaser.Math.Distance.Between(player.x, player.y, house.data.x, house.data.doorY);
        if (dist < 60) {
            currentHouse = house;
            house.marker.setVisible(true);
        } else {
            house.marker.setVisible(false);
        }
    });
}

function enterHouse(scene) {
    if (!currentHouse) return;
    
    currentRPGState = RPGStates.INTERIOR;
    
    // Change to interior view
    changeBackground(scene, 'bg-stage2'); // Brown background for interior
    
    // Hide player temporarily
    player.setVisible(false);
    
    // Stop camera follow
    scene.cameras.main.stopFollow();
    scene.cameras.main.setScroll(0, 0);
    
    // Create interior elements
    showInterior(scene, currentHouse);
}

// ============================================================================
// INTERIOR SYSTEM
// ============================================================================

function showInterior(scene, house) {
    // Interior title
    scene.interiorTitle = scene.add.text(400, 50, `Inside the ${house.data.npc}'s House`, {
        font: 'bold 24px Arial',
        fill: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setScrollFactor(0);
    
    // Create NPC
    const npcX = 400;
    const npcY = 300;
    scene.npc = scene.add.rectangle(npcX, npcY, 40, 60, 0xff00ff);
    scene.npc.setStrokeStyle(2, 0x000000);
    scene.npc.npcType = house.data.npc;
    
    // NPC label
    scene.npcLabel = scene.add.text(npcX, npcY - 50, house.data.npc.toUpperCase(), {
        font: 'bold 16px Arial',
        fill: '#ffff00'
    }).setOrigin(0.5);
    
    // Show player in interior
    player.setPosition(200, 400);
    player.setVisible(true);
    player.setVelocity(0, 0);
    
    // Exit door
    scene.exitDoor = scene.add.rectangle(100, 500, 60, 100, 0x654321);
    scene.exitDoor.setStrokeStyle(3, 0x000000);
    
    scene.exitText = scene.add.text(100, 440, '↑ EXIT', {
        font: 'bold 14px Arial',
        fill: '#00ff00',
        backgroundColor: '#000000',
        padding: { x: 5, y: 2 }
    }).setOrigin(0.5);
    
    // Instructions
    scene.interiorInstructions = scene.add.text(400, 550, 'Walk near NPC to talk | DOWN at door to exit', {
        font: '14px Arial',
        fill: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 }
    }).setOrigin(0.5);
}

function checkNPCProximity(scene) {
    if (currentRPGState !== RPGStates.INTERIOR || !scene.npc) return;
    
    const dist = Phaser.Math.Distance.Between(player.x, player.y, scene.npc.x, scene.npc.y);
    if (dist < 80) {
        nearNPC = scene.npc.npcType;
        if (!scene.talkPrompt) {
            scene.talkPrompt = scene.add.text(scene.npc.x, scene.npc.y + 60, 'Press SPACE to talk', {
                font: '12px Arial',
                fill: '#00ff00',
                backgroundColor: '#000000',
                padding: { x: 5, y: 2 }
            }).setOrigin(0.5);
        }
    } else {
        nearNPC = null;
        if (scene.talkPrompt) {
            scene.talkPrompt.destroy();
            scene.talkPrompt = null;
        }
    }
}

function startNPCDialog(scene) {
    if (!nearNPC) return;
    
    currentRPGState = RPGStates.NPC_DIALOG;
    dialogIndex = 0;
    
    // Show first dialog
    const dialogs = npcDialogs[nearNPC] || npcDialogs.elder;
    showDialog(scene, dialogs[0]);
}

function exitHouse(scene) {
    // Clean up interior
    if (scene.interiorTitle) scene.interiorTitle.destroy();
    if (scene.npc) scene.npc.destroy();
    if (scene.npcLabel) scene.npcLabel.destroy();
    if (scene.exitDoor) scene.exitDoor.destroy();
    if (scene.exitText) scene.exitText.destroy();
    if (scene.interiorInstructions) scene.interiorInstructions.destroy();
    if (scene.talkPrompt) scene.talkPrompt.destroy();
    
    hideDialog(scene);
    
    currentRPGState = RPGStates.WORLD;
    currentHouse = null;
    nearNPC = null;
    
    // Return to world
    changeBackground(scene, 'bg-stage1');
    player.setPosition(currentHouse ? currentHouse.data.x + 100 : 200, 400);
    scene.cameras.main.startFollow(player, true, 0.1, 0.1);
}

// ============================================================================
// BACKGROUND MANAGEMENT
// ============================================================================

function changeBackground(scene, bgKey) {
    // Hide all backgrounds
    if (stageBackgrounds.bg1) stageBackgrounds.bg1.setVisible(false);
    if (stageBackgrounds.bg2) stageBackgrounds.bg2.setVisible(false);
    if (stageBackgrounds.bg3) stageBackgrounds.bg3.setVisible(false);
    
    // Show requested background
    if (bgKey === 'bg-stage1' && stageBackgrounds.bg1) {
        stageBackgrounds.bg1.setVisible(true);
    } else if (bgKey === 'bg-stage2' && stageBackgrounds.bg2) {
        stageBackgrounds.bg2.setVisible(true);
    } else if (bgKey === 'bg-stage3' && stageBackgrounds.bg3) {
        stageBackgrounds.bg3.setVisible(true);
    }
}

// ============================================================================
// RPG UPDATE LOGIC
// ============================================================================

function updateRPG(scene) {
    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(jumpButton);
    const upPressed = cursors.up.isDown || wasdKeys.W.isDown;
    const downPressed = cursors.down.isDown || wasdKeys.S.isDown;
    
    switch (currentRPGState) {
        case RPGStates.OPENING_DIALOG:
            if (spaceJustPressed) {
                dialogIndex++;
                if (dialogIndex < openingDialogs.length) {
                    showDialog(scene, openingDialogs[dialogIndex]);
                } else {
                    hideDialog(scene);
                    currentRPGState = RPGStates.CHARACTER_SELECT;
                    showCharacterSelect(scene);
                }
            }
            break;
            
        case RPGStates.WORLD:
            checkHouseProximity(scene);
            if (upPressed && currentHouse) {
                enterHouse(scene);
            }
            break;
            
        case RPGStates.INTERIOR:
            checkNPCProximity(scene);
            if (spaceJustPressed && nearNPC) {
                startNPCDialog(scene);
            }
            // Check for exit
            const distToExit = Phaser.Math.Distance.Between(player.x, player.y, 100, 500);
            if (downPressed && distToExit < 80) {
                exitHouse(scene);
            }
            break;
            
        case RPGStates.NPC_DIALOG:
            if (spaceJustPressed) {
                dialogIndex++;
                const dialogs = npcDialogs[nearNPC] || npcDialogs.elder;
                if (dialogIndex < dialogs.length) {
                    showDialog(scene, dialogs[dialogIndex]);
                } else {
                    hideDialog(scene);
                    dialogIndex = 0;
                    currentRPGState = RPGStates.INTERIOR;
                }
            }
            break;
    }
}

// ============================================================================
// RPG INITIALIZATION
// ============================================================================

function initializeRPG(scene) {
    currentRPGState = RPGStates.OPENING_DIALOG;
    dialogIndex = 0;
    
    // Show first opening dialog
    showDialog(scene, openingDialogs[0]);
}
