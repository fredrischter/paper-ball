# Game Design Document: Favela Defense

## Game Overview
A strategy-defense game set in dense, vertical urban environments where players manage defensive positions, supplies, and units to hold territory against waves of attackers.

## Technical Specifications

### Platform & Orientation
- **Platform**: Mobile (primary), Desktop fullscreen (secondary)
- **Orientation**: Horizontal (Landscape)
- **Screen Resolution**: 1920x1080 (16:9 aspect ratio)
- **Target Devices**: Mobile phones, tablets, desktop browsers

### Image Assets & Specifications

All images are PNG format with transparency where applicable.

| Asset Name | Size (px) | Description |
|------------|-----------|-------------|
| `background_favela.png` | 1920x1080 | Vertical urban settlement background |
| `defender_unit.png` | 80x80 | Defender character sprite |
| `attacker_unit.png` | 80x80 | Enemy attacker sprite |
| `barricade.png` | 120x100 | Improvised barricade structure |
| `sandbag_wall.png` | 150x80 | Sandbag defensive wall |
| `tower_position.png` | 100x150 | Elevated defensive position |
| `supply_crate.png` | 60x60 | Supply/resource crate |
| `health_bar.png` | 80x10 | Unit health bar |
| `placement_grid.png` | 100x100 | Grid cell for placement |
| `wave_indicator.png` | 400x120 | Wave counter panel |
| `resources_panel.png` | 350x100 | Resource display |
| `button_deploy.png` | 180x70 | Deploy unit button |
| `button_build.png` | 180x70 | Build structure button |

## Game Flow (1-Minute Demo)

### 1. Intro Sequence (4 seconds - Story setup)
- Aerial view of favela hillside
- Radio crackles: "Incoming attack! Defend the neighborhood!"
- Camera zooms to defensive grid
- Resources appear on screen
- Text: "PROTECT YOUR COMMUNITY"
- **No player input required** - Auto-advances to gameplay

### 2. Game Screen (Main Gameplay - 53 seconds)
- **Layout**:
  - Main area: 3x4 grid (1200x800, centered)
  - Left panel: Available units and structures (x: 100)
  - Right panel: Resources and wave info (x: 1650)
  - Bottom: Build/Deploy buttons (y: 950)
  - Top: Wave timer and health (y: 50)

- **Controls**: 
  - **ONE BUTTON MODE** (Simplified):
    - **Tap empty grid cell**: Deploy next available unit
    - Auto-cycles between unit types
  
  - **TWO BUTTON MODE** (Standard):
    - **Deploy Button**: Place defender unit
    - **Build Button**: Place barricade
    - Then tap grid cell to place

- **Mechanics**:
  1. **Setup Phase** (10 seconds):
     - Place 3 defenders and 2 barricades on grid
     - Drag from button to grid cell OR tap button then tap cell
  
  2. **Defense Phase** (Wave 1 - 15 seconds):
     - 5 attackers approach from right side
     - Defenders auto-attack nearby enemies
     - Barricades block enemy movement
  
  3. **Reinforcement** (5 seconds):
     - Earn 2 new units
     - Quick placement phase
  
  4. **Defense Phase** (Wave 2 - 15 seconds):
     - 8 attackers with varied paths
     - Must adapt defensive positions
  
  5. **Final Wave** (8 seconds):
     - 10 attackers, faster movement
     - Hold the line!

- **Win Condition**: Survive 3 waves
- **Lose Condition**: 5+ enemies reach the left edge

### 3. End Screen (5 seconds)
- **Victory Screen**:
  - Display: "TERRITORY HELD!"
  - Show: Enemies defeated, Waves survived
  - Button: "Next Defense" (auto-advance after 3s)
  
- **Defeat Screen**:
  - Display: "OVERRUN!"
  - Show: Wave reached, Enemies stopped
  - Button: "Retry"

- **Transition**: Loop back to Game Screen

## Game Elements Detail

### Grid System
```
Grid Size: 12 cells wide × 8 cells tall
Cell Size: 100×100 pixels
Total Play Area: 1200×800 pixels (centered)
Left Edge (player base): Column 1-2
Right Edge (enemy spawn): Column 12
```

### Unit Types
```
DEFENDER:
  - Health: 100
  - Attack: 20 per second
  - Range: 2 cells (200px)
  - Cost: 1 unit slot
  
BARRICADE:
  - Health: 150
  - Blocks movement
  - No attack
  - Cost: 1 structure slot
  
TOWER (Wave 2+ bonus):
  - Health: 80
  - Attack: 30 per second
  - Range: 3 cells
  - Cost: 2 unit slots
```

### Enemy Types
```
BASIC ATTACKER:
  - Health: 50
  - Speed: 50 px/second
  - Attack: 10 per second
  
FAST ATTACKER (Wave 2+):
  - Health: 30
  - Speed: 100 px/second
  - Attack: 15 per second
  
HEAVY ATTACKER (Wave 3):
  - Health: 120
  - Speed: 30 px/second
  - Attack: 25 per second
```

