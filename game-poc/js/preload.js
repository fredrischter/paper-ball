function preload() {
    // Detect if mobile
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Create simple spritesheets procedurally since we don't have actual assets
    createPlayerSpritesheet(this);
    createUISprites(this);
    createStageBackgrounds(this);
    createPopupSprites(this);
    createInterstitialImage(this);
    createSquareDollSprite(this);
    
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

function createStageBackgrounds(scene) {
    // Create background images for each stage
    const backgrounds = [
        { key: 'bg-stage1', color1: '#2d5a3d', color2: '#1a3d2d' },
        { key: 'bg-stage2', color1: '#5a3d2d', color2: '#3d2d1a' },
        { key: 'bg-stage3', color1: '#3d2d5a', color2: '#2d1a3d' }
    ];
    
    backgrounds.forEach(bg => {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, 600);
        gradient.addColorStop(0, bg.color1);
        gradient.addColorStop(1, bg.color2);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);
        
        // Add some decorative elements
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 800;
            const y = Math.random() * 500;
            const size = Math.random() * 30 + 10;
            ctx.fillRect(x, y, size, size);
        }
        
        scene.textures.addCanvas(bg.key, canvas);
    });
}

function createPopupSprites(scene) {
    // Create popup background
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    // Background with border
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, 500, 300);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 496, 296);
    
    // Inner decoration
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(10, 10, 480, 280);
    
    scene.textures.addCanvas('popup-bg', canvas);
    
    // Create button sprites (OK and Cancel)
    const buttonCanvas = document.createElement('canvas');
    buttonCanvas.width = 200;
    buttonCanvas.height = 50;
    const btnCtx = buttonCanvas.getContext('2d');
    
    // OK button (green)
    btnCtx.fillStyle = '#4CAF50';
    btnCtx.fillRect(0, 0, 90, 50);
    btnCtx.strokeStyle = '#fff';
    btnCtx.lineWidth = 2;
    btnCtx.strokeRect(1, 1, 88, 48);
    
    // Cancel button (red)
    btnCtx.fillStyle = '#f44336';
    btnCtx.fillRect(110, 0, 90, 50);
    btnCtx.strokeStyle = '#fff';
    btnCtx.lineWidth = 2;
    btnCtx.strokeRect(111, 1, 88, 48);
    
    scene.textures.addSpriteSheet('popup-buttons', buttonCanvas, {
        frameWidth: 90,
        frameHeight: 50
    });
}

function createInterstitialImage(scene) {
    // Create full-screen interstitial image
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    // Create a radial gradient
    const gradient = ctx.createRadialGradient(400, 300, 50, 400, 300, 400);
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(0.5, '#FFA500');
    gradient.addColorStop(1, '#FF6347');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);
    
    // Add "Loading..." or transition text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Stage Transition', 400, 280);
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Loading...', 400, 340);
    
    scene.textures.addCanvas('interstitial', canvas);
}

function createSquareDollSprite(scene) {
    // Create a square doll sprite (50x50)
    const canvas = document.createElement('canvas');
    canvas.width = 50;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    
    // Draw square body with gradient
    const gradient = ctx.createLinearGradient(0, 0, 50, 50);
    gradient.addColorStop(0, '#FF6B6B');
    gradient.addColorStop(1, '#C92A2A');
    ctx.fillStyle = gradient;
    ctx.fillRect(5, 5, 40, 40);
    
    // Add border
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(5, 5, 40, 40);
    
    // Add simple face/details
    ctx.fillStyle = '#000';
    // Eyes
    ctx.fillRect(15, 15, 5, 5);
    ctx.fillRect(30, 15, 5, 5);
    // Mouth
    ctx.fillRect(15, 30, 20, 3);
    
    scene.textures.addCanvas('square-doll', canvas);
}
