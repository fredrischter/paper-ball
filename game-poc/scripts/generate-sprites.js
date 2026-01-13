#!/usr/bin/env node

/**
 * Sprite Generator - Creates PNG spritesheets from procedural generation
 * This replaces runtime generation with pre-generated assets
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Output directories
const SPRITESHEET_DIR = path.join(__dirname, '../assets/spritesheets');
const IMAGES_DIR = path.join(__dirname, '../assets/images');

// Ensure directories exist
if (!fs.existsSync(SPRITESHEET_DIR)) {
    fs.mkdirSync(SPRITESHEET_DIR, { recursive: true });
}
if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

console.log('🎨 Generating spritesheets...\n');

/**
 * Generate Character Spritesheet
 * 65 frames: 1 stand + 32 walk + 32 jump
 */
function generateCharacterSpritesheet() {
    const frameWidth = 32;
    const frameHeight = 48;
    const framesPerAnimation = 8;
    const totalFrames = 1 + (4 * framesPerAnimation) + (4 * framesPerAnimation); // 65 frames
    
    const canvas = createCanvas(frameWidth * totalFrames, frameHeight);
    const ctx = canvas.getContext('2d');
    
    // Helper to draw character
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
        
        // Legs with animation
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(x + 10, y + 35, 5, 13 - legOffset);
        ctx.fillRect(x + 17, y + 35, 5, 13 + legOffset);
    }
    
    let frameIndex = 0;
    
    // Standing frame
    drawCharacter(frameIndex * frameWidth, 0, '#4169E1', 0);
    frameIndex++;
    
    // Walking frames (8 frames per direction: down, left, right, up)
    for (let dir = 0; dir < 4; dir++) {
        for (let i = 0; i < framesPerAnimation; i++) {
            const x = frameIndex * frameWidth;
            const y = 0;
            const legOffset = Math.sin(i / framesPerAnimation * Math.PI * 2) * 2;
            drawCharacter(x, y, '#4169E1', legOffset);
            frameIndex++;
        }
    }
    
    // Jumping frames (8 frames per direction: down, left, right, up)
    for (let dir = 0; dir < 4; dir++) {
        for (let i = 0; i < framesPerAnimation; i++) {
            const x = frameIndex * frameWidth;
            const y = 0;
            const jumpOffset = -Math.abs(Math.sin(i / framesPerAnimation * Math.PI)) * 10;
            drawCharacter(x, y + jumpOffset, '#4169E1', 0);
            frameIndex++;
        }
    }
    
    // Save to file
    const buffer = canvas.toBuffer('image/png');
    const filename = path.join(SPRITESHEET_DIR, 'character.png');
    fs.writeFileSync(filename, buffer);
    console.log(`✓ Generated character.png (${frameWidth * totalFrames}x${frameHeight}, ${totalFrames} frames)`);
}

/**
 * Generate UI Buttons Spritesheet
 * Frames: 0-Menu, 1-Sound, 2-DpadUp, 3-DpadDown, 4-DpadLeft, 5-DpadRight, 6-Action
 */
function generateUIButtonsSpritesheet() {
    const buttonSize = 64;
    const buttonCount = 7;
    
    const canvas = createCanvas(buttonSize * buttonCount, buttonSize);
    const ctx = canvas.getContext('2d');
    
    // Menu button (hamburger)
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, buttonSize, buttonSize);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, buttonSize - 4, buttonSize - 4);
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 3; i++) {
        ctx.fillRect(16, 20 + i * 12, 32, 4);
    }
    
    // Sound button
    ctx.fillStyle = '#444';
    ctx.fillRect(buttonSize, 0, buttonSize, buttonSize);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.strokeRect(buttonSize + 2, 2, buttonSize - 4, buttonSize - 4);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(buttonSize + 25, 32, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(buttonSize + 32, 24, 12, 16);
    
    // D-pad arrows
    const dpadColors = ['#333', '#333', '#333', '#333'];
    const dpadX = [2, 3, 4, 5];
    
    dpadX.forEach((frameIdx, idx) => {
        const x = frameIdx * buttonSize;
        ctx.fillStyle = dpadColors[idx];
        ctx.fillRect(x, 0, buttonSize, buttonSize);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 2, 2, buttonSize - 4, buttonSize - 4);
        
        // Draw arrow
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        if (idx === 0) { // Up
            ctx.moveTo(x + 32, 20);
            ctx.lineTo(x + 42, 40);
            ctx.lineTo(x + 22, 40);
        } else if (idx === 1) { // Down
            ctx.moveTo(x + 32, 44);
            ctx.lineTo(x + 42, 24);
            ctx.lineTo(x + 22, 24);
        } else if (idx === 2) { // Left
            ctx.moveTo(x + 20, 32);
            ctx.lineTo(x + 40, 42);
            ctx.lineTo(x + 40, 22);
        } else { // Right
            ctx.moveTo(x + 44, 32);
            ctx.lineTo(x + 24, 42);
            ctx.lineTo(x + 24, 22);
        }
        ctx.fill();
    });
    
    // Action button
    const actionX = 6 * buttonSize;
    ctx.fillStyle = '#555';
    ctx.fillRect(actionX, 0, buttonSize, buttonSize);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.strokeRect(actionX + 2, 2, buttonSize - 4, buttonSize - 4);
    ctx.beginPath();
    ctx.arc(actionX + 32, 32, 20, 0, Math.PI * 2);
    ctx.stroke();
    
    const buffer = canvas.toBuffer('image/png');
    const filename = path.join(SPRITESHEET_DIR, 'ui-buttons.png');
    fs.writeFileSync(filename, buffer);
    console.log(`✓ Generated ui-buttons.png (${buttonSize * buttonCount}x${buttonSize}, ${buttonCount} frames)`);
}

