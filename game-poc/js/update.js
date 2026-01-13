function update() {
    if (!player) return;
    
    // Get input from keyboard or mobile controls
    const leftPressed = cursors.left.isDown || this.input.keyboard.addKey('A').isDown || moveLeft;
    const rightPressed = cursors.right.isDown || this.input.keyboard.addKey('D').isDown || moveRight;
    const upPressed = cursors.up.isDown || this.input.keyboard.addKey('W').isDown || moveUp;
    const downPressed = cursors.down.isDown || this.input.keyboard.addKey('S').isDown || moveDown;
    const jumpPressed = Phaser.Input.Keyboard.JustDown(jumpButton);
    
    // Horizontal movement
    if (leftPressed) {
        player.setVelocityX(-160);
        currentDirection = 'left';
    } else if (rightPressed) {
        player.setVelocityX(160);
        currentDirection = 'right';
    } else {
        player.setVelocityX(0);
    }
    
    // Vertical movement (for top-down style, though we have gravity)
    // In a pure top-down game, you'd use setVelocityY instead of jump
    if (upPressed && player.body.touching.down) {
        currentDirection = 'up';
    } else if (downPressed && player.body.touching.down) {
        currentDirection = 'down';
    }
    
    // Jump
    if (jumpPressed && player.body.touching.down) {
        player.setVelocityY(-400);
        isJumping = true;
    }
    
    // Update animations
    updatePlayerAnimation();
    
    // Reset jumping state when landing
    if (player.body.touching.down && isJumping) {
        isJumping = false;
    }
}

function updatePlayerAnimation() {
    if (!player.body) return;
    
    // Jumping animations
    if (!player.body.touching.down) {
        const jumpAnim = `jump-${currentDirection}`;
        if (player.anims.currentAnim?.key !== jumpAnim) {
            player.anims.play(jumpAnim, true);
        }
        return;
    }
    
    // Walking animations
    if (player.body.velocity.x !== 0 || player.body.velocity.y !== 0) {
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
