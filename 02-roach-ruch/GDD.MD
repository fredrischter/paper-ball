# Game Design Document: Roach Ruch

## Game Overview
A fast-paced arcade survival game where players control a cockroach navigating dangerous sewer tunnels, avoiding hazards and predators through quick reflexes and constant movement.

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
| `background_sewer.png` | 1920x1080 | Sewer tunnel environment |
| `roach_player.png` | 80x60 | Player cockroach sprite |
| `water_wave.png` | 1920x200 | Flooding water animation |
| `slime_puddle.png` | 150x100 | Slime hazard obstacle |
| `pipe_obstacle.png` | 100x300 | Vertical pipe obstacle |
| `rat_enemy.png` | 120x80 | Rat predator sprite |
| `spider_enemy.png` | 100x100 | Spider enemy sprite |
| `toxic_gas.png` | 200x200 | Toxic gas cloud |
| `floor_tile.png` | 200x200 | Repeating floor texture |
| `distance_meter.png` | 300x80 | Distance counter panel |
| `game_over_panel.png` | 800x400 | Game over screen background |
| `button_retry.png` | 250x90 | Retry button |

## Game Flow (1-Minute Demo)

### 1. Intro Sequence (3 seconds - Story setup)
- Brief scene: Roach hiding in drain grate
- Water starts rising (visual cue)
- Text flash: "ESCAPE OR DROWN!"
- Roach automatically starts running
- **No player input required** - Auto-advances to gameplay

### 2. Game Screen (Main Gameplay - 55 seconds)
- **Layout**:
  - Left side: Player cockroach starting position (x: 200, y: 540)
  - Background: Scrolling sewer tunnel (moves right-to-left)
  - Top: Distance counter (x: 100, y: 50)
  - Bottom: Floor with obstacles
  - Obstacles spawn from right side continuously

- **Controls**: 
  - **ONE BUTTON MODE** (Primary):
    - **Tap anywhere**: Jump (auto-duck after landing)
    - Simple alternating jump pattern
  
  - **TWO BUTTON MODE** (Advanced):
    - **Jump Button** (Right side, y: 900): Tap to jump
    - **Duck Button** (Right side, y: 700): Tap to slide/duck
  
- **Mechanics**:
  1. Roach auto-runs forward constantly
  2. Player must jump over low obstacles (slime, rats)
  3. Player must duck under high obstacles (pipes, spiders)
  4. Water waves rise periodically - must jump to avoid
  5. Toxic gas clouds slow movement - avoid or push through
  6. Distance increases automatically (1 meter per second)
  7. Speed gradually increases over time
  
- **Win Condition**: Survive and reach 100 meters
- **Lose Condition**: Hit 3 obstacles

### 3. End Screen (5 seconds)
- **Success Screen** (if won):
  - Display: "SURVIVED! Distance: 100m"
  - Distance traveled shown prominently
  - "Continue" button (auto-advance after 3s)
  
- **Fail Screen** (if lost):
  - Display: "SPLAT! Distance: Xm"
  - Best distance shown
  - "Retry" button

- **Input**: Single button tap or auto-advance
- **Transition**: Fade back to Game Screen (immediate restart)

## Game Elements Detail

### Movement Parameters
```
Auto-run Speed: 400 pixels/second (increases by 50 every 20 meters)
Jump Height: 200 pixels
Jump Duration: 0.6 seconds
Duck Height Reduction: 50% of normal height
Duck Duration: While button pressed (max 2 seconds)
```

### Obstacle Patterns
```
Spawn Rate: Every 1.5-3 seconds (random)
Spawn Position: x: 2000 (off-screen right)
Obstacle Types:
  - Slime Puddle: Low obstacle (requires jump)
  - Pipe: High obstacle (requires duck)
  - Rat: Moving low obstacle (requires jump, moves at 200 px/s)
  - Spider: Drops from ceiling (requires duck)
  - Water Wave: Screen-wide low obstacle (requires jump)
  - Toxic Gas: Slows speed by 30% if touched
```

### Hazard Sequence (for 1-minute demo)
```
0-20m: Slime puddles only (tutorial phase)
20-40m: Add pipes, introduce ducking
40-60m: Add rats (moving obstacles)
60-80m: Add water waves (periodic danger)
80-100m: All hazards, increased speed
```

### Visual Feedback
- Screen shake on collision
- Roach sprite changes when jumping/ducking
- Speed lines appear when moving fast
- Obstacle flash red when approaching
- Distance meter pulses on milestones (25m, 50m, 75m)
- Trail effect behind roach when at high speed