/**
 * Generate Popup Buttons Spritesheet
 * Frame 0: OK button, Frame 1: Cancel button
 */
function generatePopupButtonsSpritesheet() {
    const buttonWidth = 90;
    const buttonHeight = 50;
    
    const canvas = createCanvas(buttonWidth * 2, buttonHeight);
    const ctx = canvas.getContext('2d');
    
    // OK button (green)
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(0, 0, buttonWidth, buttonHeight);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, buttonWidth - 2, buttonHeight - 2);
    
    // Cancel button (red)
    ctx.fillStyle = '#f44336';
    ctx.fillRect(buttonWidth, 0, buttonWidth, buttonHeight);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(buttonWidth + 1, 1, buttonWidth - 2, buttonHeight - 2);
    
    const buffer = canvas.toBuffer('image/png');
    const filename = path.join(SPRITESHEET_DIR, 'popup-buttons.png');
    fs.writeFileSync(filename, buffer);
    console.log(`✓ Generated popup-buttons.png (${buttonWidth * 2}x${buttonHeight}, 2 frames)`);
}

/**
 * Generate Square Doll Sprite
 */
function generateSquareDollSprite() {
    const size = 50;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#FF6B6B');
    gradient.addColorStop(1, '#C92A2A');
    ctx.fillStyle = gradient;
    ctx.fillRect(5, 5, 40, 40);
    
    // Border
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(5, 5, 40, 40);
    
    // Face
    ctx.fillStyle = '#000';
    ctx.fillRect(15, 15, 5, 5); // Left eye
    ctx.fillRect(30, 15, 5, 5); // Right eye
    ctx.fillRect(15, 30, 20, 3); // Mouth
    
    const buffer = canvas.toBuffer('image/png');
    const filename = path.join(IMAGES_DIR, 'square-doll.png');
    fs.writeFileSync(filename, buffer);
    console.log(`✓ Generated square-doll.png (${size}x${size})`);
}

/**
 * Generate Stage Backgrounds
 */
function generateStageBackgrounds() {
    const width = 800;
    const height = 600;
    
    const stages = [
        { name: 'stage1-bg', color1: '#2d5a3d', color2: '#1a3d2d' },
        { name: 'stage2-bg', color1: '#5a3d2d', color2: '#3d2d1a' },
        { name: 'stage3-bg', color1: '#3d2d5a', color2: '#2d1a3d' }
    ];
    
    stages.forEach(stage => {
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        
        // Gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, stage.color1);
        gradient.addColorStop(1, stage.color2);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Decorative elements
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = Math.random() * (height - 100);
            const size = Math.random() * 30 + 10;
            ctx.fillRect(x, y, size, size);
        }
        
        const buffer = canvas.toBuffer('image/png');
        const filename = path.join(IMAGES_DIR, `${stage.name}.png`);
        fs.writeFileSync(filename, buffer);
        console.log(`✓ Generated ${stage.name}.png (${width}x${height})`);
    });
}

/**
 * Generate Popup Background
 */
function generatePopupBackground() {
    const width = 500;
    const height = 300;
    
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Background with border
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, width - 4, height - 4);
    
    // Inner decoration
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(10, 10, width - 20, height - 20);
    
    const buffer = canvas.toBuffer('image/png');
    const filename = path.join(IMAGES_DIR, 'popup-bg.png');
    fs.writeFileSync(filename, buffer);
    console.log(`✓ Generated popup-bg.png (${width}x${height})`);
}

/**
 * Generate Interstitial Image
 */
function generateInterstitial() {
    const width = 800;
    const height = 600;
    
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Radial gradient
    const gradient = ctx.createRadialGradient(400, 300, 50, 400, 300, 400);
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(0.5, '#FFA500');
    gradient.addColorStop(1, '#FF6347');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Stage Transition', 400, 280);
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Loading...', 400, 340);
    
    const buffer = canvas.toBuffer('image/png');
    const filename = path.join(IMAGES_DIR, 'interstitial.png');
    fs.writeFileSync(filename, buffer);
    console.log(`✓ Generated interstitial.png (${width}x${height})`);
}

// Generate all sprites
try {
    generateCharacterSpritesheet();
    generateUIButtonsSpritesheet();
    generatePopupButtonsSpritesheet();
    generateSquareDollSprite();
    generateStageBackgrounds();
    generatePopupBackground();
    generateInterstitial();
    
    console.log('\n✅ All spritesheets generated successfully!');
    console.log(`\n📁 Spritesheets: ${SPRITESHEET_DIR}`);
    console.log(`📁 Images: ${IMAGES_DIR}`);
} catch (error) {
    console.error('\n❌ Error generating spritesheets:', error.message);
    process.exit(1);
}
