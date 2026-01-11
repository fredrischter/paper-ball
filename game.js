// Game constants
const GRAVITY = 0.5;
const WIND_STRENGTH = 0.3;
const WIND_EFFECT_RADIUS = 150;
const WIND_VERTICAL_RANGE = 50;
const TRASH_CAN_COLLISION_MARGIN = 5;
const TRASH_CAN_ENTRY_TOLERANCE = 20;

// Animation constants
const HAND_CYCLE_TIME = 4; // seconds
const THROW_INITIAL_VY = -15; // Initial upward velocity

// Game state
let canvas, ctx;
let score = 0;
let gameState = 'ready'; // ready, throwing, scoring
let paperBall = null;
let time = 0; // Game time in seconds
let canShoot = true;

// Animation state
let trashCanLid = {
    isOpen: false,
    openAmount: 0, // 0 to 1
    shakeOffset: 0,
    shakeIntensity: 0
};

// Game objects
const hand = {
    x: 0,
    y: 0,
    width: 60,
    height: 80,
    cycleTime: HAND_CYCLE_TIME,
    minX: 100,
    maxX: 700
};

const trashCan = {
    x: 0,
    y: 0,
    width: 80,
    height: 100,
    openingY: 0,
    openingWidth: 70
};

const fan = {
    x: 0,
    y: 200,
    radius: 40,
    bladeAngle: 0,
    rotationSpeed: 0.1,
    direction: 1 // 1 for right, -1 for left
};

// Sound generation (Web Audio API)
let audioContext = null;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSuccessSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Initialize game
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Single button input
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleClick);
    
    gameLoop();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Position fan at fixed position (relative to screen)
    fan.x = canvas.width * 0.5;
    fan.y = canvas.height * 0.25;
    
    // Position trash can below fan
    trashCan.x = canvas.width / 2 - trashCan.width / 2;
    trashCan.y = canvas.height - canvas.height * 0.25;
    trashCan.openingY = trashCan.y;
    
    // Set hand movement range (relative coordinates)
    hand.minX = canvas.width * 0.15;
    hand.maxX = canvas.width * 0.85;
    hand.y = canvas.height - canvas.height * 0.15;
}

function handleClick(e) {
    e.preventDefault();
    
    // Initialize audio on first click
    if (!audioContext) {
        initAudio();
    }
    
    if (gameState === 'ready' && canShoot) {
        shootBall();
    }
}

function shootBall() {
    canShoot = false;
    gameState = 'throwing';
    
    // Create paper ball at hand position
    paperBall = {
        x: hand.x + hand.width / 2,
        y: hand.y,
        radius: 10,
        vx: 0, // No initial horizontal velocity
        vy: THROW_INITIAL_VY,
        rotation: 0,
        rotationSpeed: 0.2,
        crumplePoints: generateCrumplePoints()
    };
}

function generateCrumplePoints() {
    const points = [];
    const numPoints = 8;
    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const radius = 1 + (Math.sin(i * 2.5) * 0.15);
        points.push({ angle, radius });
    }
    return points;
}

function update(deltaTime) {
    time += deltaTime;
    
    // Fan stays stationary but blades rotate
    fan.bladeAngle += fan.rotationSpeed;
    
    // Update hand position using sine wave for smooth oscillation
    const handCycleProgress = (time / hand.cycleTime) * Math.PI * 2;
    const handRange = hand.maxX - hand.minX;
    hand.x = hand.minX + (handRange / 2) + Math.sin(handCycleProgress) * (handRange / 2);
    
    // Update paper ball
    if (gameState === 'throwing' && paperBall) {
        // Apply gravity
        paperBall.vy += GRAVITY;
        
        // Apply wind effect from fan only when ball is vertically in front of fan
        const verticalDistance = Math.abs(paperBall.y - fan.y);
        const horizontalDistance = Math.abs(paperBall.x - fan.x);
        
        // Wind only affects ball when it's in the vertical range in front of the fan
        if (verticalDistance < WIND_VERTICAL_RANGE && horizontalDistance < WIND_EFFECT_RADIUS) {
            const windEffect = WIND_STRENGTH * (1 - horizontalDistance / WIND_EFFECT_RADIUS);
            // Wind blows left or right based on fan direction
            paperBall.vx += windEffect * fan.direction;
        }
        
        // Update position
        paperBall.x += paperBall.vx;
        paperBall.y += paperBall.vy;
        paperBall.rotation += paperBall.rotationSpeed;
        
        // Check if ball hit trash can
        if (checkTrashCanCollision()) {
            score++;
            document.getElementById('score-value').textContent = score;
            startScoringAnimation();
            paperBall = null;
        }
        
        // Check if ball is out of bounds
        if (paperBall && (paperBall.y > canvas.height + 50 || 
            paperBall.x < -50 || 
            paperBall.x > canvas.width + 50)) {
            resetGame();
        }
    }
    
    // Update trash can lid animation
    if (trashCanLid.isOpen) {
        trashCanLid.openAmount = Math.min(1, trashCanLid.openAmount + 0.1);
        
        if (trashCanLid.shakeIntensity > 0) {
            trashCanLid.shakeOffset = Math.sin(time * 50) * trashCanLid.shakeIntensity;
            trashCanLid.shakeIntensity *= 0.95;
        }
        
        // Close lid after animation
        if (trashCanLid.openAmount >= 1 && trashCanLid.shakeIntensity < 0.5) {
            setTimeout(() => {
                trashCanLid.isOpen = false;
                trashCanLid.openAmount = 0;
                resetGame();
            }, 500);
        }
    }
}

