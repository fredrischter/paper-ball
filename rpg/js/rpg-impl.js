// RPG Implementation - Complete dialog, character customization, and NPC system
// This file contains the full RPG variant implementation

// ============================================================================
// RPG GAME STATE MANAGEMENT
// ============================================================================

const RPGStates = {
    OPENING_DIALOG: 'opening_dialog',
    CHARACTER_SELECT: 'character_select',
    CLOTHING_SELECT: 'clothing_select',
    WORLD: 'world',
    INTERIOR: 'interior',
    NPC_DIALOG: 'npc_dialog'
};

let currentRPGState = RPGStates.OPENING_DIALOG;
let dialogIndex = 0;
let selectedCharacter = 0; // 0-2 for different character types
let selectedClothing = 0; // 0-2 for different clothing styles
let currentHouse = null;
let nearNPC = null;

// ============================================================================
// DIALOG SYSTEM
// ============================================================================

const openingDialogs = [
    {
        text: "Welcome to the village of Pixelton...",
        background: 'bg-stage1' // Forest scene
    },
    {
        text: "A mysterious phenomenon has occurred in the land.",
        background: 'bg-stage2' // Mountain scene
    },
    {
        text: "You must uncover the truth. Choose your hero!",
        background: 'bg-stage1' // Back to forest
    }
];

const npcDialogs = {
    elder: [
        { text: "Greetings, traveler. Welcome to my humble home.", background: 'interior-1' },
        { text: "Dark forces are stirring in the east...", background: 'interior-1' },
        { text: "Be careful on your journey.", background: 'interior-1' }
    ],
    merchant: [
        { text: "Looking to trade? I have rare items!", background: 'interior-2' },
        { text: "Come back anytime, friend.", background: 'interior-2' }
    ]
};

// ============================================================================
// DIALOG BOX RENDERING
// ============================================================================

function createDialogBox(scene) {
    const dialogBox = scene.add.graphics();
    dialogBox.fillStyle(0x000000, 0.8);
    dialogBox.fillRect(50, 450, 700, 120);
    dialogBox.lineStyle(4, 0xffffff);
    dialogBox.strokeRect(50, 450, 700, 120);
    dialogBox.setDepth(1000);
    dialogBox.setScrollFactor(0); // Fixed to camera
    return dialogBox;
}

function createDialogText(scene, text) {
    const dialogText = scene.add.text(70, 470, text, {
        font: '20px Arial',
        fill: '#ffffff',
        wordWrap: { width: 660 }
    });
    dialogText.setDepth(1001);
    dialogText.setScrollFactor(0); // Fixed to camera
    return dialogText;
}

function showDialog(scene, dialogData) {
    // Change background if specified
    if (dialogData.background) {
        changeBackground(scene, dialogData.background);
    }
    
    // Create or update dialog box
    if (!scene.dialogBox) {
        scene.dialogBox = createDialogBox(scene);
        scene.dialogText = createDialogText(scene, dialogData.text);
    } else {
        scene.dialogText.setText(dialogData.text);
    }
    
    // Show continue indicator
    if (!scene.continueText) {
        scene.continueText = scene.add.text(720, 550, 'Press SPACE to continue', {
            font: '14px Arial',
            fill: '#aaaaaa'
        });
        scene.continueText.setDepth(1002);
        scene.continueText.setScrollFactor(0);
    }
}

function hideDialog(scene) {
    if (scene.dialogBox) {
        scene.dialogBox.destroy();
        scene.dialogBox = null;
    }
    if (scene.dialogText) {
        scene.dialogText.destroy();
        scene.dialogText = null;
    }
    if (scene.continueText) {
        scene.continueText.destroy();
        scene.continueText = null;
    }
}

// ============================================================================
// CHARACTER SELECTION SCREEN
// ============================================================================

