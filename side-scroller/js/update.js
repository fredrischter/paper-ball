function update() {
    if (!player) return;
    
    // Check if player reached end of level
    if (player.x > worldWidth - 100) {
        // Player reached end - show completion message
        handleLevelComplete(this);
        return;
    }
    
    // Check for jump button press (keyboard or mobile)
    const jumpPressed = Phaser.Input.Keyboard.JustDown(jumpButton) || mobileJumpPressed;
    if (jumpPressed && canJump && !isJumping) {
        performJump();
        canJump = false; // Prevent double jump
    }
    
    // Reset mobile jump flag
    if (mobileJumpPressed) {
        mobileJumpPressed = false;
    }
    
    // Get input from keyboard or mobile controls (only left/right for side-scroller)
    const leftPressed = cursors.left.isDown || wasdKeys.A.isDown || moveLeft;
    const rightPressed = cursors.right.isDown || wasdKeys.D.isDown || moveRight;
    
    // Movement speed
    const speed = 5;
    
    // Apply horizontal movement
    if (leftPressed) {
        player.setVelocityX(-speed);
        currentDirection = 'left';
    } else if (rightPressed) {
        player.setVelocityX(speed);
        currentDirection = 'right';
    } else {
        // Apply horizontal damping
        player.setVelocityX(player.body.velocity.x * 0.85);
    }
    
    // Update animations
    updatePlayerAnimation();
}

function performJump() {
    // Set jumping state
    isJumping = true;
    
    // Apply upward force
    player.setVelocityY(-15);
    
    // Play jump animation for current direction
    const jumpAnim = `jump-${currentDirection}`;
    player.anims.play(jumpAnim, true);
    
    // Reset jumping state after animation completes
    const resetJump = () => {
        isJumping = false;
    };
    
    player.once('animationcomplete', resetJump);
    
    // Fallback timeout
    setTimeout(() => {
        if (isJumping) {
            isJumping = false;
        }
    }, 1000);
}

function updatePlayerAnimation() {
    if (!player.body) return;
    
    // Don't change animation if jumping
    if (isJumping) return;
    
    const velocityX = Math.abs(player.body.velocity.x);
    const isMoving = velocityX > 0.5;
    
    if (isMoving) {
        // Play walking animation for current direction
        const walkAnim = `walk-${currentDirection}`;
        if (player.anims.currentAnim?.key !== walkAnim) {
            player.anims.play(walkAnim, true);
        }
    } else {
        // Play standing animation
        if (player.anims.currentAnim?.key !== 'stand') {
            player.anims.play('stand', true);
        }
    }
}

function handleLevelComplete(scene) {
    // Show completion message
    const completeText = scene.add.text(camera.scrollX + 400, 300, 
        `Level Complete!\nScore: ${score}\n\nPress SPACE to restart`, {
        fontSize: '32px',
        fill: '#fff',
        stroke: '#000',
        strokeThickness: 6,
        align: 'center'
    });
    completeText.setOrigin(0.5);
    completeText.setScrollFactor(0);
    completeText.setDepth(1001);
    
    // Disable player
    player.setVelocity(0, 0);
    player.setStatic(true);
    
    // Restart on space
    const restartHandler = (event) => {
        if (event.code === 'Space') {
            scene.scene.restart();
        }
    };
    scene.input.keyboard.on('keydown', restartHandler);
}