function checkTrashCanCollision() {
    if (!paperBall) return false;
    
    const ballBottom = paperBall.y + paperBall.radius;
    const ballTop = paperBall.y - paperBall.radius;
    
    const canLeft = trashCan.x + TRASH_CAN_COLLISION_MARGIN;
    const canRight = trashCan.x + trashCan.width - TRASH_CAN_COLLISION_MARGIN;
    const canTop = trashCan.openingY;
    
    // Check if ball is entering from top and within horizontal bounds
    if (ballBottom >= canTop && ballTop < canTop + TRASH_CAN_ENTRY_TOLERANCE &&
        paperBall.x >= canLeft && paperBall.x <= canRight &&
        paperBall.vy > 0) {
        return true;
    }
    
    return false;
}

function startScoringAnimation() {
    gameState = 'scoring';
    trashCanLid.isOpen = true;
    trashCanLid.openAmount = 0;
    trashCanLid.shakeIntensity = 5;
    playSuccessSound();
}

function resetGame() {
    gameState = 'ready';
    paperBall = null;
    canShoot = true;
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
}

function drawOffice() {
    // Sky/Wall gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.6, '#B0D4E8');
    gradient.addColorStop(1, '#D4E8F5');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height - canvas.height * 0.1);
    
    // Window with frame (responsive positioning)
    const windowX = canvas.width * 0.7;
    const windowY = canvas.height * 0.08;
    const windowW = canvas.width * 0.18;
    const windowH = canvas.height * 0.3;
    
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
    drawCloud(windowX + windowW * 0.3, windowY + windowH * 0.3, windowW * 0.13);
    drawCloud(windowX + windowW * 0.7, windowY + windowH * 0.5, windowW * 0.1);
    
    // Desk (clean, minimal)
    const deskHeight = canvas.height * 0.1;
    ctx.fillStyle = '#8B6F47';
    ctx.fillRect(0, canvas.height - deskHeight, canvas.width, deskHeight);
    
    // Desk edge highlight
    ctx.fillStyle = '#A0826D';
    ctx.fillRect(0, canvas.height - deskHeight, canvas.width, deskHeight * 0.1);
    
    // Desk shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, canvas.height - deskHeight * 0.9, canvas.width, deskHeight * 0.06);
    
    // Minimal wood texture lines on desk
    ctx.strokeStyle = 'rgba(101, 67, 33, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - deskHeight * 0.8 + i * deskHeight * 0.25);
        ctx.lineTo(canvas.width, canvas.height - deskHeight * 0.8 + i * deskHeight * 0.25);
        ctx.stroke();
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
    ctx.save();
    
    // Apply shake effect
    if (trashCanLid.shakeIntensity > 0) {
        ctx.translate(trashCanLid.shakeOffset, 0);
    }
    
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
    
    // Animated lid
    if (trashCanLid.isOpen) {
        // Open lid tilted
        const lidTilt = trashCanLid.openAmount * Math.PI / 4;
        ctx.save();
        ctx.translate(trashCan.x + trashCan.width - 10, trashCan.y + 5);
        ctx.rotate(lidTilt);
        
        // Lid
        const rimGradient = ctx.createLinearGradient(0, 0, 0, 12);
        rimGradient.addColorStop(0, '#4A5F7F');
        rimGradient.addColorStop(0.5, '#34495E');
        rimGradient.addColorStop(1, '#2C3E50');
        ctx.fillStyle = rimGradient;
        
        ctx.beginPath();
        ctx.ellipse(0, 0, trashCan.width / 2 + 5, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#1A252F';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
    } else {
        // Closed lid
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
    }
    
    // Opening (darker when open)
    if (!trashCanLid.isOpen) {
        ctx.fillStyle = '#0D1117';
        ctx.fillRect(trashCan.x + 8, trashCan.y, trashCan.openingWidth - 6, 15);
    }
    
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
    ctx.font = 'bold 28px "Comic Sans MS", Arial';
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
    
    ctx.restore();
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

let lastTime = 0;
function gameLoop(currentTime = 0) {
    const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
    lastTime = currentTime;
    
    if (deltaTime < 0.1) { // Cap delta time to avoid huge jumps
        update(deltaTime);
    }
    
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game when page loads
window.addEventListener('load', init);
