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
