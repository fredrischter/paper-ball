const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const POC_GAMES = [
  { name: 'side-scroller', title: 'Side-Scroller (Horizontal Platformer with Collectables)' },
  { name: 'admin-game', title: 'Admin-Game (Element Management System)' },
  { name: 'tower-defense', title: 'Tower-Defense (Strategic Tower Placement)' },
  { name: 'physics-adventure', title: 'Physics-Adventure (Momentum Platformer)' },
  { name: 'rpg', title: 'RPG (Story-Driven with Dialogs and NPCs)' }
];

async function generateScreenshot(browser, gameName, gameTitle) {
  console.log(`\n📸 Generating screenshot for: ${gameName}`);
  
  const context = await browser.newContext({
    viewport: { width: 800, height: 600 }
  });
  
  const page = await context.newPage();
  
  // Start local server
  const { spawn } = require('child_process');
  const server = spawn('npx', ['http-server', '-p', '8080', '--silent'], {
    cwd: path.join(__dirname, gameName),
    stdio: 'ignore'
  });
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    // Navigate to game
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle', timeout: 10000 });
    
    // Wait for Phaser to load
    await page.waitForTimeout(3000);
    
    // Take screenshot
    const screenshotPath = path.join(__dirname, 'poc-screenshots', `${gameName}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    
    console.log(`✅ Screenshot saved: ${screenshotPath}`);
    
    return screenshotPath;
  } catch (error) {
    console.error(`❌ Error capturing ${gameName}: ${error.message}`);
    return null;
  } finally {
    await context.close();
    server.kill();
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function main() {
  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'poc-screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  
  console.log('🎮 Generating screenshots for 5 POC games...\n');
  
  const browser = await chromium.launch({ headless: true });
  
  const results = [];
  
  for (const game of POC_GAMES) {
    const screenshotPath = await generateScreenshot(browser, game.name, game.title);
    results.push({
      name: game.name,
      title: game.title,
      screenshot: screenshotPath
    });
  }
  
  await browser.close();
  
  // Generate summary
  console.log('\n\n📊 SCREENSHOT GENERATION SUMMARY\n');
  console.log('=' .repeat(80));
  
  results.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.title}`);
    console.log(`   Folder: ${result.name}/`);
    console.log(`   Screenshot: ${result.screenshot ? '✅ Generated' : '❌ Failed'}`);
  });
  
  console.log('\n' + '='.repeat(80));
  console.log('\n✅ All screenshots generated in poc-screenshots/ directory\n');
}

main().catch(console.error);
