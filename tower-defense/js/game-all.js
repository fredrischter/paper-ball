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

// Tower Defense Implementation

function initTowerDefense(scene) {
    // Initialize game state
    towers = [];
    monsters = [];
    projectiles = [];
    kills = 0;
    escapes = 0;
    monstersSpawned = 0;
    monsterSpawnTimer = 0;
    placementMode = false;
    
    // Create UI
    createTowerDefenseUI(scene);
    
    // Draw path for current stage
    drawPath(scene, currentStage);
}

function createTowerDefenseUI(scene) {
    // Title
    const title = scene.add.text(400, 30, 'Tower Defense', {
        fontSize: '32px',
        fontFamily: 'Arial',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
    }).setOrigin(0.5);
    
    // Status text
    statusText = scene.add.text(400, 70, 
        `Stage ${currentStage} | Kills: ${kills}/20 | Escapes: ${escapes}/3`, {
        fontSize: '18px',
        fontFamily: 'Arial',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3
    }).setOrigin(0.5);
    
    // Instructions
    scene.add.text(400, 580, 'Click to place towers | Towers auto-shoot monsters', {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2
    }).setOrigin(0.5);
    
    // Enable clicking
    scene.input.on('pointerdown', (pointer) => {
        handleClick(scene, pointer.x, pointer.y);
    });
}

function drawPath(scene, stage) {
    const path = stagePaths[stage];
    const graphics = scene.add.graphics();
    graphics.lineStyle(20, 0x8b7355, 0.6);
    
    graphics.beginPath();
    graphics.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
        graphics.lineTo(path[i].x, path[i].y);
    }
    graphics.strokePath();
    
    // Draw start and end markers
    const startCircle = scene.add.circle(path[0].x, path[0].y, 15, 0x00ff00);
    const endCircle = scene.add.circle(path[path.length - 1].x, path[path.length - 1].y, 15, 0xff0000);
}

function handleClick(scene, x, y) {
    // Check if clicking on path - don't allow tower placement
    const path = stagePaths[currentStage];
    const minDist = 40;
    
    for (let i = 0; i < path.length - 1; i++) {
        const dist = distanceToLineSegment(x, y, path[i], path[i + 1]);
        if (dist < minDist) {
            return; // Too close to path
        }
    }
    
    // Place tower
    placeTower(scene, x, y);
}

function distanceToLineSegment(px, py, p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const l2 = dx * dx + dy * dy;
    if (l2 === 0) return Math.sqrt((px - p1.x) ** 2 + (py - p1.y) ** 2);
    
    let t = ((px - p1.x) * dx + (py - p1.y) * dy) / l2;
    t = Math.max(0, Math.min(1, t));
    
    const projX = p1.x + t * dx;
    const projY = p1.y + t * dy;
    return Math.sqrt((px - projX) ** 2 + (py - projY) ** 2);
}

function placeTower(scene, x, y) {
    // Create tower visual (triangle)
    const tower = scene.add.triangle(x, y, 0, 20, 10, -10, -10, -10, 0x0088ff);
    tower.setStrokeStyle(2, 0x000000);
    
    const towerData = {
        sprite: tower,
        x: x,
        y: y,
        range: 150,
        fireRate: 1000, // ms
        lastFire: 0,
        damage: 1
    };
    
    towers.push(towerData);
    
    // Draw range circle
    const rangeCircle = scene.add.circle(x, y, towerData.range, 0x0088ff, 0.1);
    rangeCircle.setStrokeStyle(1, 0x0088ff, 0.3);
}

function spawnMonster(scene) {
    const path = stagePaths[currentStage];
    const startPos = path[0];
    
    // Create monster (circle)
    const monster = scene.add.circle(startPos.x, startPos.y, 12, 0xff4444);
    monster.setStrokeStyle(2, 0x000000);
    
    const monsterData = {
        sprite: monster,
        x: startPos.x,
        y: startPos.y,
        health: 3,
        speed: 50, // pixels per second
        pathIndex: 0,
        path: path
    };
    
    monsters.push(monsterData);
    monstersSpawned++;
}

function updateMonsters(scene, delta) {
    const deltaSeconds = delta / 1000;
    
    for (let i = monsters.length - 1; i >= 0; i--) {
        const monster = monsters[i];
        
        if (monster.pathIndex >= monster.path.length - 1) {
            // Monster reached end - ESCAPE
            escapes++;
            monster.sprite.destroy();
            monsters.splice(i, 1);
            updateStatusText();
            
            if (escapes >= 3) {
                gameLose(scene);
            }
            continue;
        }
        
        // Move towards next waypoint
        const target = monster.path[monster.pathIndex + 1];
        const dx = target.x - monster.x;
        const dy = target.y - monster.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 5) {
            // Reached waypoint, move to next
            monster.pathIndex++;
        } else {
            // Move towards waypoint
            const moveAmount = monster.speed * deltaSeconds;
            monster.x += (dx / dist) * moveAmount;
            monster.y += (dy / dist) * moveAmount;
            monster.sprite.x = monster.x;
            monster.sprite.y = monster.y;
        }
    }
}

