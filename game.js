// Game constants
const GRAVITY = 0.5;
const WIND_STRENGTH = 0.3;
const MAX_THROW_FORCE = 20;

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
    
    if (distance > 10) { // Minimum drag distance
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
            rotationSpeed: 0.2
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
        if (distanceToFan < 150 && paperBall.y < fan.y + 50) {
            const windEffect = WIND_STRENGTH * (1 - distanceToFan / 150);
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
    
    const canLeft = trashCan.x + 5;
    const canRight = trashCan.x + trashCan.width - 5;
    const canTop = trashCan.openingY;
    const canBottom = trashCan.y + trashCan.height;
    
    // Check if ball is entering from top and within horizontal bounds
    if (ballBottom >= canTop && ballTop < canTop + 20 &&
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
    // Floor
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    
    // Floor line
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 50);
    ctx.lineTo(canvas.width, canvas.height - 50);
    ctx.stroke();
    
    // Desk
    ctx.fillStyle = '#A0826D';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 10);
}

function drawHand() {
    ctx.save();
    ctx.translate(hand.x + hand.width / 2, hand.y + hand.height / 2);
    
    // Palm
    ctx.fillStyle = '#FDBCB4';
    ctx.beginPath();
    ctx.ellipse(0, 10, 25, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Fingers
    for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#FDBCB4';
        ctx.fillRect(-20 + i * 10, -15, 8, 25);
        
        // Finger tips
        ctx.beginPath();
        ctx.arc(-16 + i * 10, -15, 4, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Thumb
    ctx.beginPath();
    ctx.arc(-25, 5, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

function drawTrashCan() {
    // Trash can body
    ctx.fillStyle = '#2C3E50';
    ctx.fillRect(trashCan.x, trashCan.y + 10, trashCan.width, trashCan.height - 10);
    
    // Opening
    ctx.fillStyle = '#1A252F';
    ctx.fillRect(trashCan.x + 5, trashCan.y, trashCan.openingWidth, 15);
    
    // Rim
    ctx.fillStyle = '#34495E';
    ctx.fillRect(trashCan.x - 5, trashCan.y, trashCan.width + 10, 10);
    
    // Recycling symbol
    ctx.strokeStyle = '#27AE60';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(trashCan.x + trashCan.width / 2, trashCan.y + trashCan.height / 2, 20, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#27AE60';
    ctx.textAlign = 'center';
    ctx.fillText('♻', trashCan.x + trashCan.width / 2, trashCan.y + trashCan.height / 2 + 8);
}

function drawFan() {
    ctx.save();
    ctx.translate(fan.x, fan.y);
    
    // Fan base
    ctx.fillStyle = '#95A5A6';
    ctx.fillRect(-10, 0, 20, 60);
    
    // Fan circle
    ctx.fillStyle = '#BDC3C7';
    ctx.beginPath();
    ctx.arc(0, 0, fan.radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#7F8C8D';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Fan blades
    ctx.rotate(fan.bladeAngle);
    ctx.fillStyle = '#34495E';
    
    for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI * 2) / 3);
        ctx.beginPath();
        ctx.ellipse(0, -fan.radius / 2, 8, fan.radius / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    // Center cap
    ctx.fillStyle = '#2C3E50';
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Wind direction indicator
    ctx.rotate(-fan.bladeAngle);
    ctx.fillStyle = fan.direction > 0 ? '#3498DB' : '#E74C3C';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(fan.direction > 0 ? '→' : '←', 0, fan.radius + 30);
    
    ctx.restore();
}

function drawPaperBall() {
    ctx.save();
    ctx.translate(paperBall.x, paperBall.y);
    ctx.rotate(paperBall.rotation);
    
    // Paper ball
    ctx.fillStyle = '#ECF0F1';
    ctx.strokeStyle = '#BDC3C7';
    ctx.lineWidth = 2;
    
    // Crumpled paper effect
    ctx.beginPath();
    const points = 8;
    for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const radius = paperBall.radius + (Math.random() * 3 - 1.5);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Paper lines
    ctx.strokeStyle = '#95A5A6';
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(-paperBall.radius / 2, -paperBall.radius / 2 + i * 5);
        ctx.lineTo(paperBall.radius / 2, -paperBall.radius / 2 + i * 5);
        ctx.stroke();
    }
    
    ctx.restore();
}

function drawAimLine() {
    const dx = aimCurrent.x - aimStart.x;
    const dy = aimCurrent.y - aimStart.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 10) {
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