function showCharacterSelect(scene) {
    hideDialog(scene);
    
    // Create character selection UI
    scene.add.text(400, 100, 'Choose Your Character', {
        font: 'bold 32px Arial',
        fill: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0);
    
    const characterTypes = [
        { name: 'Warrior', x: 200 },
        { name: 'Mage', x: 400 },
        { name: 'Rogue', x: 600 }
    ];
    
    scene.characterButtons = [];
    characterTypes.forEach((char, index) => {
        const button = scene.add.rectangle(char.x, 300, 150, 200, 0x4444ff);
        button.setInteractive();
        button.setScrollFactor(0);
        
        const label = scene.add.text(char.x, 420, char.name, {
            font: '20px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0);
        
        button.on('pointerdown', () => {
            selectedCharacter = index;
            transitionToClothingSelect(scene);
        });
        
        scene.characterButtons.push({ button, label });
    });
}

function transitionToClothingSelect(scene) {
    // Clean up character select
    scene.characterButtons.forEach(item => {
        item.button.destroy();
        item.label.destroy();
    });
    
    currentRPGState = RPGStates.CLOTHING_SELECT;
    showClothingSelect(scene);
}

// ============================================================================
// CLOTHING SELECTION SCREEN
// ============================================================================

function showClothingSelect(scene) {
    scene.add.text(400, 100, 'Choose Your Style', {
        font: 'bold 32px Arial',
        fill: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0);
    
    const clothingTypes = [
        { name: 'Light Armor', x: 200 },
        { name: 'Heavy Armor', x: 400 },
        { name: 'Casual', x: 600 }
    ];
    
    scene.clothingButtons = [];
    clothingTypes.forEach((cloth, index) => {
        const button = scene.add.rectangle(cloth.x, 300, 150, 200, 0x44ff44);
        button.setInteractive();
        button.setScrollFactor(0);
        
        const label = scene.add.text(cloth.x, 420, cloth.name, {
            font: '20px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0);
        
        button.on('pointerdown', () => {
            selectedClothing = index;
            transitionToWorld(scene);
        });
        
        scene.clothingButtons.push({ button, label });
    });
}

function transitionToWorld(scene) {
    // Clean up clothing select
    scene.clothingButtons.forEach(item => {
        item.button.destroy();
        item.label.destroy();
    });
    
    // Clear any remaining text
    scene.children.list.forEach(child => {
        if (child.type === 'Text' && child.scrollFactorX === 0) {
            child.destroy();
        }
    });
    
    currentRPGState = RPGStates.WORLD;
    setupWorld(scene);
}

// ============================================================================
// WORLD SETUP (Side-scrolling explorable map)
// ============================================================================

function setupWorld(scene) {
    // Change to world background
    changeBackground(scene, 'bg-stage1');
    
    // Create extended world bounds
    scene.matter.world.setBounds(0, 0, 4000, 600);
    scene.cameras.main.setBounds(0, 0, 4000, 600);
    
    // Create player if not exists
    if (!player) {
        player = scene.matter.add.sprite(200, 400, 'player', 0);
        player.setFriction(0.1);
        player.setMass(10);
        player.setFixedRotation();
        player.scene = scene;
    } else {
        player.setPosition(200, 400);
        player.setVelocity(0, 0);
    }
    
    // Camera follows player
    scene.cameras.main.startFollow(player, true, 0.1, 0.1);
    
    // Create ground platform
    const ground = scene.matter.add.rectangle(2000, 580, 4000, 40, {
        isStatic: true,
        friction: 1
    });
    
    // Create houses
    createHouses(scene);
    
    // Enable gravity for world mode
    scene.matter.world.setGravity(0, 1);
    
    // Show instructions
    const instructions = scene.add.text(400, 50, 'Arrow keys to move, UP at door to enter house', {
        font: '16px Arial',
        fill: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 }
    }).setScrollFactor(0).setDepth(100);
    
    scene.time.delayedCall(5000, () => {
        if (instructions) instructions.destroy();
    });
}

// ============================================================================
// HOUSE SYSTEM
// ============================================================================

const houses = [
    { x: 800, y: 500, npc: 'elder', doorY: 480 },
    { x: 1600, y: 500, npc: 'merchant', doorY: 480 },
    { x: 2800, y: 500, npc: 'elder', doorY: 480 }
];

function createHouses(scene) {
    scene.houses = [];
    houses.forEach((houseData, index) => {
        // House structure (brown rectangle)
        const house = scene.add.rectangle(houseData.x, houseData.y, 200, 150, 0x8b4513);
        house.setStrokeStyle(4, 0x000000);
        
        // Door (darker brown rectangle)
        const door = scene.add.rectangle(houseData.x, houseData.doorY, 50, 80, 0x654321);
        door.setStrokeStyle(2, 0x000000);
        
        // Door marker
        const doorText = scene.add.text(houseData.x, houseData.doorY - 60, '↓ DOOR', {
            font: 'bold 14px Arial',
            fill: '#ffff00',
            backgroundColor: '#000000',
            padding: { x: 5, y: 2 }
        }).setOrigin(0.5);
        
        scene.houses.push({
            data: houseData,
            structure: house,
            door: door,
            marker: doorText,
            index: index
        });
    });
}

function checkHouseProximity(scene) {
    if (currentRPGState !== RPGStates.WORLD) return;
    
    currentHouse = null;
    scene.houses.forEach(house => {
        const dist = Phaser.Math.Distance.Between(player.x, player.y, house.data.x, house.data.doorY);
        if (dist < 60) {
            currentHouse = house;
            house.marker.setVisible(true);
        } else {
            house.marker.setVisible(false);
        }
    });
}

function enterHouse(scene) {
    if (!currentHouse) return;
    
    currentRPGState = RPGStates.INTERIOR;
    
    // Change to interior view
    changeBackground(scene, 'bg-stage2'); // Brown background for interior
    
    // Hide player temporarily
    player.setVisible(false);
    
    // Stop camera follow
    scene.cameras.main.stopFollow();
    scene.cameras.main.setScroll(0, 0);
    
    // Create interior elements
    showInterior(scene, currentHouse);
}

// ============================================================================
// INTERIOR SYSTEM
// ============================================================================

function showInterior(scene, house) {
    // Interior title
    scene.interiorTitle = scene.add.text(400, 50, `Inside the ${house.data.npc}'s House`, {
        font: 'bold 24px Arial',
        fill: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setScrollFactor(0);
    
    // Create NPC
    const npcX = 400;
    const npcY = 300;
    scene.npc = scene.add.rectangle(npcX, npcY, 40, 60, 0xff00ff);
    scene.npc.setStrokeStyle(2, 0x000000);
    scene.npc.npcType = house.data.npc;
    
    // NPC label
    scene.npcLabel = scene.add.text(npcX, npcY - 50, house.data.npc.toUpperCase(), {
        font: 'bold 16px Arial',
        fill: '#ffff00'
    }).setOrigin(0.5);
    
    // Show player in interior
    player.setPosition(200, 400);
    player.setVisible(true);
    player.setVelocity(0, 0);
    
    // Exit door
    scene.exitDoor = scene.add.rectangle(100, 500, 60, 100, 0x654321);
    scene.exitDoor.setStrokeStyle(3, 0x000000);
    
    scene.exitText = scene.add.text(100, 440, '↑ EXIT', {
        font: 'bold 14px Arial',
        fill: '#00ff00',
        backgroundColor: '#000000',
        padding: { x: 5, y: 2 }
    }).setOrigin(0.5);
    
    // Instructions
    scene.interiorInstructions = scene.add.text(400, 550, 'Walk near NPC to talk | DOWN at door to exit', {
        font: '14px Arial',
        fill: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 }
    }).setOrigin(0.5);
}

function checkNPCProximity(scene) {
    if (currentRPGState !== RPGStates.INTERIOR || !scene.npc) return;
    
    const dist = Phaser.Math.Distance.Between(player.x, player.y, scene.npc.x, scene.npc.y);
    if (dist < 80) {
        nearNPC = scene.npc.npcType;
        if (!scene.talkPrompt) {
            scene.talkPrompt = scene.add.text(scene.npc.x, scene.npc.y + 60, 'Press SPACE to talk', {
                font: '12px Arial',
                fill: '#00ff00',
                backgroundColor: '#000000',
                padding: { x: 5, y: 2 }
            }).setOrigin(0.5);
        }
    } else {
        nearNPC = null;
        if (scene.talkPrompt) {
            scene.talkPrompt.destroy();
            scene.talkPrompt = null;
        }
    }
}

function startNPCDialog(scene) {
    if (!nearNPC) return;
    
    currentRPGState = RPGStates.NPC_DIALOG;
    dialogIndex = 0;
    
    // Show first dialog
    const dialogs = npcDialogs[nearNPC] || npcDialogs.elder;
    showDialog(scene, dialogs[0]);
}

function exitHouse(scene) {
    // Clean up interior
    if (scene.interiorTitle) scene.interiorTitle.destroy();
    if (scene.npc) scene.npc.destroy();
    if (scene.npcLabel) scene.npcLabel.destroy();
    if (scene.exitDoor) scene.exitDoor.destroy();
    if (scene.exitText) scene.exitText.destroy();
    if (scene.interiorInstructions) scene.interiorInstructions.destroy();
    if (scene.talkPrompt) scene.talkPrompt.destroy();
    
    hideDialog(scene);
    
    currentRPGState = RPGStates.WORLD;
    currentHouse = null;
    nearNPC = null;
    
    // Return to world
    changeBackground(scene, 'bg-stage1');
    player.setPosition(currentHouse ? currentHouse.data.x + 100 : 200, 400);
    scene.cameras.main.startFollow(player, true, 0.1, 0.1);
}

// ============================================================================
// BACKGROUND MANAGEMENT
// ============================================================================

function changeBackground(scene, bgKey) {
    // Hide all backgrounds
    if (stageBackgrounds.bg1) stageBackgrounds.bg1.setVisible(false);
    if (stageBackgrounds.bg2) stageBackgrounds.bg2.setVisible(false);
    if (stageBackgrounds.bg3) stageBackgrounds.bg3.setVisible(false);
    
    // Show requested background
    if (bgKey === 'bg-stage1' && stageBackgrounds.bg1) {
        stageBackgrounds.bg1.setVisible(true);
    } else if (bgKey === 'bg-stage2' && stageBackgrounds.bg2) {
        stageBackgrounds.bg2.setVisible(true);
    } else if (bgKey === 'bg-stage3' && stageBackgrounds.bg3) {
        stageBackgrounds.bg3.setVisible(true);
    }
}

// ============================================================================
// RPG UPDATE LOGIC
// ============================================================================

function updateRPG(scene) {
    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(jumpButton);
    const upPressed = cursors.up.isDown || wasdKeys.W.isDown;
    const downPressed = cursors.down.isDown || wasdKeys.S.isDown;
    
    switch (currentRPGState) {
        case RPGStates.OPENING_DIALOG:
            if (spaceJustPressed) {
                dialogIndex++;
                if (dialogIndex < openingDialogs.length) {
                    showDialog(scene, openingDialogs[dialogIndex]);
                } else {
                    hideDialog(scene);
                    currentRPGState = RPGStates.CHARACTER_SELECT;
                    showCharacterSelect(scene);
                }
            }
            break;
            
        case RPGStates.WORLD:
            checkHouseProximity(scene);
            if (upPressed && currentHouse) {
                enterHouse(scene);
            }
            break;
            
        case RPGStates.INTERIOR:
            checkNPCProximity(scene);
            if (spaceJustPressed && nearNPC) {
                startNPCDialog(scene);
            }
            // Check for exit
            const distToExit = Phaser.Math.Distance.Between(player.x, player.y, 100, 500);
            if (downPressed && distToExit < 80) {
                exitHouse(scene);
            }
            break;
            
        case RPGStates.NPC_DIALOG:
            if (spaceJustPressed) {
                dialogIndex++;
                const dialogs = npcDialogs[nearNPC] || npcDialogs.elder;
                if (dialogIndex < dialogs.length) {
                    showDialog(scene, dialogs[dialogIndex]);
                } else {
                    hideDialog(scene);
                    dialogIndex = 0;
                    currentRPGState = RPGStates.INTERIOR;
                }
            }
            break;
    }
}

// ============================================================================
// RPG INITIALIZATION
// ============================================================================

function initializeRPG(scene) {
    currentRPGState = RPGStates.OPENING_DIALOG;
    dialogIndex = 0;
    
    // Show first opening dialog
    showDialog(scene, openingDialogs[0]);
}
