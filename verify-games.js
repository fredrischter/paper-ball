const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function verifyGame(gamePath, gameName) {
    console.log(`\n=== Verifying ${gameName} ===`);
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 800, height: 600 }
    });
    const page = await context.newPage();
    
    // Listen for console errors
    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });
    
    page.on('pageerror', error => {
        errors.push(error.message);
    });
    
    try {
        const url = gamePath === '.' 
            ? `http://localhost:8080/index.html`
            : `http://localhost:8080/${gamePath}/index.html`;
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        
        // Wait for game to load
        await page.waitForTimeout(3000);
        
        // Check if Phaser loaded
        const phaserLoaded = await page.evaluate(() => {
            return typeof Phaser !== 'undefined';
        });
        
        if (!phaserLoaded) {
            console.log(`❌ FAILED: Phaser not loaded for ${gameName}`);
            console.log('Errors:', errors);
            return false;
        }
        
        // Check if game canvas exists
        const canvasExists = await page.evaluate(() => {
            const canvas = document.querySelector('canvas');
            return canvas !== null;
        });
        
        if (!canvasExists) {
            console.log(`❌ FAILED: No canvas element found for ${gameName}`);
            console.log('Errors:', errors);
            return false;
        }
        
        // Take screenshot
        const screenshotDir = path.join(__dirname, 'verification-screenshots');
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }
        
        const screenshotPath = path.join(screenshotDir, `${gameName}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: false });
        
        if (errors.length > 0) {
            console.log(`⚠️  WARNING: ${gameName} has ${errors.length} console errors:`);
            errors.forEach(err => console.log(`  - ${err}`));
        } else {
            console.log(`✅ SUCCESS: ${gameName} is working correctly`);
        }
        
        console.log(`📸 Screenshot saved to: ${screenshotPath}`);
        
        return errors.length === 0;
        
    } catch (error) {
        console.log(`❌ FAILED: ${gameName} - ${error.message}`);
        console.log('Errors:', errors);
        return false;
    } finally {
        await browser.close();
    }
}

async function main() {
    console.log('🎮 Starting game verification...\n');
    
    const games = [
        { path: '.', name: 'root-game' },
        { path: 'game-poc', name: 'game-poc' },
        { path: 'side-scroller', name: 'side-scroller' },
        { path: 'admin-game', name: 'admin-game' },
        { path: 'tower-defense', name: 'tower-defense' },
        { path: 'physics-adventure', name: 'physics-adventure' },
        { path: 'rpg', name: 'rpg' }
    ];
    
    const results = [];
    
    for (const game of games) {
        const success = await verifyGame(game.path, game.name);
        results.push({ name: game.name, success });
    }
    
    console.log('\n=== VERIFICATION SUMMARY ===');
    results.forEach(({ name, success }) => {
        console.log(`${success ? '✅' : '❌'} ${name}`);
    });
    
    const allPassed = results.every(r => r.success);
    if (allPassed) {
        console.log('\n🎉 All games are working correctly!');
    } else {
        console.log('\n⚠️  Some games have issues - check the logs above');
    }
    
    process.exit(allPassed ? 0 : 1);
}

main().catch(console.error);
