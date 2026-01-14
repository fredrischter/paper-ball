function create() {
    // Set world bounds for extended horizontal scrolling
    this.matter.world.setBounds(0, 0, worldWidth, 600);
    
    // Add tiled stage background
    const bgCount = Math.ceil(worldWidth / 800);
    for (let i = 0; i < bgCount; i++) {
        stageBackgrounds[`bg${i}`] = this.add.image(400 + i * 800, 300, 'bg-stage1').setDepth(-1).setScrollFactor(0.5);
    }
    
    // Create ground platform across the entire world
    ground = this.matter.add.rectangle(worldWidth / 2, 550, worldWidth, 60, { 
        isStatic: true,
        label: 'ground'
    });
    
    // Visual representation of ground
    const groundGraphics = this.add.graphics();
    groundGraphics.fillStyle(0x8B4513, 1);
    groundGraphics.fillRect(0, 520, worldWidth, 80);
    groundGraphics.setDepth(-0.5);
    
    // Create player sprite with Matter physics
    player = this.matter.add.sprite(100, 400, 'player', 0);
    player.setFriction(0.1);
    player.setMass(1);
    player.setFixedRotation();
    player.setBounce(0.1);
    
    // Store scene reference
    player.scene = this;
    
    // Setup camera to follow player horizontally
    camera = this.cameras.main;
    camera.setBounds(0, 0, worldWidth, 600);
    camera.startFollow(player, true, 0.1, 0);
    camera.setFollowOffset(0, 0);
    
    // Create animations
    createAnimations(this);
    
    // Create collectables (coins) scattered throughout the level
    createCollectables(this);
    
    // Set up keyboard input
    cursors = this.input.keyboard.createCursorKeys();
    jumpButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    // WASD keys as alternative
    wasdKeys = {
        A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };
    
    // Set up collision detection
    this.matter.world.on('collisionstart', function(event) {
        event.pairs.forEach(pair => {
            // Check if player hit ground
            const { bodyA, bodyB } = pair;
            if ((bodyA.gameObject === player && bodyB.label === 'ground') ||
                (bodyB.gameObject === player && bodyA.label === 'ground')) {
                canJump = true;
            }
            
            // Check if player collected a coin
            if (bodyA.gameObject === player || bodyB.gameObject === player) {
                const coin = bodyA.gameObject === player ? bodyB.gameObject : bodyA.gameObject;
                if (coin && coins.includes(coin)) {
                    collectCoin(coin);
                }
            }
        });
    });
    
    // Create UI elements (fixed to camera)
    createUI(this);
    
    // Create score text
    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        fill: '#fff',
        stroke: '#000',
        strokeThickness: 4
    });
    scoreText.setScrollFactor(0);
    scoreText.setDepth(1000);
    
    // Initialize sound (Web Audio API)
    initSound(this);
}

function createCollectables(scene) {
    // Create coins scattered throughout the level
    const coinCount = 50; // 50 coins across the level
    const coinSpacing = worldWidth / (coinCount + 1);
    
    for (let i = 0; i < coinCount; i++) {
        const x = coinSpacing * (i + 1);
        const y = Phaser.Math.Between(100, 400);
        
        // Create coin as a circle sprite (using square-doll texture temporarily)
        const coin = scene.matter.add.sprite(x, y, 'square-doll', null, {
            isStatic: false,
            isSensor: true, // Pass through
            label: 'coin'
        });
        coin.setScale(0.4);
        coin.setTint(0xFFD700); // Gold color
        coins.push(coin);
        
        // Add floating animation
        scene.tweens.add({
            targets: coin,
            y: y - 10,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
}

function collectCoin(coin) {
    if (!coin || !coin.active) return;
    
    // Remove coin
    const index = coins.indexOf(coin);
    if (index > -1) {
        coins.splice(index, 1);
    }
    coin.destroy();
    
    // Increase score
    score += 10;
    scoreText.setText('Score: ' + score);
    
    // Play collection sound (can be added later)
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
