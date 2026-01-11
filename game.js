// Game constants
const GRAVITY = 0.5;
const WIND_STRENGTH = 0.3;
const MAX_THROW_FORCE = 20;
const MIN_DRAG_DISTANCE = 10;
const WIND_EFFECT_RADIUS = 150;
const WIND_VERTICAL_RANGE = 50;
const TRASH_CAN_COLLISION_MARGIN = 5;
const TRASH_CAN_ENTRY_TOLERANCE = 20;

// Game state
let canvas, ctx;
let score = 0;
let gameState = 'aiming'; // aiming, throwing, reset
let paperBall = null;
let aimStart = null;
let aimCurrent = null;

// Game objects
const hand = {
    x: 150,
    y: 500,
    width: 60,
    height: 80
};

const trashCan = {
    x: 600,
    y: 450,
    width: 80,
    height: 100,
    openingY: 450,
    openingWidth: 70
};

const fan = {
    x: 400,
    y: 200,
    radius: 40,
    bladeAngle: 0,
    rotationSpeed: 0.05,
    direction: 1, // 1 for right, -1 for left
    switchTimer: 0,
    switchInterval: 180 // frames
};

// Initialize game
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Mouse events
    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    
    // Touch events
    canvas.addEventListener('touchstart', handleStart);
    canvas.addEventListener('touchmove', handleMove);
    canvas.addEventListener('touchend', handleEnd);
    
    gameLoop();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Adjust game objects positions based on canvas size
    const scaleX = canvas.width / 800;
    const scaleY = canvas.height / 600;
    
    hand.x = 100 * scaleX;
    hand.y = canvas.height - 100;
    
    trashCan.x = canvas.width - 200 * scaleX;
    trashCan.y = canvas.height - 150;
    trashCan.openingY = trashCan.y;
    
    fan.x = canvas.width / 2;
    fan.y = 150 * scaleY;
}

function handleStart(e) {
    e.preventDefault();
    if (gameState !== 'aiming') return;
    
    const pos = getInputPosition(e);
    aimStart = { x: pos.x, y: pos.y };
    aimCurrent = { x: pos.x, y: pos.y };
}

function handleMove(e) {
    e.preventDefault();
    if (gameState !== 'aiming' || !aimStart) return;
    
    const pos = getInputPosition(e);
    aimCurrent = { x: pos.x, y: pos.y };
}

function handleEnd(e) {
    e.preventDefault();
    if (gameState !== 'aiming' || !aimStart || !aimCurrent) return;
    
    // Calculate throw force and direction
    const dx = aimStart.x - aimCurrent.x;
    const dy = aimStart.y - aimCurrent.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > MIN_DRAG_DISTANCE) { // Minimum drag distance
        const force = Math.min(distance / 20, MAX_THROW_FORCE);
        const angle = Math.atan2(dy, dx);
        
        // Create paper ball
        paperBall = {
            x: hand.x + hand.width / 2,
            y: hand.y,
            radius: 10,
            vx: Math.cos(angle) * force,
            vy: Math.sin(angle) * force,
            rotation: 0,
            rotationSpeed: 0.2,
            crumplePoints: generateCrumplePoints() // Pre-generate crumple effect
        };
        
        gameState = 'throwing';
    }
    
    aimStart = null;
    aimCurrent = null;
}

function getInputPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

function generateCrumplePoints() {
    // Generate deterministic crumpled paper points
    const points = [];
    const numPoints = 8;
    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const radius = 1 + (Math.sin(i * 2.5) * 0.15); // Deterministic variation
        points.push({ angle, radius });
    }
    return points;
}

