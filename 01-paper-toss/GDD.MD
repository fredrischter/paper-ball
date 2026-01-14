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
| `hand_idle.png` | 150x150 | Hand in neutral position |
| `hand_back.png` | 150x150 | Hand pulled back (wind-up) |
| `hand_forward.png` | 150x150 | Hand extended forward (release) |
| `manager_walk.png` | 180x250 | Manager character sprite (walking animation) |
| `paper_stack.png` | 120x80 | Stack of papers manager hands over |
| `speech_bubble.png` | 500x150 | Speech bubble for manager dialogue |
| `fan.png` | 180x180 | Rotating office fan |
| `wind_indicator.png` | 100x40 | Wind direction arrow |
| `power_meter.png` | 60x200 | Vertical power meter bar |
| `score_panel.png` | 400x100 | Score display background |
| `button_throw.png` | 180x180 | Throw button (circular) |
| `success_effect.png` | 256x256 | Success particle effect |

## Game Flow (1-Minute Demo)

### 1. Intro Sequence (5 seconds - Story setup)
- Office background fades in
- Manager character walks in from left side (1 second walk animation)
- Manager stops at center, places paper stack on desk
- Speech bubble appears: **"Prepare this report for tomorrow!"**
- Manager walks away to the right (1 second exit animation)
- Camera focuses on desk with hand and paper stack
- **No player input required** - Auto-advances to gameplay

### 2. Game Screen (Main Gameplay - 50 seconds)
- **Layout**:
  - Left side: Hand position (x: 300, y: 540)
  - Right side: Trash bin (x: 1500, y: 800)
  - Top center: Fan rotating (x: 960, y: 200)
  - Top right: Score display (x: 1700, y: 50)
  - Top left: Timer (x: 100, y: 50)
  - Bottom right: Throw button (x: 1650, y: 900)
  - Bottom center: Power meter (x: 960, y: 900)

- **Controls**: 
  - **ONE BUTTON**: Throw button (hold and release)
  - Press and hold button to charge throw power
  - Hand animates back-and-forth continuously (wind-up motion)
  - Power meter fills while button is held
  - Release button to throw at current power level
  
- **Mechanics**:
  1. Hand continuously animates in wind-up motion (even when not throwing)
  2. Player holds throw button to charge power (max 2 seconds)
  3. Power meter shows current throw strength (0-100%)
  4. Release button triggers throw with charged power
  5. Wind from fan affects ball mid-flight (random direction every 3 seconds)
  6. Score +1 if ball lands in bin
  7. Hand returns to wind-up animation, ready for next throw
  
- **Win Condition**: Score 5 points in 1 minute
- **Lose Condition**: Time runs out with score < 5

### 3. End Screen (5 seconds)
- **Success Screen** (if won):
  - Display: "Good Work! Boss is Happy!"
  - Show: Score X/5
  - Auto-restart after 3 seconds
  
- **Fail Screen** (if lost):
  - Display: "Boss Won't Be Happy..."
  - Show: Score X/5
  - Auto-restart after 3 seconds

- **Transition**: Fade back to Intro Sequence (full loop)

## Game Elements Detail

### Physics Parameters
```
Gravity: 980 pixels/second²
Initial Velocity: Based on power meter (0-100% = 400-1200 px/s)
Wind Force: Random between -200 to +200 px/s horizontal
Air Resistance: 0.98 multiplier per frame
Ball Mass: 10 (for physics calculations)
Throw Angle: Fixed at 45 degrees upward
```

### Hand Animation System
```
Wind-up Animation Loop (continuous):
  - Frame 1-10: Hand pulls back (hand_back.png)
  - Frame 11-20: Hand moves forward (hand_forward.png)
  - Frame 21-30: Hand returns to back position
  - Cycle Duration: 1.5 seconds per full loop
  
Throw Trigger:
  - When button released, current frame determines slight angle variation
  - Hand completes throw animation
  - Returns to wind-up loop
```

