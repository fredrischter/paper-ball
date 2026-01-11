// Responsive Paper Ball Game with Cartoon Hand and Stationary Animated Fan
// Keep all logic responsive to canvas, hand uses sine oscillation, fan is fixed but animates
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;

// Responsive resize
function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Game objects
const gravity = 0.003; // relative gravity per ms
let lastTimestamp = null;

// Hand parameters
const handRange = 0.3; // fraction of canvas width
const handYOffset = 0.22; // fraction of canvas height from bottom
const handWidth = 0.13;
const handHeight = 0.09;
let handOscTime = 0; // ms

// Fan parameters
const fanWidth = 0.11;
const fanHeight = 0.12;
const fanYOffset = 0.16;
const fanXPos = 0.75; // Fraction of width (fixed X)
let fanAngle = 0;

// Ball parameters
let ballRadius = 0.033;
let ball = null;

// Fan wind effect
const windStrength = 0.0017; // px/ms^2 (scales further with fan power and proximity)
let fanOn = false;

// Util
function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(val, a, b){ return Math.max(a, Math.min(b, val)); }

// Input
canvas.addEventListener('click', shootBall);
canvas.addEventListener('touchstart', shootBall);

// Remove any auto-rightward vx, only wind changes vx
function shootBall() {
  if (!ball || ball.launched) return;
  ball.vx = 0;
  ball.vy = -0.02 * height; // shot upward
  ball.launched = true;
}

function respawnBall() {
  // Start above hand
  const hand = getHandParams();
  ball = {
    x: hand.x + hand.w / 2 - ballRadius * width / 2,
    y: hand.y - ballRadius * height,
    vx: 0,
    vy: 0,
    launched: false
  };
}

function getHandParams() {
  // Sine oscillation in horizontal range
  const t = handOscTime;
  const center = width * 0.5;
  const range = width * handRange * 0.5;
  const period = 2300; // ms for a full cycle
  const handX = center + Math.sin((2 * Math.PI * t) / period) * range - width * handWidth / 2;
  return {
    x: handX,
    y: height - height * handYOffset - height * handHeight,
    w: width * handWidth,
    h: height * handHeight
  };
}

function getFanParams() {
  return {
    x: width * fanXPos - width * fanWidth / 2,
    y: height * fanYOffset,
    w: width * fanWidth,
    h: height * fanHeight
  };
}

function updateBall(dt) {
  if (!ball.launched) return;
  // Gravity only up/down
  ball.vy += gravity * height * dt;

  // Wind if in fan area
  const fan = getFanParams();
  const ballInFanZone = 
    ball.y + ballRadius * height > fan.y &&
    ball.y < fan.y + fan.h &&
    ball.x + ballRadius * width > fan.x &&
    ball.x < fan.x + fan.w;
  if (fanOn && ballInFanZone) {
    // Proximity: more wind near fan center
    const cx = fan.x + fan.w / 2;
    const dx = (ball.x + ballRadius * width/2) - cx;
    const wind = lerp(
      windStrength * width,
      windStrength * width * 1.35, 
      1 - Math.abs(dx) / (fan.w/2)
    );
    // Wind direction: right if fan blades spinning CCW, left if CW (random but usually right)
    ball.vx += wind * dt * (fanAngle % (2*Math.PI) < Math.PI ? 1 : -1);
  }

  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;

  // Floor and ceiling bounds
  if (ball.y + ballRadius * height > height) {
    ball.y = height - ballRadius * height;
    ball.vy = 0;
    ball.vx = 0;
    ball.launched = false;
  }
  // Left/right bounds
  if (ball.x < 0) ball.x = 0;
  if (ball.x + ballRadius * width > width) ball.x = width - ballRadius * width;
}

