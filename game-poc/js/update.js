function update() {
    if (!player || popupActive) return;
    
    // Check for edge exits
    if (player.x < -20) {
        // Player exited left - show popup
        showPopup(this);
        return;
    } else if (player.x > 820) {
        // Player exited right - switch stage
        if (currentStage === 1) {
            switchToStage(this, 2);
        } else if (currentStage === 2) {
            switchToStage(this, 3);
        }
        return;
    }
    
    // Check for jump button press (keyboard or mobile)
    const jumpPressed = Phaser.Input.Keyboard.JustDown(jumpButton) || mobileJumpPressed;
    if (jumpPressed && !isJumping) {
        performJump();
    }
    
    // Reset mobile jump flag
    if (mobileJumpPressed) {
        mobileJumpPressed = false;
    }
    
    // Get input from keyboard or mobile controls
    const leftPressed = cursors.left.isDown || wasdKeys.A.isDown || moveLeft;
    const rightPressed = cursors.right.isDown || wasdKeys.D.isDown || moveRight;
    const upPressed = cursors.up.isDown || wasdKeys.W.isDown || moveUp;
    const downPressed = cursors.down.isDown || wasdKeys.S.isDown || moveDown;
    
    // Movement speed (faster during jump)
    const speed = isJumping ? 5 : 3;
    
    // Apply forces for movement (top-down style with no gravity)
    if (leftPressed) {
        player.setVelocityX(-speed);
        currentDirection = 'left';
    } else if (rightPressed) {
        player.setVelocityX(speed);
        currentDirection = 'right';
    } else {
        player.setVelocityX(player.body.velocity.x * 0.9); // Apply damping
    }
    
    if (upPressed) {
        player.setVelocityY(-speed);
        currentDirection = 'up';
    } else if (downPressed) {
        player.setVelocityY(speed);
        currentDirection = 'down';
    } else {
        player.setVelocityY(player.body.velocity.y * 0.9); // Apply damping
    }
    
    // Update animations
    updatePlayerAnimation();
}

function performJump() {
    // Set jumping state
    isJumping = true;
    
    // Play jump animation for current direction
    const jumpAnim = `jump-${currentDirection}`;
    player.anims.play(jumpAnim, true);
    
    // Reset jumping state after animation completes
    player.once('animationcomplete', () => {
        isJumping = false;
    });
}

function updatePlayerAnimation() {
    if (!player.body) return;
    
    // Don't change animation if jumping
    if (isJumping) return;
    
    const velocityX = Math.abs(player.body.velocity.x);
    const velocityY = Math.abs(player.body.velocity.y);
    const isMoving = velocityX > 0.5 || velocityY > 0.5;
    
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