function updateTowers(scene, delta, time) {
    for (const tower of towers) {
        if (time - tower.lastFire < tower.fireRate) continue;
        
        // Find closest monster in range
        let closestMonster = null;
        let closestDist = Infinity;
        
        for (const monster of monsters) {
            const dx = monster.x - tower.x;
            const dy = monster.y - tower.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist <= tower.range && dist < closestDist) {
                closestMonster = monster;
                closestDist = dist;
            }
        }
        
        if (closestMonster) {
            tower.lastFire = time;
            fireProjectile(scene, tower, closestMonster);
        }
    }
}

function fireProjectile(scene, tower, target) {
    const projectile = scene.add.circle(tower.x, tower.y, 4, 0xffff00);
    
    const projectileData = {
        sprite: projectile,
        x: tower.x,
        y: tower.y,
        targetX: target.x,
        targetY: target.y,
        speed: 300,
        damage: tower.damage,
        target: target
    };
    
    projectiles.push(projectileData);
}

function updateProjectiles(scene, delta) {
    const deltaSeconds = delta / 1000;
    
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const proj = projectiles[i];
        
        // Move towards target
        const dx = proj.target.x - proj.x;
        const dy = proj.target.y - proj.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 10) {
            // Hit target
            proj.target.health -= proj.damage;
            
            if (proj.target.health <= 0) {
                // Monster killed
                kills++;
                proj.target.sprite.destroy();
                const idx = monsters.indexOf(proj.target);
                if (idx > -1) monsters.splice(idx, 1);
                updateStatusText();
                
                if (kills >= 20) {
                    gameWin(scene);
                }
            }
            
            proj.sprite.destroy();
            projectiles.splice(i, 1);
        } else {
            const moveAmount = proj.speed * deltaSeconds;
            proj.x += (dx / dist) * moveAmount;
            proj.y += (dy / dist) * moveAmount;
            proj.sprite.x = proj.x;
            proj.sprite.y = proj.y;
        }
    }
}

function updateStatusText() {
    if (statusText) {
        statusText.setText(`Stage ${currentStage} | Kills: ${kills}/20 | Escapes: ${escapes}/3`);
    }
}

function gameWin(scene) {
    // Clear screen
    scene.children.removeAll();
    
    // Show victory message
    scene.add.text(400, 250, 'STAGE COMPLETE!', {
        fontSize: '48px',
        fontFamily: 'Arial',
        color: '#00ff00',
        stroke: '#000000',
        strokeThickness: 6
    }).setOrigin(0.5);
    
    scene.add.text(400, 320, '20 Monsters Defeated!', {
        fontSize: '24px',
        fontFamily: 'Arial',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
    }).setOrigin(0.5);
    
    // Next stage or win
    if (currentStage < 3) {
        scene.add.text(400, 380, `Advancing to Stage ${currentStage + 1}...`, {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        scene.time.delayedCall(2000, () => {
            currentStage++;
            kills = 0;
            escapes = 0;
            monstersSpawned = 0;
            scene.scene.restart();
        });
    } else {
        scene.add.text(400, 380, 'ALL STAGES COMPLETE!', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffff00',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        scene.add.text(400, 440, 'Click to restart', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        scene.input.once('pointerdown', () => {
            currentStage = 1;
            kills = 0;
            escapes = 0;
            monstersSpawned = 0;
            scene.scene.restart();
        });
    }
}

function gameLose(scene) {
    // Clear screen
    scene.children.removeAll();
    
    // Show loss message
    scene.add.text(400, 250, 'GAME OVER!', {
        fontSize: '48px',
        fontFamily: 'Arial',
        color: '#ff0000',
        stroke: '#000000',
        strokeThickness: 6
    }).setOrigin(0.5);
    
    scene.add.text(400, 320, '3 Monsters Escaped!', {
        fontSize: '24px',
        fontFamily: 'Arial',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
    }).setOrigin(0.5);
    
    scene.add.text(400, 380, 'Click to restart', {
        fontSize: '18px',
        fontFamily: 'Arial',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3
    }).setOrigin(0.5);
    
    scene.input.once('pointerdown', () => {
        currentStage = 1;
        kills = 0;
        escapes = 0;
        monstersSpawned = 0;
        scene.scene.restart();
    });
}

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
    // Tower Defense - No character, no physics
    
    // Add plain background
    this.add.rectangle(400, 300, 800, 600, 0x2d5016);
    
    // Initialize tower defense game
    initTowerDefense(this);
    
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

function update(time, delta) {
    // Tower Defense update loop
    
    // Spawn monsters periodically
    if (monstersSpawned < maxMonstersPerWave) {
        monsterSpawnTimer += delta;
        if (monsterSpawnTimer >= 1500) { // Spawn every 1.5 seconds
            spawnMonster(this);
            monsterSpawnTimer = 0;
        }
    }
    
    // Update game objects
    updateMonsters(this, delta);
    updateTowers(this, delta, time);
    updateProjectiles(this, delta);
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


// Initialize game
const game = new Phaser.Game(gameConfig);
console.log('Tower Defense game initialized');
