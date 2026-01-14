const { chromium } = require('@playwright/test');
const http = require('http');
const handler = require('serve-handler');
const fs = require('fs');

(async () => {
    const games = [
        { name: 'rpg', port: 8881 },
        { name: 'side-scroller', port: 8882 },
        { name: 'physics-adventure', port: 8883 }
    ];
    
    const servers = [];
    
    for (const game of games) {
        const server = http.createServer((req, res) => {
            return handler(req, res, { public: game.name });
        });
        await new Promise(resolve => server.listen(game.port, resolve));
        servers.push(server);
    }
    
    const browser = await chromium.launch({ headless: true });
    
    for (const game of games) {
        const page = await browser.newPage();
        await page.setViewport({ width: 800, height: 600 });
        
        await page.goto(`http://localhost:${game.port}`, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(4000);
        
        await page.screenshot({ path: `fixed-${game.name}.png` });
        console.log(`Captured fixed-${game.name}.png`);
        
        await page.close();
    }
    
    await browser.close();
    servers.forEach(s => s.close());
})();
