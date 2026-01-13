function preload() {
    // Detect if mobile
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Create simple spritesheets procedurally since we don't have actual assets
    createPlayerSpritesheet(this);
    createUISprites(this);
    
    // Note: In a real implementation, you would load actual sprite files:
    // this.load.spritesheet('player', 'assets/spritesheets/player.png', {
    //     frameWidth: 32,
    //     frameHeight: 48
    // });
    
    // Create a simple background music using Web Audio API
    // In production, you'd load: this.load.audio('bgmusic', 'assets/audio/background.mp3');
}

function createPlayerSpritesheet(scene) {
    // Create a canvas to draw the spritesheet
    const canvas = document.createElement('canvas');
    const frameWidth = 32;
    const frameHeight = 48;
    const framesPerAnimation = 8;
    
    // Total frames: 1 standing + 4 directions * 8 walking + 4 directions * 8 jumping = 65 frames
    // Layout: 13 columns x 5 rows
    canvas.width = frameWidth * 13;
    canvas.height = frameHeight * 5;
    
    const ctx = canvas.getContext('2d');
    
    // Helper function to draw a simple character
    function drawCharacter(x, y, color, legOffset = 0) {
        // Head
        ctx.fillStyle = '#FFD1A3';
        ctx.fillRect(x + 10, y + 5, 12, 12);
        
        // Body
        ctx.fillStyle = color;
        ctx.fillRect(x + 8, y + 17, 16, 18);
        
        // Arms
        ctx.fillStyle = '#FFD1A3';
        ctx.fillRect(x + 4, y + 20, 6, 12);
        ctx.fillRect(x + 22, y + 20, 6, 12);
        
        // Legs
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(x + 10 + legOffset, y + 35, 5, 13);
        ctx.fillRect(x + 17 - legOffset, y + 35, 5, 13);
    }
    
    let frameIndex = 0;
    
    // Standing frame (1 frame)
    drawCharacter(frameIndex * frameWidth, 0, '#4169E1', 0);
    frameIndex++;
    
    // Walking animations (8 frames per direction)
    const directions = [
        { name: 'down', row: 0 },
        { name: 'left', row: 1 },
        { name: 'right', row: 1 },
        { name: 'up', row: 2 }
    ];
    
    // Walking frames
    for (let dir = 0; dir < 4; dir++) {
        for (let i = 0; i < framesPerAnimation; i++) {
            const x = (1 + dir * framesPerAnimation + i) * frameWidth;
            const y = 0;
            const legOffset = Math.sin(i / framesPerAnimation * Math.PI * 2) * 2;
            drawCharacter(x, y, '#4169E1', legOffset);
        }
    }
    
    // Jumping frames (8 frames per direction)
    for (let dir = 0; dir < 4; dir++) {
        for (let i = 0; i < framesPerAnimation; i++) {
            const x = (1 + dir * framesPerAnimation + i) * frameWidth;
            const y = frameHeight;
            const jumpHeight = Math.sin(i / framesPerAnimation * Math.PI) * 10;
            drawCharacter(x, y - jumpHeight, '#4169E1', 0);
        }
    }
    
    // Add the spritesheet to Phaser
    scene.textures.addSpriteSheet('player', canvas, {
        frameWidth: frameWidth,
        frameHeight: frameHeight
    });
}

function createUISprites(scene) {
    // Create UI buttons spritesheet
    const canvas = document.createElement('canvas');
    const buttonSize = 64;
    canvas.width = buttonSize * 6; // 6 different buttons
    canvas.height = buttonSize;
    
    const ctx = canvas.getContext('2d');
    
    // Menu button (hamburger icon)
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, buttonSize, buttonSize);
    ctx.fillStyle = '#FFF';
    ctx.fillRect(10, 15, 44, 6);
    ctx.fillRect(10, 29, 44, 6);
    ctx.fillRect(10, 43, 44, 6);
    
    // Sound button (speaker icon)
    ctx.fillStyle = '#333';
    ctx.fillRect(buttonSize, 0, buttonSize, buttonSize);
    ctx.fillStyle = '#FFF';
    ctx.fillRect(buttonSize + 15, 24, 10, 16);
    ctx.beginPath();
    ctx.moveTo(buttonSize + 25, 24);
    ctx.lineTo(buttonSize + 40, 14);
    ctx.lineTo(buttonSize + 40, 50);
    ctx.lineTo(buttonSize + 25, 40);
    ctx.fill();
    
    // D-pad arrows
    const dpadX = buttonSize * 2;
    ctx.fillStyle = '#444';
    ctx.fillRect(dpadX, 0, buttonSize, buttonSize);
    // Up arrow
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.moveTo(dpadX + 32, 15);
    ctx.lineTo(dpadX + 42, 25);
    ctx.lineTo(dpadX + 22, 25);
    ctx.fill();
    
    // Down arrow
    const dpadX2 = buttonSize * 3;
    ctx.fillStyle = '#444';
    ctx.fillRect(dpadX2, 0, buttonSize, buttonSize);
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.moveTo(dpadX2 + 32, 49);
    ctx.lineTo(dpadX2 + 22, 39);
    ctx.lineTo(dpadX2 + 42, 39);
    ctx.fill();
    
    // Left arrow
    const dpadX3 = buttonSize * 4;
    ctx.fillStyle = '#444';
    ctx.fillRect(dpadX3, 0, buttonSize, buttonSize);
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.moveTo(dpadX3 + 15, 32);
    ctx.lineTo(dpadX3 + 25, 22);
    ctx.lineTo(dpadX3 + 25, 42);
    ctx.fill();
    
    // Right arrow
    const dpadX4 = buttonSize * 5;
    ctx.fillStyle = '#444';
    ctx.fillRect(dpadX4, 0, buttonSize, buttonSize);
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.moveTo(dpadX4 + 49, 32);
    ctx.lineTo(dpadX4 + 39, 22);
    ctx.lineTo(dpadX4 + 39, 42);
    ctx.fill();
    
    // Add the UI spritesheet to Phaser
    scene.textures.addSpriteSheet('ui-buttons', canvas, {
        frameWidth: buttonSize,
        frameHeight: buttonSize
    });
}
