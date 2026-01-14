const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testGame(gamePath, gameName) {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1024, height: 768 } });
    const page = await context.newPage();
    
    const fullPath = gamePath === '.' ? __dirname : path.join(__dirname, gamePath);
    const fileUrl = `file://${fullPath}/index.html`;
    
    console.log(`Testing ${gameName}...`);
    console.log(`URL: ${fileUrl}`);
    
    try {
        // Navigate to the game
        await page.goto(fileUrl, { waitUntil: 'networkidle', timeout: 30000 });
        
        // Wait for game to load
        await page.waitForTimeout(3000);
        
        // Take screenshot
        const screenshotPath = `/tmp/${gameName}-screenshot.png`;
        await page.screenshot({ path: screenshotPath, fullPage: false });
        console.log(`✅ ${gameName} - Screenshot saved to ${screenshotPath}`);
        
        // Check for errors in console
        const errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });
        
        await page.waitForTimeout(2000);
        
        if (errors.length > 0) {
            console.log(`⚠️  ${gameName} - Console errors found:`);
            errors.forEach(err => console.log(`   - ${err}`));
        }
        
        return { success: true, screenshot: screenshotPath };
    } catch (error) {
        console.log(`❌ ${gameName} - Error: ${error.message}`);
        return { success: false, error: error.message };
    } finally {
        await browser.close();
    }
}

async function main() {
    const games = [
        { path: '.', name: 'root-game' },
        { path: 'game-poc', name: 'game-poc' },
        { path: 'side-scroller', name: 'side-scroller' },
        { path: 'admin-game', name: 'admin-game' },
        { path: 'tower-defense', name: 'tower-defense' },
        { path: 'physics-adventure', name: 'physics-adventure' },
        { path: 'rpg', name: 'rpg' }
    ];
    
    console.log('Testing all games...\n');
    
    const results = [];
    for (const game of games) {
        const result = await testGame(game.path, game.name);
        results.push({ ...game, ...result });
        console.log('');
    }
    
    console.log('\n=== SUMMARY ===');
    results.forEach(r => {
        const status = r.success ? '✅ WORKING' : '❌ FAILED';
        console.log(`${status} - ${r.name}`);
        if (r.screenshot) {
            console.log(`   Screenshot: ${r.screenshot}`);
        }
        if (r.error) {
            console.log(`   Error: ${r.error}`);
        }
    });
}

main().catch(console.error);
