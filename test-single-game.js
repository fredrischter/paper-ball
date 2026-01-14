const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Simple HTTP server
function startServer(port, directory) {
    const server = http.createServer((req, res) => {
        let filePath = path.join(directory, req.url === '/' ? '/index.html' : req.url);
        const extname = path.extname(filePath);
        let contentType = 'text/html';
        
        const contentTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.wasm': 'application/wasm'
        };
        
        contentType = contentTypes[extname] || 'application/octet-stream';
        
        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    res.writeHead(404);
                    res.end('File not found');
                } else {
                    res.writeHead(500);
                    res.end('Server error: ' + error.code);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    });
    
    server.listen(port);
    return server;
}

async function testGame(gameName, gameDir) {
    console.log(`\n=== Testing ${gameName} ===`);
    
    const port = 8000 + Math.floor(Math.random() * 1000);
    const server = startServer(port, gameDir);
    
    try {
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        
        // Listen for console messages
        page.on('console', msg => console.log(`[${gameName} Console]:`, msg.text()));
        
        // Listen for errors
        page.on('pageerror', error => console.error(`[${gameName} Error]:`, error.message));
        
        // Navigate to the game
        await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle' });
        
        // Wait a bit for Phaser to initialize
        await page.waitForTimeout(3000);
        
        // Check if Phaser is loaded
        const phaserLoaded = await page.evaluate(() => {
            return typeof Phaser !== 'undefined';
        });
        
        console.log(`Phaser loaded: ${phaserLoaded}`);
        
        // Check if game exists
        const gameExists = await page.evaluate(() => {
            return typeof game !== 'undefined' && game !== null;
        });
        
        console.log(`Game object exists: ${gameExists}`);
        
        // Check canvas
        const canvasExists = await page.evaluate(() => {
            const canvas = document.querySelector('canvas');
            return canvas !== null;
        });
        
        console.log(`Canvas exists: ${canvasExists}`);
        
        // Get canvas dimensions
        if (canvasExists) {
            const canvasDims = await page.evaluate(() => {
                const canvas = document.querySelector('canvas');
                return { width: canvas.width, height: canvas.height };
            });
            console.log(`Canvas dimensions: ${canvasDims.width}x${canvasDims.height}`);
        }
        
        // Take a screenshot
        const screenshotPath = `debug-screenshot-${gameName}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`Screenshot saved to ${screenshotPath}`);
        
        await browser.close();
        return { success: true, port };
    } catch (error) {
        console.error(`Error testing ${gameName}:`, error.message);
        return { success: false, error: error.message };
    } finally {
        server.close();
    }
}

async function main() {
    const games = [
        { name: 'root', dir: '.' },
        { name: 'game-poc', dir: './game-poc' },
    ];
    
    for (const game of games) {
        await testGame(game.name, game.dir);
    }
}

main().catch(console.error);
