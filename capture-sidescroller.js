const { chromium } = require('playwright');

async function captureSidescroller() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  
  await page.goto('http://localhost:8081', { waitUntil: 'networkidle', timeout: 10000 });
  await page.waitForTimeout(3000);
  
  await page.screenshot({ path: '/home/runner/work/paper-ball/paper-ball/poc-screenshots/side-scroller.png' });
  
  await browser.close();
  console.log('✅ Side-scroller screenshot saved');
}

captureSidescroller().catch(console.error);