// Visuals
function drawCartoonHand(params) {
  const {x, y, w, h} = params;
  // Palm
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(x + w*0.58, y + h*0.66, w*0.37, h*0.34, -0.08, 0, Math.PI*2);
  ctx.fillStyle = ctx.createLinearGradient(x, y, x, y+h);
  ctx.fillStyle.addColorStop(0, '#ffe4b5');
  ctx.fillStyle.addColorStop(1, '#e6c098');
  ctx.fill();

  // Shadow
  ctx.beginPath();
  ctx.ellipse(x + w*0.64, y + h*0.8, w*0.22, h*0.18, -0.16, 0, Math.PI*2);
  ctx.fillStyle = 'rgba(160,130,60,0.17)';
  ctx.fill();

  // Fingers
  for(let i=0;i<4;i++) {
    let fx = x + w*0.19 + w*0.19*i;
    let fy = y + h*0.17 - h*0.092*Math.sin(i*0.8+1);
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(fx, fy, w*0.14, h*0.28, 0.04-Math.PI*0.04*i, 0, Math.PI*2);
    ctx.fillStyle = ctx.createLinearGradient(x, y, x, y+h);
    ctx.fillStyle.addColorStop(0, '#ffe4b5');
    ctx.fillStyle.addColorStop(1, '#e6c098');
    ctx.fill();
    ctx.restore();
  }
  // Outline
  ctx.lineWidth = Math.max(2, w*0.05);
  ctx.strokeStyle = '#af9165';
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.ellipse(x + w*0.58, y + h*0.66, w*0.37, h*0.34, -0.08, 0, Math.PI*2);
  for(let i=0;i<4;i++) {
    let fx = x + w*0.19 + w*0.19*i;
    let fy = y + h*0.17 - h*0.092*Math.sin(i*0.8+1);
    ctx.moveTo(fx, fy);
    ctx.ellipse(fx, fy, w*0.14, h*0.28, 0.04-Math.PI*0.04*i, 0, Math.PI*2);
  }
  ctx.stroke();
  ctx.restore();
}

function drawAnimatedFan(params, t) {
  const {x, y, w, h} = params;
  ctx.save();
  // Fan stand
  ctx.beginPath();
  ctx.moveTo(x + w/2, y + h*0.99);
  ctx.lineTo(x + w/2, y+h*1.21);
  ctx.lineWidth = w*0.13;
  ctx.strokeStyle = '#888';
  ctx.stroke();

  // Fan body
  ctx.beginPath();
  ctx.ellipse(x + w/2, y+h*0.53, w*0.43, h*0.39, 0, 0, Math.PI*2);
  ctx.fillStyle = 'white';
  ctx.shadowColor = '#7bf';
  ctx.shadowBlur = w*0.06;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = w*0.05;
  ctx.stroke();

  // Blades animate in place (no X movement!)
  for (let i = 0; i < 4; i++) {
    ctx.save();
    ctx.translate(x + w/2, y + h*0.53);
    ctx.rotate(fanAngle + i * Math.PI/2);
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.quadraticCurveTo(w*0.24, h*0.10, w*0.29, 0);
    ctx.quadraticCurveTo(w*0.18, -h*0.10, 0,0);
    ctx.closePath();
    ctx.fillStyle = i%2 == 0 ? '#bdf' : '#e8f8fd';
    ctx.globalAlpha = 0.73;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // Center hub
  ctx.beginPath();
  ctx.arc(x + w/2, y + h*0.53, w*0.11, 0, 2*Math.PI);
  ctx.fillStyle = '#ccc';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + w/2, y + h*0.53, w*0.05, 0, 2*Math.PI);
  ctx.fillStyle = '#999';
  ctx.fill();
  ctx.restore();
}

function drawBall() {
  ctx.save();
  ctx.beginPath();
  ctx.arc(ball.x + ballRadius * width/2, ball.y + ballRadius * height/2, ballRadius * width/2, 0, 2 * Math.PI);
  ctx.fillStyle = ctx.createRadialGradient(
    ball.x + ballRadius * width/2, ball.y + ballRadius * height/2, ballRadius * width/12,
    ball.x + ballRadius * width/2, ball.y + ballRadius * height/2, ballRadius * width/2
  );
  ctx.fillStyle.addColorStop(0, '#fff');
  ctx.fillStyle.addColorStop(1, '#aecfed');
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#4e86a0';
  ctx.globalAlpha = 0.7;
  ctx.stroke();
  ctx.restore();
}

function clearBG() {
  // Simple paper border
  ctx.fillStyle = '#f1f4f9';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#c2c8cd';
  ctx.lineWidth = Math.max(3, width * 0.008);
  ctx.strokeRect(width*0.02, height*0.02, width*0.96, height*0.96);
}

function drawScene(t) {
  clearBG();
  const hand = getHandParams();
  drawCartoonHand(hand);
  drawAnimatedFan(getFanParams(), t);
  if (ball) drawBall();
  // Omit all clutter/other desk items!
}

function loop(ts) {
  if (!lastTimestamp) lastTimestamp = ts;
  let dt = Math.min(ts - lastTimestamp, 45);
  handOscTime += dt;
  fanAngle += (fanOn ? 0.0038 : 0.0013)*dt;
  fanOn = true; // Fan always on
  updateBall(dt);
  drawScene(ts);
  lastTimestamp = ts;
  requestAnimationFrame(loop);
}

// Initialize
respawnBall();
requestAnimationFrame(loop);