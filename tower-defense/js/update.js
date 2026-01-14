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
