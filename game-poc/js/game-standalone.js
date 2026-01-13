// Game POC - Pure JavaScript/Canvas Implementation
// No external dependencies required

// Game configuration
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const MOVE_SPEED = 5;
const FRAME_RATE = 10; // frames per second for animation

// Game state
let canvas, ctx;
let player;
let keys = {};
let touchControls = {
    up: false,
    down: false,
    left: false,
    right: false,
    jump: false
};

let soundEnabled = true;
let audioContext;
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Sprite sheet data
let playerSprites = {};
let uiSprites = {};

// Animation system
class Animation {
    constructor(frames, frameRate) {
        this.frames = frames;
        this.frameRate = frameRate;
        this.currentFrame = 0;
        this.frameDuration = 1000 / frameRate;
        this.lastFrameTime = 0;
    }
    
    update(deltaTime) {
        this.lastFrameTime += deltaTime;
        if (this.lastFrameTime >= this.frameDuration) {
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
            this.lastFrameTime = 0;
        }
    }
    
    getCurrentFrame() {
        return this.frames[this.currentFrame];
    }
    
    reset() {
        this.currentFrame = 0;
        this.lastFrameTime = 0;
    }
}

// Player class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 48;
        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = false;
        this.direction = 'down'; // down, up, left, right
        this.state = 'stand'; // stand, walk, jump
        this.animations = {};
        this.currentAnimation = null;
        
        this.setupAnimations();
    }
    
    setupAnimations() {
        // Create animation objects for each state
        this.animations.stand = new Animation([0], FRAME_RATE);
        
        // Walking animations
        this.animations.walkDown = new Animation([1,2,3,4,5,6,7,8], FRAME_RATE);
        this.animations.walkLeft = new Animation([9,10,11,12,13,14,15,16], FRAME_RATE);
        this.animations.walkRight = new Animation([17,18,19,20,21,22,23,24], FRAME_RATE);
        this.animations.walkUp = new Animation([25,26,27,28,29,30,31,32], FRAME_RATE);
        
        // Jumping animations
        this.animations.jumpDown = new Animation([33,34,35,36,37,38,39,40], FRAME_RATE);
        this.animations.jumpLeft = new Animation([41,42,43,44,45,46,47,48], FRAME_RATE);
        this.animations.jumpRight = new Animation([49,50,51,52,53,54,55,56], FRAME_RATE);
        this.animations.jumpUp = new Animation([57,58,59,60,61,62,63,64], FRAME_RATE);
        
        this.currentAnimation = this.animations.stand;
    }
    
    update(deltaTime) {
        // Apply gravity
        this.velocityY += GRAVITY;
        
        // Apply velocity
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Ground collision
        const groundY = CANVAS_HEIGHT - 100;
        if (this.y + this.height >= groundY) {
            this.y = groundY - this.height;
            this.velocityY = 0;
            this.onGround = true;
        } else {
            this.onGround = false;
        }
        
        // Boundary collision
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > CANVAS_WIDTH) this.x = CANVAS_WIDTH - this.width;
        
        // Update animation
        this.updateAnimation(deltaTime);
    }
    
    updateAnimation(deltaTime) {
        let newAnimation = null;
        
        // Determine animation based on state
        if (!this.onGround) {
            // Jumping
            newAnimation = this.animations[`jump${this.direction.charAt(0).toUpperCase() + this.direction.slice(1)}`];
        } else if (this.velocityX !== 0) {
            // Walking
            newAnimation = this.animations[`walk${this.direction.charAt(0).toUpperCase() + this.direction.slice(1)}`];
        } else {
            // Standing
            newAnimation = this.animations.stand;
        }
        
        // Change animation if needed
        if (newAnimation !== this.currentAnimation) {
            this.currentAnimation = newAnimation;
            this.currentAnimation.reset();
        }
        
        // Update current animation
        this.currentAnimation.update(deltaTime);
    }
    
    draw() {
        const frameIndex = this.currentAnimation.getCurrentFrame();
        const sprite = playerSprites.frames[frameIndex];
        
        if (sprite) {
            ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
        } else {
            // Fallback: draw a colored rectangle
            ctx.fillStyle = '#4169E1';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    
    jump() {
        if (this.onGround) {
            this.velocityY = JUMP_FORCE;
            playJumpSound();
        }
    }
}

// Initialize the game
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Create spritesheets
    createPlayerSpritesheet();
    createUISprites();
    
    // Initialize player
    player = new Player(CANVAS_WIDTH / 2 - 16, CANVAS_HEIGHT / 2);
    
    // Setup controls
    setupControls();
    
    // Initialize audio
    initAudio();
    
    // Update instructions for mobile
    if (isMobile) {
        document.getElementById('instructions').textContent = 'Use D-pad to move, JUMP button to jump';
    }
    
    // Start game loop
    let lastTime = Date.now();
    function gameLoop() {
        const currentTime = Date.now();
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        
        update(deltaTime);
        render();
        
        requestAnimationFrame(gameLoop);
    }
    
    gameLoop();
}

