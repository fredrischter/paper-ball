# Game Design Document: Paper Toss!

## Game Overview
A casual physics-based mobile game where players throw paper balls into office trash bins with wind mechanics and precise trajectory controls.

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
| `background.png` | 1920x1080 | Office environment background |
| `trash_bin.png` | 200x300 | Target trash bin sprite |
| `paper_ball.png` | 64x64 | Paper ball projectile |
| `hand.png` | 150x150 | Player's hand for throwing |
| `fan.png` | 180x180 | Rotating office fan |
| `wind_indicator.png` | 100x40 | Wind direction arrow |
| `trajectory_line.png` | 4x4 | Dotted line segment for trajectory |
| `score_panel.png` | 400x100 | Score display background |
| `button_restart.png` | 200x80 | Restart button |
| `title_logo.png` | 600x200 | Game title logo |
| `success_effect.png` | 256x256 | Success particle effect |

## Game Flow (1-Minute Demo)

### 1. Start Screen (Auto-skip after 2 seconds)
- Display game logo centered
- "Tap to Start" text pulsing
- **Input**: Single tap/click anywhere
- **Transition**: Fade to Game Screen

### 2. Game Screen (Main Gameplay - 50 seconds)
- **Layout**:
  - Left side: Hand starting position (x: 300, y: 540)
  - Right side: Trash bin (x: 1500, y: 800)
  - Top center: Fan rotating (x: 960, y: 200)
  - Top right: Score display (x: 1700, y: 50)
  - Bottom: Wind indicator (x: 960, y: 1000)

- **Controls**: 
  - **Primary**: Touch/Mouse drag and release
  - Drag from hand to aim
  - Drag distance = throw power (max 500px)
  - Release to throw
  
- **Mechanics**:
  1. Player drags finger/mouse from hand position
  2. Dotted trajectory line shows predicted path (affected by wind)
  3. Release triggers throw with physics
  4. Wind from fan affects ball mid-flight (random direction every 3 seconds)
  5. Score +1 if ball lands in bin
  6. Ball respawns after 2 seconds or upon landing
  
- **Win Condition**: Score 5 points in 1 minute
- **Lose Condition**: Time runs out with score < 5

### 3. End Screen (8 seconds)
- **Success Screen** (if won):
  - Display: "Great Job! Score: X/5"
  - Confetti animation
  - Buttons: "Play Again" (300x100)
  
- **Fail Screen** (if lost):
  - Display: "Try Again! Score: X/5"
  - Buttons: "Retry" (300x100)

- **Input**: Single button tap
- **Transition**: Fade back to Game Screen (skip title)

## Game Elements Detail

### Physics Parameters
```
Gravity: 980 pixels/second²
Initial Velocity: Based on drag distance (max 1200 px/s)
Wind Force: Random between -200 to +200 px/s horizontal
Air Resistance: 0.98 multiplier per frame
Ball Mass: 10 (for physics calculations)
```

### Visual Feedback
- Trajectory line updates in real-time during drag
- Wind indicator arrow shows current wind direction
- Ball trail effect during flight
- Bounce effect on bin rim (if hit)
- Success particles when ball lands in bin
- Shake animation on hand when ready to throw

### Audio Cues (Optional)
- Whoosh sound on throw
- Bin clang on successful shot
- Fan ambient sound (looping)
- Success jingle
- Ambient office sounds

## User Interface

### HUD Elements
- **Score Counter**: Top right, white text, shadow effect
- **Timer**: Top left, countdown from 60 seconds
- **Wind Indicator**: Bottom center, animated arrow
- **Power Meter**: Appears during drag, vertical bar showing throw strength

### Touch/Click Zones
- **Entire Screen**: Drag interaction area
- **Restart Button**: Always visible, top-left corner (80x80, semi-transparent)

## Placeholder Image Specifications

### background.png
- **Size**: 1920x1080
- **Content**: Office setting with desk, window, filing cabinets
- **Color Scheme**: Soft blues and grays, well-lit
- **Format**: Placeholder = Gradient from light blue (top) to gray (bottom)

### trash_bin.png
- **Size**: 200x300
- **Content**: Office wastebasket, slightly tilted for easier shots
- **Format**: Placeholder = Gray rectangle with darker top circle

### paper_ball.png
- **Size**: 64x64
- **Content**: Crumpled white paper ball with shadows
- **Format**: Placeholder = White circle with gray shading

### hand.png
- **Size**: 150x150
- **Content**: Cartoon hand in throwing position
- **Format**: Placeholder = Beige hand shape

### fan.png
- **Size**: 180x180
- **Content**: Office desk fan with visible blades
- **Format**: Placeholder = Circle with three lines (blades)

### wind_indicator.png
- **Size**: 100x40
- **Content**: Arrow showing wind direction
- **Format**: Placeholder = Simple arrow shape

### trajectory_line.png
- **Size**: 4x4
- **Content**: Small dot for dotted line
- **Format**: Placeholder = Semi-transparent white circle

### score_panel.png
- **Size**: 400x100
- **Content**: Panel background for score display
- **Format**: Placeholder = Semi-transparent dark rectangle with rounded corners

### button_restart.png
- **Size**: 200x80
- **Content**: Button with "Restart" text
- **Format**: Placeholder = Green rectangle with white border

### title_logo.png
- **Size**: 600x200
- **Content**: "Paper Toss!" stylized text
- **Format**: Placeholder = White text on transparent background

### success_effect.png
- **Size**: 256x256
- **Content**: Star burst or confetti particle
- **Format**: Placeholder = Yellow star shape

## Development Notes

### Simplified 1-Minute Demo Flow
```
[Auto-skip Title 2s] → [Gameplay 50s] → [End Screen 8s] → [Loop to Gameplay]
```

### Key Features for Demo
1. ✅ Instant gameplay start (minimal loading)
2. ✅ Clear visual feedback on all actions
3. ✅ Simple one-finger/one-button control
4. ✅ Satisfying physics and trajectory prediction
5. ✅ Quick restart loop for replayability

### Performance Targets
- 60 FPS on mobile devices
- Touch response < 16ms
- Asset loading < 1 second

## Completion Checklist
- [ ] All PNG placeholder images created
- [ ] Physics system implemented
- [ ] Trajectory prediction working
- [ ] Wind mechanics functional
- [ ] Score tracking implemented
- [ ] Timer countdown working
- [ ] End screen with restart loop
- [ ] Touch/mouse controls responsive
- [ ] Assets optimized for mobile
