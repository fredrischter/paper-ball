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
