// Admin Game - Element Management System
// No character, no physics - just click to place and manage elements

function create() {
    const game = this;
    
    // Background
    game.add.rectangle(400, 300, 800, 600, 0x4a4a4a);
    
    // Title
    game.add.text(400, 30, 'Admin Game - Element Manager', {
        font: '24px Arial',
        fill: '#ffffff'
    }).setOrigin(0.5);
    
    // Instructions
    game.add.text(400, 570, 'Click CREATE to add elements, click elements to demolish', {
        font: '16px Arial',
        fill: '#cccccc'
    }).setOrigin(0.5);
    
    // CREATE button on right side
    const createBtnX = 750;
    const createBtnY = 300;
    
    const createBtnBg = game.add.rectangle(createBtnX, createBtnY, 80, 50, 0x44aa44);
    createBtnBg.setInteractive({ useHandCursor: true });
    
    const createBtnText = game.add.text(createBtnX, createBtnY, 'CREATE', {
        font: '16px Arial',
        fill: '#ffffff'
    }).setOrigin(0.5);
    
    // Store in global scope
    if (!game.registry.get('createButton')) {
        game.registry.set('createButton', { bg: createBtnBg, text: createBtnText });
    }
    
    // Elements array
    if (!game.registry.get('elements')) {
        game.registry.set('elements', []);
    }
    
    // Placement mode
    if (!game.registry.get('placementMode')) {
        game.registry.set('placementMode', false);
    }
    
    // CREATE button click
    createBtnBg.on('pointerdown', () => {
        game.registry.set('placementMode', true);
        createBtnBg.setFillStyle(0x66cc66);
    });
    
    // Click anywhere to place
    game.input.on('pointerdown', (pointer) => {
        if (game.registry.get('placementMode')) {
            // Don't place on button
            if (pointer.x > 700) return;
            
            // Show confirmation popup
            showPlacementConfirm(game, pointer.x, pointer.y);
        } else {
            // Check if clicked on element
            const elements = game.registry.get('elements');
            for (let elem of elements) {
                const dist = Phaser.Math.Distance.Between(pointer.x, pointer.y, elem.x, elem.y);
                if (dist < 30) {
                    showDemolishPopup(game, elem);
                    break;
                }
            }
        }
    });
    
    // Menu and sound buttons
    createTopButtons(game);
}

function showPlacementConfirm(game, x, y) {
    // Create popup
    const popup = game.add.container(400, 250);
    
    const bg = game.add.rectangle(0, 0, 300, 150, 0x333333);
    const title = game.add.text(0, -40, 'Place Element Here?', {
        font: '18px Arial',
        fill: '#ffffff'
    }).setOrigin(0.5);
    
    const okBtn = game.add.rectangle(-60, 30, 100, 40, 0x44aa44);
    okBtn.setInteractive({ useHandCursor: true });
    const okText = game.add.text(-60, 30, 'OK', {
        font: '16px Arial',
        fill: '#ffffff'
    }).setOrigin(0.5);
    
    const cancelBtn = game.add.rectangle(60, 30, 100, 40, 0xaa4444);
    cancelBtn.setInteractive({ useHandCursor: true });
    const cancelText = game.add.text(60, 30, 'Cancel', {
        font: '16px Arial',
        fill: '#ffffff'
    }).setOrigin(0.5);
    
    popup.add([bg, title, okBtn, okText, cancelBtn, cancelText]);
    
    okBtn.on('pointerdown', () => {
        // Place element
        const elem = game.add.circle(x, y, 25, 0xff8800);
        elem.setInteractive({ useHandCursor: true });
        
        const elements = game.registry.get('elements');
        elements.push(elem);
        game.registry.set('elements', elements);
        
        popup.destroy();
        game.registry.set('placementMode', false);
        const createBtn = game.registry.get('createButton');
        createBtn.bg.setFillStyle(0x44aa44);
    });
    
    cancelBtn.on('pointerdown', () => {
        popup.destroy();
        game.registry.set('placementMode', false);
        const createBtn = game.registry.get('createButton');
        createBtn.bg.setFillStyle(0x44aa44);
    });
}

function showDemolishPopup(game, element) {
    const popup = game.add.container(400, 250);
    
    const bg = game.add.rectangle(0, 0, 300, 150, 0x333333);
    const title = game.add.text(0, -40, 'Demolish Element?', {
        font: '18px Arial',
        fill: '#ffffff'
    }).setOrigin(0.5);
    
    const yesBtn = game.add.rectangle(-60, 30, 100, 40, 0xaa4444);
    yesBtn.setInteractive({ useHandCursor: true });
    const yesText = game.add.text(-60, 30, 'Yes', {
        font: '16px Arial',
        fill: '#ffffff'
    }).setOrigin(0.5);
    
    const noBtn = game.add.rectangle(60, 30, 100, 40, 0x666666);
    noBtn.setInteractive({ useHandCursor: true });
    const noText = game.add.text(60, 30, 'No', {
        font: '16px Arial',
        fill: '#ffffff'
    }).setOrigin(0.5);
    
    popup.add([bg, title, yesBtn, yesText, noBtn, noText]);
    
    yesBtn.on('pointerdown', () => {
        element.destroy();
        const elements = game.registry.get('elements');
        const index = elements.indexOf(element);
        if (index > -1) {
            elements.splice(index, 1);
        }
        game.registry.set('elements', elements);
        popup.destroy();
    });
    
    noBtn.on('pointerdown', () => {
        popup.destroy();
    });
}

function createTopButtons(game) {
    // Menu button (top left)
    const menuBtn = game.add.rectangle(50, 50, 80, 50, 0x555555);
    menuBtn.setInteractive({ useHandCursor: true });
    game.add.text(50, 50, 'MENU', {
        font: '16px Arial',
        fill: '#ffffff'
    }).setOrigin(0.5);
    
    // Sound button (top right)
    const soundBtn = game.add.rectangle(750, 50, 80, 50, 0x555555);
    soundBtn.setInteractive({ useHandCursor: true });
    game.add.text(750, 50, 'SOUND', {
        font: '16px Arial',
        fill: '#ffffff'
    }).setOrigin(0.5);
}