### Audio Cues (Optional)
- Scurrying sound (looping)
- Jump sound effect
- Collision sound (hit obstacle)
- Water splash sound
- Sewer ambient sounds
- Speed up whoosh sound

## User Interface

### HUD Elements
- **Distance Counter**: Top left, large white numbers, "XXXm" format
- **Health/Lives**: Top right, 3 heart icons (lose 1 per hit)
- **Speed Indicator**: Small chevron indicators showing current speed level
- **Tutorial Prompts**: First 5 seconds only - "TAP TO JUMP" / "TAP TO DUCK"

### Control Layout (Two-Button Mode)
```
Left 75% of screen: Gameplay view
Right 25% of screen: Control buttons
  - Top button (700-850px Y): Duck icon
  - Bottom button (900-1050px Y): Jump icon
Both buttons: 300x150px, semi-transparent circles
```

### Control Layout (One-Button Mode - Simplified)
```
Entire screen: Tap anywhere to jump
Automatically ducks after jump (alternating)
```

## Placeholder Image Specifications

### background_sewer.png
- **Size**: 1920x1080
- **Content**: Dark sewer tunnel with brick walls, pipes, dripping water
- **Color Scheme**: Dark greens, browns, blacks with dim lighting
- **Format**: Placeholder = Horizontal gradient from dark green (left) to black (right) with horizontal lines suggesting pipes

### roach_player.png
- **Size**: 80x60
- **Content**: Cartoon cockroach with antennae, six legs
- **Format**: Placeholder = Brown oval with small legs and antennae

### water_wave.png
- **Size**: 1920x200
- **Content**: Wavy water surface rising from bottom
- **Format**: Placeholder = Blue-green gradient with wavy top edge

### slime_puddle.png
- **Size**: 150x100
- **Content**: Green slime puddle on ground
- **Format**: Placeholder = Green blob with highlights

### pipe_obstacle.png
- **Size**: 100x300
- **Content**: Metal pipe hanging from ceiling
- **Format**: Placeholder = Gray vertical rectangle

### rat_enemy.png
- **Size**: 120x80
- **Content**: Gray rat with tail
- **Format**: Placeholder = Gray oval with triangular head and tail line

### spider_enemy.png
- **Size**: 100x100
- **Content**: Spider hanging on web thread
- **Format**: Placeholder = Black circle with 8 leg lines

### toxic_gas.png
- **Size**: 200x200
- **Content**: Green gas cloud
- **Format**: Placeholder = Semi-transparent green cloud shape

### floor_tile.png
- **Size**: 200x200
- **Content**: Sewer floor tile texture
- **Format**: Placeholder = Dark gray rectangle with grid lines

### distance_meter.png
- **Size**: 300x80
- **Content**: Panel for distance display
- **Format**: Placeholder = Semi-transparent black rectangle with rounded corners

### game_over_panel.png
- **Size**: 800x400
- **Content**: Game over screen background
- **Format**: Placeholder = Dark semi-transparent rectangle with border

### button_retry.png
- **Size**: 250x90
- **Content**: "RETRY" button
- **Format**: Placeholder = Orange rectangle with white border

## Development Notes

### Simplified 1-Minute Demo Flow
```
[Instant Start] → [Gameplay 55s - Auto-running] → [End Screen 5s] → [Loop to Gameplay]
```

### Key Features for Demo
1. ✅ No loading screen - instant action
2. ✅ Auto-running eliminates need for movement control
3. ✅ Simple two-button or one-button control scheme
4. ✅ Progressive difficulty ramps up naturally
5. ✅ Clear visual feedback on all obstacles
6. ✅ Quick death and restart cycle

### Difficulty Progression
- **Easy Start**: 0-20m, simple obstacles, slow speed
- **Medium**: 20-60m, mixed obstacles, moderate speed
- **Hard**: 60-100m, all obstacles, fast speed

### Performance Targets
- 60 FPS on mobile devices
- Smooth scrolling background
- Instant button response (< 50ms)
- Asset loading < 500ms

## Completion Checklist
- [ ] All PNG placeholder images created
- [ ] Auto-running mechanics implemented
- [ ] Jump and duck controls working
- [ ] Obstacle spawning system functional
- [ ] Collision detection accurate
- [ ] Distance tracking implemented
- [ ] Speed progression working
- [ ] Game over and restart loop functional
- [ ] Visual feedback polished
- [ ] Touch controls optimized for mobile