// Create player spritesheet programmatically
function createPlayerSpritesheet() {
    const frameWidth = 32;
    const frameHeight = 48;
    playerSprites.frames = [];
    
    // Helper to create a single frame
    function createFrame(color, legOffset = 0, armOffset = 0, jumpOffset = 0) {
        const canvas = document.createElement('canvas');
        canvas.width = frameWidth;
        canvas.height = frameHeight;
        const ctx = canvas.getContext('2d');
        
        const y = jumpOffset;
        
        // Head
        ctx.fillStyle = '#FFD1A3';
        ctx.fillRect(10, y + 5, 12, 12);
        
        // Body
        ctx.fillStyle = color;
        ctx.fillRect(8, y + 17, 16, 18);
        
        // Arms
        ctx.fillStyle = '#FFD1A3';
        ctx.fillRect(4 + armOffset, y + 20, 6, 12);
        ctx.fillRect(22 - armOffset, y + 20, 6, 12);
        
        // Legs
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(10 + legOffset, y + 35, 5, 13);
        ctx.fillRect(17 - legOffset, y + 35, 5, 13);
        
        return canvas;
    }
    
    // Standing frame (1 frame)
    playerSprites.frames.push(createFrame('#4169E1', 0, 0, 0));
    
    // Walking frames (8 per direction, 4 directions)
    for (let dir = 0; dir < 4; dir++) {
        for (let i = 0; i < 8; i++) {
            const legOffset = Math.sin(i / 8 * Math.PI * 2) * 2;
            const armOffset = Math.sin(i / 8 * Math.PI * 2 + Math.PI) * 1;
            playerSprites.frames.push(createFrame('#4169E1', legOffset, armOffset, 0));
        }
    }
    
    // Jumping frames (8 per direction, 4 directions)
    for (let dir = 0; dir < 4; dir++) {
        for (let i = 0; i < 8; i++) {
            const jumpHeight = Math.sin(i / 8 * Math.PI) * 8;
            playerSprites.frames.push(createFrame('#4169E1', 0, 0, -jumpHeight));
        }
    }
}

// Create UI sprites
function createUISprites() {
    // UI sprites are handled by CSS/HTML in this version
    // This function is kept for compatibility
}

