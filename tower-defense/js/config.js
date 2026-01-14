// Game configuration - Tower Defense
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
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Tower Defense Game State
let towers = [];
let monsters = [];
let projectiles = [];

// UI
let menuButton;
let soundButton;
let scoreText;
let statusText;

// Sound
let backgroundMusic;
let soundEnabled = true;

// Game state
// currentStage declared on line 87
let kills = 0;
let escapes = 0;
let placementMode = false;
let monsterSpawnTimer = 0;
let monstersSpawned = 0;
let maxMonstersPerWave = 30;

// Stage paths (waypoints for monsters)
const stagePaths = {
    1: [
        {x: 0, y: 300},
        {x: 200, y: 300},
        {x: 200, y: 150},
        {x: 600, y: 150},
        {x: 600, y: 450},
        {x: 800, y: 450}
    ],
    2: [
        {x: 400, y: 0},
        {x: 400, y: 200},
        {x: 150, y: 200},
        {x: 150, y: 400},
        {x: 650, y: 400},
        {x: 650, y: 600}
    ],
    3: [
        {x: 0, y: 150},
        {x: 350, y: 150},
        {x: 350, y: 450},
        {x: 650, y: 450},
        {x: 650, y: 150},
        {x: 800, y: 150}
    ]
};
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