### Visual Feedback
- Hand continuously animates in throwing motion
- Power meter fills during button hold (vertical bar, green to red gradient)
- Wind indicator arrow shows current wind direction
- Ball trail effect during flight
- Bounce effect on bin rim (if hit)
- Success particles when ball lands in bin
- Manager appears briefly at successful shots (thumbs up gesture)

### Audio Cues (Optional)
- Whoosh sound on throw
- Bin clang on successful shot
- Fan ambient sound (looping)
- Success jingle
- Ambient office sounds

## User Interface

### HUD Elements
- **Score Counter**: Top right (1700, 50), white text, shadow effect
- **Timer**: Top left (100, 50), countdown from 60 seconds
- **Wind Indicator**: Bottom center (960, 1000), animated arrow
- **Power Meter**: Bottom center (960, 900), vertical bar (fills green→yellow→red)
- **Throw Button**: Bottom right (1650, 900), circular button (180x180)

### Touch/Click Zones
- **Throw Button**: Circular touch area, bottom right
- Hold = charge power
- Release = throw at current power level

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

### hand_idle.png
- **Size**: 150x150
- **Content**: Cartoon hand in neutral throwing position
- **Format**: Placeholder = Beige hand shape, relaxed

### hand_back.png
- **Size**: 150x150
- **Content**: Hand pulled back in wind-up position
- **Format**: Placeholder = Beige hand shape, pulled backward

### hand_forward.png
- **Size**: 150x150
- **Content**: Hand extended forward in release position
- **Format**: Placeholder = Beige hand shape, extended forward

### manager_walk.png
- **Size**: 180x250
- **Content**: Manager character (suit, briefcase), side view for walking
- **Format**: Placeholder = Gray suited figure silhouette

### paper_stack.png
- **Size**: 120x80
- **Content**: Stack of white papers
- **Format**: Placeholder = White rectangles stacked

### speech_bubble.png
- **Size**: 500x150
- **Content**: Comic-style speech bubble with tail pointing down
- **Format**: Placeholder = White rounded rectangle with tail

### fan.png
- **Size**: 180x180
- **Content**: Office desk fan with visible blades
- **Format**: Placeholder = Circle with three lines (blades)

### wind_indicator.png
- **Size**: 100x40
- **Content**: Arrow showing wind direction
- **Format**: Placeholder = Simple arrow shape

### power_meter.png
- **Size**: 60x200
- **Content**: Vertical power meter bar background
- **Format**: Placeholder = Vertical rectangle with segments

### score_panel.png
- **Size**: 400x100
- **Content**: Panel background for score display
- **Format**: Placeholder = Semi-transparent dark rectangle with rounded corners

### button_throw.png
- **Size**: 180x180
- **Content**: Circular throw button with icon
- **Format**: Placeholder = Green circle with hand/throw icon

### success_effect.png
- **Size**: 256x256
- **Content**: Star burst or confetti particle
- **Format**: Placeholder = Yellow star shape

## Development Notes

### Simplified 1-Minute Demo Flow
```
[Intro Story 5s] → [Gameplay 50s] → [End Screen 5s] → [Loop to Intro]
```

### Key Features for Demo
1. ✅ Story-driven intro (manager sets up context)
2. ✅ ONE BUTTON control (hold and release)
3. ✅ Continuous hand animation (always in motion)
4. ✅ Power-based throwing (no drag controls)
5. ✅ Clear visual feedback (power meter, animations)
6. ✅ Quick restart loop for replayability

### Animation Sequence Details
```
INTRO (5 seconds):
  0.0s - Fade in office background
  0.5s - Manager walks in from left (1s walk)
  1.5s - Manager stops, places papers
  2.0s - Speech bubble appears with text
  3.5s - Speech bubble fades
  4.0s - Manager walks out right (1s walk)
  5.0s - Transition to gameplay

GAMEPLAY LOOP:
  - Hand continuously animates (1.5s cycle)
  - Player holds button to charge power
  - Release triggers throw
  - Ball flies with physics + wind
  - Score updates if successful
  - Repeat until timer ends

END SCREEN (5s):
  - Show results
  - Auto-restart (no button needed)
```

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
