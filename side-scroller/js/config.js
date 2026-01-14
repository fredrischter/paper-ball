// Game configuration - Side Scroller Variant
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
            gravity: { y: 1 }, // Enable gravity for platformer
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
let ground;

// Collectables
let coins = [];
let score = 0;
let scoreText;

// UI buttons
let menuButton;
let soundButton;
let dPad;
let actionButton;

// Sound
let backgroundMusic;
let soundEnabled = true;

// Movement state (side-scroller: only left/right movement)
let moveLeft = false;
let moveRight = false;
let mobileJumpPressed = false; // Track mobile jump button press

// Animation state
let currentDirection = 'right'; // right or left (no up/down in side-scroller)
let isJumping = false;
let canJump = false; // Can only jump when on ground

// Stage management
let currentStage = 1; // 1, 2, or 3
let stageBackgrounds = {}; // Will hold background images
let worldWidth = 4000; // Extended world width (5x viewport)

// Camera
let camera;

// Popup state (not used in side-scroller variant)
let popupOverlay = null;
let popupActive = false;