### Resource System
```
Starting Resources:
  - Units: 5
  - Structures: 3

Earned Per Wave:
  - Units: +2
  - Structures: +1

Cannot exceed: 10 units, 5 structures
```

### Visual Feedback
- Grid cells highlight on hover/touch
- Valid placement: Green highlight
- Invalid placement: Red highlight
- Units flash when attacking
- Health bars above all units
- Damage numbers appear on hits
- Structure collapse animation when destroyed
- Screen shake on base damage

### Audio Cues (Optional)
- Placement sound
- Gunfire/attack sounds
- Structure building sound
- Enemy approach warning
- Wave complete fanfare
- Ambient urban sounds

## User Interface

### HUD Elements
- **Wave Counter**: Top center, "WAVE X/3", countdown timer
- **Base Health**: Top left, heart icons (start with 5)
- **Resources**: Top right
  - "Units: X" with unit icon
  - "Structures: X" with barricade icon
- **Grid Overlay**: Semi-transparent when placing

### Button Layout (Two-Button Mode)
```
Bottom left (150, 950):
  - Deploy Unit button (180×70)
Bottom center (870, 950):
  - Build Structure button (180×70)
Both buttons: Orange with white icons
```

### Button Layout (One-Button Mode - Simplified)
```
Single button at bottom center (870, 950):
  - "DEPLOY" button (200×80)
  - Cycles between available options
  - Shows icon of what will be placed next
```

## Placeholder Image Specifications

### background_favela.png
- **Size**: 1920x1080
- **Content**: Hillside urban settlement with colorful buildings stacked vertically
- **Color Scheme**: Warm oranges, yellows, reds with concrete grays
- **Format**: Placeholder = Gradient from orange (top) to brown (bottom) with rectangular building outlines

### defender_unit.png
- **Size**: 80x80
- **Content**: Character in defensive stance
- **Format**: Placeholder = Blue rectangle with white circle (head)

### attacker_unit.png
- **Size**: 80x80
- **Content**: Enemy character advancing
- **Format**: Placeholder = Red rectangle with white circle (head)

### barricade.png
- **Size**: 120x100
- **Content**: Improvised barrier made of wood and metal
- **Format**: Placeholder = Brown crossed rectangles

### sandbag_wall.png
- **Size**: 150x80
- **Content**: Stacked sandbags forming wall
- **Format**: Placeholder = Tan stacked ovals

### tower_position.png
- **Size**: 100x150
- **Content**: Elevated platform with railing
- **Format**: Placeholder = Gray vertical rectangle with smaller square on top

### supply_crate.png
- **Size**: 60x60
- **Content**: Wooden supply crate
- **Format**: Placeholder = Brown square with X pattern

### health_bar.png
- **Size**: 80x10
- **Content**: HP bar (green/red gradient)
- **Format**: Placeholder = Green rectangle with red background

### placement_grid.png
- **Size**: 100x100
- **Content**: Grid cell outline
- **Format**: Placeholder = White square outline, semi-transparent fill

### wave_indicator.png
- **Size**: 400x120
- **Content**: Wave number and timer display
- **Format**: Placeholder = Dark rectangle with rounded corners

### resources_panel.png
- **Size**: 350x100
- **Content**: Resource count display
- **Format**: Placeholder = Semi-transparent black rectangle

### button_deploy.png
- **Size**: 180x70
- **Content**: "DEPLOY" text with unit icon
- **Format**: Placeholder = Orange rectangle with white border

### button_build.png
- **Size**: 180x70
- **Content**: "BUILD" text with barricade icon
- **Format**: Placeholder = Orange rectangle with white border

## Development Notes

### Simplified 1-Minute Demo Flow
```
[Title 2s] → [Setup 10s] → [Wave 1: 15s] → [Reinforce 5s] → [Wave 2: 15s] → [Wave 3: 8s] → [End Screen 5s] → [Loop]
```

### Key Features for Demo
1. ✅ Quick setup phase teaches mechanics
2. ✅ Simple grid-based placement
3. ✅ Auto-combat (no manual control needed)
4. ✅ One or two button controls
5. ✅ Clear visual feedback on all actions
6. ✅ Progressive difficulty across 3 waves

### Difficulty Curve
- **Wave 1**: Tutorial wave, slow enemies, plenty of time
- **Wave 2**: Mixed enemy types, faster pace
- **Wave 3**: Final challenge, all enemy types, high pressure

### Performance Targets
- 60 FPS on mobile devices
- Grid highlighting < 16ms response
- Smooth unit animations
- Asset loading < 1 second

## Completion Checklist
- [ ] All PNG placeholder images created
- [ ] Grid system and placement mechanics
- [ ] Unit and structure deployment working
- [ ] Auto-combat system functional
- [ ] Wave spawning and progression
- [ ] Resource management implemented
- [ ] Win/lose conditions working
- [ ] End screen and restart loop
- [ ] Touch controls optimized
- [ ] Visual feedback polished