function update() {
    // Update fan
    fan.bladeAngle += fan.rotationSpeed;
    fan.switchTimer++;
    
    if (fan.switchTimer >= fan.switchInterval) {
        fan.direction *= -1;
        fan.switchTimer = 0;
    }
    
    // Update paper ball
    if (gameState === 'throwing' && paperBall) {
        // Apply gravity
        paperBall.vy += GRAVITY;
        
        // Apply wind effect from fan
        const distanceToFan = Math.abs(paperBall.y - fan.y);
        if (distanceToFan < WIND_EFFECT_RADIUS && paperBall.y < fan.y + WIND_VERTICAL_RANGE) {
            const windEffect = WIND_STRENGTH * (1 - distanceToFan / WIND_EFFECT_RADIUS);
            paperBall.vx += fan.direction * windEffect;
        }
        
        // Update position
        paperBall.x += paperBall.vx;
        paperBall.y += paperBall.vy;
        paperBall.rotation += paperBall.rotationSpeed;
        
        // Check if ball went into trash can
        if (checkTrashCanCollision()) {
            score++;
            document.getElementById('score-value').textContent = score;
            resetGame();
        }
        
        // Check if ball is out of bounds
        if (paperBall.y > canvas.height + 50 || 
            paperBall.x < -50 || 
            paperBall.x > canvas.width + 50) {
            resetGame();
        }
    }
}

function checkTrashCanCollision() {
    if (!paperBall) return false;
    
    const ballBottom = paperBall.y + paperBall.radius;
    const ballTop = paperBall.y - paperBall.radius;
    const ballLeft = paperBall.x - paperBall.radius;
    const ballRight = paperBall.x + paperBall.radius;
    
    const canLeft = trashCan.x + TRASH_CAN_COLLISION_MARGIN;
    const canRight = trashCan.x + trashCan.width - TRASH_CAN_COLLISION_MARGIN;
    const canTop = trashCan.openingY;
    const canBottom = trashCan.y + trashCan.height;
    
    // Check if ball is entering from top and within horizontal bounds
    if (ballBottom >= canTop && ballTop < canTop + TRASH_CAN_ENTRY_TOLERANCE &&
        paperBall.x >= canLeft && paperBall.x <= canRight &&
        paperBall.vy > 0) {
        return true;
    }
    
    return false;
}

function resetGame() {
    paperBall = null;
    gameState = 'aiming';
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw office background
    drawOffice();
    
    // Draw fan
    drawFan();
    
    // Draw trash can
    drawTrashCan();
    
    // Draw hand
    drawHand();
    
    // Draw paper ball
    if (paperBall) {
        drawPaperBall();
    }
    
    // Draw aim line
    if (gameState === 'aiming' && aimStart && aimCurrent) {
        drawAimLine();
    }
}

