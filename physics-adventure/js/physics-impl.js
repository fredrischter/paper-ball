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
