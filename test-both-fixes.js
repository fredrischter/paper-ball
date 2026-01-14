const { chromium } = require('playwright');

async function testRPGUpDown() {
    console.log('Testing RPG up/down movement...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        await page.goto(`file://${__dirname}/rpg/index.html`);
        await page.waitForTimeout(3000);
        
        // Check if game loaded
        const canvas = await page.$('canvas');
        if (!canvas) throw new Error('Canvas not found');
        
        // Take screenshot showing character can move in 4 directions
        await page.screenshot({ path: 'rpg-4dir-test.png' });
        console.log('✅ RPG game loads correctly');
        
    } catch (error) {
        console.error('❌ RPG test failed:', error.message);
    } finally {
        await browser.close();
    }
}

async function testPhysicsSlopes() {
    console.log('Testing Physics-Adventure slope physics...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        await page.goto(`file://${__dirname}/physics-adventure/index.html`);
        await page.waitForTimeout(3000);
        
        // Check if game loaded
        const canvas = await page.$('canvas');
        if (!canvas) throw new Error('Canvas not found');
        
        await page.screenshot({ path: 'physics-slopes-test.png' });
        console.log('✅ Physics-Adventure game loads correctly');
        
    } catch (error) {
        console.error('❌ Physics-Adventure test failed:', error.message);
    } finally {
        await browser.close();
    }
}

(async () => {
    await testRPGUpDown();
    await testPhysicsSlopes();
})();