// Setup controls
function setupControls() {
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
        if (e.key === ' ' || e.key.toLowerCase() === 'space') {
            e.preventDefault();
            player.jump();
        }
    });
    
    document.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });
    
    // Mobile D-pad controls
    if (isMobile) {
        const dpadButtons = {
            'dpad-up': 'up',
            'dpad-down': 'down',
            'dpad-left': 'left',
            'dpad-right': 'right',
            'action-btn': 'jump'
        };
        
        Object.keys(dpadButtons).forEach(id => {
            const btn = document.getElementById(id);
            const action = dpadButtons[id];
            
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                touchControls[action] = true;
                if (action === 'jump') {
                    player.jump();
                }
            });
            
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                touchControls[action] = false;
            });
            
            // Mouse events for testing on desktop
            btn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                touchControls[action] = true;
                if (action === 'jump') {
                    player.jump();
                }
            });
            
            btn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                touchControls[action] = false;
            });
        });
    }
    
    // Menu button
    document.getElementById('menu-btn').addEventListener('click', () => {
        alert('Game POC Menu\n\nControls:\n- Arrow keys or WASD to move\n- Space to jump\n- Sound button to toggle music\n\nMobile:\n- Use D-pad to move\n- JUMP button to jump');
    });
    
    // Sound button
    document.getElementById('sound-btn').addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        const btn = document.getElementById('sound-btn');
        btn.textContent = soundEnabled ? '🔊' : '🔇';
        btn.style.opacity = soundEnabled ? '1' : '0.5';
        
        if (soundEnabled) {
            playBackgroundMusic();
        }
    });
}

// Initialize audio
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        if (soundEnabled) {
            playBackgroundMusic();
        }
    } catch (e) {
        console.log('Web Audio API not supported');
    }
}

// Play background music
let musicInterval = null;
function playBackgroundMusic() {
    if (!audioContext || !soundEnabled) return;
    
    if (musicInterval) clearInterval(musicInterval);
    
    const notes = [440, 494, 523, 587, 659]; // A, B, C, D, E
    let noteIndex = 0;
    
    musicInterval = setInterval(() => {
        if (!soundEnabled) {
            clearInterval(musicInterval);
            return;
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(notes[noteIndex], audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        
        noteIndex = (noteIndex + 1) % notes.length;
    }, 500);
}

// Play jump sound
function playJumpSound() {
    if (!audioContext || !soundEnabled) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Update game state
function update(deltaTime) {
    // Handle input
    let moveLeft = keys['arrowleft'] || keys['a'] || touchControls.left;
    let moveRight = keys['arrowright'] || keys['d'] || touchControls.right;
    let moveUp = keys['arrowup'] || keys['w'] || touchControls.up;
    let moveDown = keys['arrowdown'] || keys['s'] || touchControls.down;
    
    // Update player direction based on input
    if (moveLeft) {
        player.direction = 'left';
        player.velocityX = -MOVE_SPEED;
    } else if (moveRight) {
        player.direction = 'right';
        player.velocityX = MOVE_SPEED;
    } else {
        player.velocityX = 0;
    }
    
    // Update direction for up/down (affects jump animation)
    if (moveUp && player.onGround) {
        player.direction = 'up';
    } else if (moveDown && player.onGround) {
        player.direction = 'down';
    }
    
    // Update player
    player.update(deltaTime);
}

// Render game
function render() {
    // Clear canvas
    ctx.fillStyle = '#2d5a3d';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw ground
    ctx.fillStyle = '#654321';
    ctx.fillRect(0, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 100);
    
    // Draw ground details
    ctx.fillStyle = '#543210';
    for (let i = 0; i < CANVAS_WIDTH; i += 40) {
        ctx.fillRect(i, CANVAS_HEIGHT - 100, 30, 5);
    }
    
    // Draw player
    player.draw();
    
    // Draw debug info (optional)
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.fillText(`Direction: ${player.direction}`, 10, CANVAS_HEIGHT - 10);
    ctx.fillText(`OnGround: ${player.onGround}`, 10, CANVAS_HEIGHT - 30);
    ctx.fillText(`Animation: ${player.currentAnimation === player.animations.stand ? 'stand' : 
                  player.onGround ? 'walk' : 'jump'}`, 10, CANVAS_HEIGHT - 50);
}

// Start the game when page loads
window.addEventListener('load', init);

console.log('Game POC initialized - Pure JavaScript/Canvas version');
console.log('No external dependencies required!');
