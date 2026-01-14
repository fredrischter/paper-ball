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
    const upPressed = cursors.up.isDown || wasdKeys.W.isDown || moveUp;
    const downPressed = cursors.down.isDown || wasdKeys.S.isDown || moveDown;
    
    // Movement speed - reduced for smoother, more controlled movement
    const speed = 3; // Using velocity instead of setVelocityX for Matter.js consistency
    
    // Four-directional movement for RPG (top-down)
    let velocityX = 0;
    let velocityY = 0;
    
    if (leftPressed) {
        velocityX = -speed;
        currentDirection = 'left';
    } else if (rightPressed) {
        velocityX = speed;
        currentDirection = 'right';
    }
    
    if (upPressed) {
        velocityY = -speed;
        currentDirection = 'up';
    } else if (downPressed) {
        velocityY = speed;
        currentDirection = 'down';
    }
    
    // Apply velocity
    if (velocityX !== 0 || velocityY !== 0) {
        player.setVelocity(velocityX, velocityY);
        if (player.anims) {
            player.anims.play(`walk-${currentDirection}`, true);
        }
    } else {
        // Apply damping when no keys pressed
        player.setVelocity(player.body.velocity.x * 0.8, player.body.velocity.y * 0.8);
        if (player.anims && Math.abs(player.body.velocity.x) < 0.5 && Math.abs(player.body.velocity.y) < 0.5) {
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