function drawOffice() {
    // Sky/Wall gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.6, '#B0D4E8');
    gradient.addColorStop(1, '#D4E8F5');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height - 50);
    
    // Window with frame
    const windowX = canvas.width * 0.7;
    const windowY = 50;
    const windowW = 150;
    const windowH = 200;
    
    // Window frame
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(windowX - 10, windowY - 10, windowW + 20, windowH + 20);
    ctx.fillStyle = '#6FA8DC';
    ctx.fillRect(windowX, windowY, windowW, windowH);
    
    // Window panes
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(windowX + windowW/2, windowY);
    ctx.lineTo(windowX + windowW/2, windowY + windowH);
    ctx.moveTo(windowX, windowY + windowH/2);
    ctx.lineTo(windowX + windowW, windowY + windowH/2);
    ctx.stroke();
    
    // Clouds outside window
    drawCloud(windowX + 40, windowY + 60, 20);
    drawCloud(windowX + 100, windowY + 100, 15);
    
    // Desk
    ctx.fillStyle = '#8B6F47';
    ctx.fillRect(0, canvas.height - 80, canvas.width, 80);
    
    // Desk edge highlight
    ctx.fillStyle = '#A0826D';
    ctx.fillRect(0, canvas.height - 80, canvas.width, 8);
    
    // Desk shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, canvas.height - 72, canvas.width, 5);
    
    // Wood texture lines on desk
    ctx.strokeStyle = 'rgba(101, 67, 33, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 70 + i * 15);
        ctx.lineTo(canvas.width, canvas.height - 70 + i * 15);
        ctx.stroke();
    }
    
    // Office items - coffee mug
    const mugX = 100;
    const mugY = canvas.height - 120;
    ctx.fillStyle = '#8B0000';
    ctx.fillRect(mugX, mugY, 40, 50);
    ctx.fillStyle = '#A52A2A';
    ctx.fillRect(mugX, mugY, 40, 10);
    
    // Mug handle
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(mugX + 40, mugY + 25, 12, -Math.PI/2, Math.PI/2);
    ctx.stroke();
    
    // Steam from coffee
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.6)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(mugX + 10 + i * 10, mugY - 5);
        ctx.quadraticCurveTo(mugX + 15 + i * 10, mugY - 20, mugX + 10 + i * 10, mugY - 35);
        ctx.stroke();
    }
    
    // Pen holder
    const penX = canvas.width - 200;
    const penY = canvas.height - 140;
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(penX, penY, 35, 60);
    ctx.fillStyle = '#5A7FD6';
    ctx.ellipse(penX + 17.5, penY, 17.5, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Pens in holder
    for (let i = 0; i < 3; i++) {
        ctx.fillStyle = ['#FFD700', '#FF6347', '#32CD32'][i];
        ctx.fillRect(penX + 8 + i * 10, penY - 20, 4, 25);
        ctx.beginPath();
        ctx.arc(penX + 10 + i * 10, penY - 20, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawCloud(x, y, size) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.arc(x + size * 0.8, y - size * 0.3, size * 0.7, 0, Math.PI * 2);
    ctx.arc(x + size * 1.3, y, size * 0.8, 0, Math.PI * 2);
    ctx.fill();
}

function drawHand() {
    ctx.save();
    ctx.translate(hand.x + hand.width / 2, hand.y + hand.height / 2);
    
    // Arm/Wrist
    ctx.fillStyle = '#FFD1B3';
    ctx.fillRect(-15, 20, 30, 40);
    
    // Wrist shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(-15, 20, 30, 5);
    
    // Palm with gradient
    const palmGradient = ctx.createRadialGradient(0, 10, 5, 0, 10, 30);
    palmGradient.addColorStop(0, '#FFD1B3');
    palmGradient.addColorStop(1, '#FFC299');
    ctx.fillStyle = palmGradient;
    ctx.beginPath();
    ctx.ellipse(0, 10, 28, 33, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Palm outline
    ctx.strokeStyle = '#E6A57A';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Fingers with better cartoon style
    for (let i = 0; i < 4; i++) {
        const fingerX = -22 + i * 11;
        
        // Finger shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(fingerX + 2, -13, 9, 27);
        
        // Finger
        ctx.fillStyle = '#FFD1B3';
        ctx.fillRect(fingerX, -15, 9, 27);
        
        // Finger outline
        ctx.strokeStyle = '#E6A57A';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(fingerX, -15, 9, 27);
        
        // Finger tip
        ctx.fillStyle = '#FFD1B3';
        ctx.beginPath();
        ctx.arc(fingerX + 4.5, -15, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#E6A57A';
        ctx.stroke();
        
        // Knuckle line
        ctx.strokeStyle = '#E6A57A';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(fingerX, -3);
        ctx.lineTo(fingerX + 9, -3);
        ctx.stroke();
    }
    
    // Thumb with improved style
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.beginPath();
    ctx.arc(-26, 7, 10, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#FFD1B3';
    ctx.beginPath();
    ctx.arc(-28, 5, 10, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#E6A57A';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Thumb knuckle
    ctx.strokeStyle = '#E6A57A';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-32, 10);
    ctx.lineTo(-24, 10);
    ctx.stroke();
    
    ctx.restore();
}

function drawTrashCan() {
    // Shadow under trash can
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.ellipse(trashCan.x + trashCan.width / 2, trashCan.y + trashCan.height + 5, 
                trashCan.width / 2, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Trash can body with gradient
    const canGradient = ctx.createLinearGradient(trashCan.x, 0, trashCan.x + trashCan.width, 0);
    canGradient.addColorStop(0, '#2C3E50');
    canGradient.addColorStop(0.5, '#34495E');
    canGradient.addColorStop(1, '#2C3E50');
    ctx.fillStyle = canGradient;
    
    // Slightly tapered body
    ctx.beginPath();
    ctx.moveTo(trashCan.x + 5, trashCan.y + 10);
    ctx.lineTo(trashCan.x, trashCan.y + trashCan.height);
    ctx.lineTo(trashCan.x + trashCan.width, trashCan.y + trashCan.height);
    ctx.lineTo(trashCan.x + trashCan.width - 5, trashCan.y + 10);
    ctx.closePath();
    ctx.fill();
    
    // Body outline
    ctx.strokeStyle = '#1A252F';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Opening (darker)
    ctx.fillStyle = '#0D1117';
    ctx.fillRect(trashCan.x + 8, trashCan.y, trashCan.openingWidth - 6, 15);
    
    // Rim with 3D effect
    const rimGradient = ctx.createLinearGradient(0, trashCan.y, 0, trashCan.y + 12);
    rimGradient.addColorStop(0, '#4A5F7F');
    rimGradient.addColorStop(0.5, '#34495E');
    rimGradient.addColorStop(1, '#2C3E50');
    ctx.fillStyle = rimGradient;
    
    ctx.beginPath();
    ctx.ellipse(trashCan.x + trashCan.width / 2, trashCan.y + 5, 
                trashCan.width / 2 + 5, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#1A252F';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Recycling symbol with better styling
    ctx.strokeStyle = '#27AE60';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(trashCan.x + trashCan.width / 2, trashCan.y + trashCan.height / 2 + 5, 22, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner circle
    ctx.strokeStyle = '#2ECC71';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(trashCan.x + trashCan.width / 2, trashCan.y + trashCan.height / 2 + 5, 18, 0, Math.PI * 2);
    ctx.stroke();
    
    // Recycling arrows (♻)
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#27AE60';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('♻', trashCan.x + trashCan.width / 2, trashCan.y + trashCan.height / 2 + 5);
    
    // Shine effect on can
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.moveTo(trashCan.x + 10, trashCan.y + 20);
    ctx.lineTo(trashCan.x + 20, trashCan.y + 20);
    ctx.lineTo(trashCan.x + 18, trashCan.y + trashCan.height - 10);
    ctx.lineTo(trashCan.x + 8, trashCan.y + trashCan.height - 10);
    ctx.closePath();
    ctx.fill();
}

function drawFan() {
    ctx.save();
    ctx.translate(fan.x, fan.y);
    
    // Fan base/stand with gradient
    const baseGradient = ctx.createLinearGradient(-12, 0, 12, 0);
    baseGradient.addColorStop(0, '#7F8C8D');
    baseGradient.addColorStop(0.5, '#95A5A6');
    baseGradient.addColorStop(1, '#7F8C8D');
    ctx.fillStyle = baseGradient;
    ctx.fillRect(-12, 0, 24, 65);
    
    // Base outline
    ctx.strokeStyle = '#5D6D6E';
    ctx.lineWidth = 2;
    ctx.strokeRect(-12, 0, 24, 65);
    
    // Base bottom (foot)
    ctx.fillStyle = '#5D6D6E';
    ctx.fillRect(-18, 60, 36, 8);
    ctx.strokeStyle = '#34495E';
    ctx.strokeRect(-18, 60, 36, 8);
    
    // Fan cage/guard (outer circle)
    ctx.strokeStyle = '#7F8C8D';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, fan.radius + 5, 0, Math.PI * 2);
    ctx.stroke();
    
    // Fan circle background
    const fanGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, fan.radius);
    fanGradient.addColorStop(0, '#E8E8E8');
    fanGradient.addColorStop(0.7, '#BDC3C7');
    fanGradient.addColorStop(1, '#95A5A6');
    ctx.fillStyle = fanGradient;
    ctx.beginPath();
    ctx.arc(0, 0, fan.radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#7F8C8D';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Fan blades with rotation
    ctx.rotate(fan.bladeAngle);
    
    for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI * 2) / 3);
        
        // Blade shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(2, -fan.radius / 2, 10, fan.radius / 2 + 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Blade with gradient
        const bladeGradient = ctx.createLinearGradient(-8, 0, 8, 0);
        bladeGradient.addColorStop(0, '#2C3E50');
        bladeGradient.addColorStop(0.5, '#34495E');
        bladeGradient.addColorStop(1, '#2C3E50');
        ctx.fillStyle = bladeGradient;
        ctx.beginPath();
        ctx.ellipse(0, -fan.radius / 2, 10, fan.radius / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Blade outline
        ctx.strokeStyle = '#1A252F';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Blade highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.ellipse(-3, -fan.radius / 2, 4, fan.radius / 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    // Center cap/motor with 3D effect
    const capGradient = ctx.createRadialGradient(-3, -3, 2, 0, 0, 12);
    capGradient.addColorStop(0, '#34495E');
    capGradient.addColorStop(0.7, '#2C3E50');
    capGradient.addColorStop(1, '#1A252F');
    ctx.fillStyle = capGradient;
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#1A252F';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Center screw detail
    ctx.fillStyle = '#95A5A6';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Wind direction indicator with better styling
    ctx.rotate(-fan.bladeAngle);
    
    // Background for indicator
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(0, fan.radius + 38, 18, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = fan.direction > 0 ? '#3498DB' : '#E74C3C';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Arrow
    ctx.fillStyle = fan.direction > 0 ? '#3498DB' : '#E74C3C';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(fan.direction > 0 ? '→' : '←', 0, fan.radius + 38);
    
    ctx.restore();
}

function drawPaperBall() {
    ctx.save();
    ctx.translate(paperBall.x, paperBall.y);
    ctx.rotate(paperBall.rotation);
    
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.beginPath();
    ctx.arc(2, 2, paperBall.radius + 1, 0, Math.PI * 2);
    ctx.fill();
    
    // Paper ball with gradient for 3D effect
    const ballGradient = ctx.createRadialGradient(-3, -3, 2, 0, 0, paperBall.radius);
    ballGradient.addColorStop(0, '#FFFFFF');
    ballGradient.addColorStop(0.5, '#F5F5F5');
    ballGradient.addColorStop(1, '#D3D3D3');
    ctx.fillStyle = ballGradient;
    
    // Crumpled paper effect using pre-generated points
    ctx.beginPath();
    for (let i = 0; i < paperBall.crumplePoints.length; i++) {
        const point = paperBall.crumplePoints[i];
        const x = Math.cos(point.angle) * paperBall.radius * point.radius;
        const y = Math.sin(point.angle) * paperBall.radius * point.radius;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.fill();
    
    // Crumple outline
    ctx.strokeStyle = '#A9A9A9';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Crumple details (wrinkles)
    ctx.strokeStyle = '#C0C0C0';
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(
            Math.cos(angle) * paperBall.radius * 0.6,
            Math.sin(angle) * paperBall.radius * 0.6
        );
        ctx.stroke();
    }
    
    // Paper lines for texture
    ctx.strokeStyle = '#B0B0B0';
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(-paperBall.radius / 2, -paperBall.radius / 2 + i * 5);
        ctx.lineTo(paperBall.radius / 2, -paperBall.radius / 2 + i * 5);
        ctx.stroke();
    }
    
    // Highlight for 3D effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(-paperBall.radius / 3, -paperBall.radius / 3, paperBall.radius / 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

function drawAimLine() {
    const dx = aimCurrent.x - aimStart.x;
    const dy = aimCurrent.y - aimStart.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > MIN_DRAG_DISTANCE) {
        // Draw arrow from hand
        ctx.strokeStyle = '#E74C3C';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        ctx.moveTo(aimStart.x, aimStart.y);
        ctx.lineTo(aimCurrent.x, aimCurrent.y);
        ctx.stroke();
        
        ctx.setLineDash([]);
        
        // Draw arrow head
        const angle = Math.atan2(dy, dx);
        const headLength = 15;
        
        ctx.fillStyle = '#E74C3C';
        ctx.beginPath();
        ctx.moveTo(aimCurrent.x, aimCurrent.y);
        ctx.lineTo(
            aimCurrent.x - headLength * Math.cos(angle - Math.PI / 6),
            aimCurrent.y - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            aimCurrent.x - headLength * Math.cos(angle + Math.PI / 6),
            aimCurrent.y - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
        
        // Power indicator
        const power = Math.min(distance / 20, MAX_THROW_FORCE);
        ctx.fillStyle = 'rgba(231, 76, 60, 0.3)';
        ctx.fillRect(10, canvas.height - 40, (power / MAX_THROW_FORCE) * 200, 20);
        
        ctx.strokeStyle = '#E74C3C';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, canvas.height - 40, 200, 20);
        
        ctx.fillStyle = '#2C3E50';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Força', 10, canvas.height - 45);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game when page loads
window.addEventListener('load', init);
