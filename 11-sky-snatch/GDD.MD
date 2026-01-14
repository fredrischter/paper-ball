# Game Design Document: Sky Snatch

## Game Overview
A humorous arcade-action game where players control UFOs to abduct humans, animals, and objects using tractor beams as chaos escalates and defenses activate.

## Technical Specifications

### Platform & Orientation
- **Platform**: Mobile (primary), Desktop fullscreen (secondary)
- **Orientation**: Horizontal (Landscape)
- **Screen Resolution**: 1920x1080 (16:9 aspect ratio)

### Image Assets & Specifications

| Asset Name | Size (px) | Description |
|------------|-----------|-------------|
| `background_city.png` | 1920x1080 | City landscape from above |
| `ufo_ship.png` | 150x100 | Player's UFO spacecraft |
| `tractor_beam.png` | 150x300 | Abduction beam effect |
| `human_target.png` | 50x80 | Human to abduct |
| `cow_target.png` | 70x50 | Cow to abduct |
| `car_target.png` | 80x50 | Vehicle to abduct |
| `building.png` | 200x300 | City building obstacle |
| `tree.png` | 60x120 | Tree obstacle |
| `tank_defense.png` | 100x70 | Military tank |
| `helicopter.png` | 120x80 | Attack helicopter |
| `missile.png` | 40x20 | Missile projectile |
| `score_multiplier.png` | 200x80 | Score multiplier display |
| `cargo_bay_panel.png` | 300x200 | Collected items display |
| `button_beam.png` | 180x180 | Tractor beam button |

## Game Flow (1-Minute Demo)

### Intro Sequence (4 seconds - Story setup)
- Space view of Earth
- Alien transmission crackles: "Mission: Specimen Collection"
- UFO warps in near Earth
- Beam activates briefly (test)
- Text: "QUOTA: 10 SPECIMENS"
- **No player input required** - Auto-advances to gameplay

### Game Screen (55 seconds)
- **Layout**:
  - Top-down view of city
  - UFO controlled by player (center focus)
  - Ground targets scattered below
  - Right panel: Abduction quota and cargo

- **ONE BUTTON MODE** (Primary - No Tilt): 
  - **Drag anywhere**: Move UFO
  - **Beam activates automatically** when over valid target
  - Lift finger to release targets
  
- **TILT MODE** (Alternative):
  - **Tilt device**: Move UFO
  - **Tap anywhere**: Toggle beam on/off
  - Auto-targets nearest object

**Timeline**:
- 0-15s: Tutorial - Abduct 3 humans, 2 cows peacefully
- 15-35s: City phase - Vehicles spawn, helicopters appear
- 35-50s: Military phase - Tanks and missiles attack
- 50-55s: Escape - Fly to mothership with cargo

**Objectives**:
- Abduct 10 targets (mixed types)
- Avoid 5 missiles
- Reach mothership

**Win**: Complete quota and reach mothership
**Lose**: UFO health reaches 0

### End Screen (4 seconds)
- Victory: "INVASION SUCCESS!"
- Show: Abductions, Combo multiplier, Final score
- "Next Zone" button

- Defeat: "UFO DESTROYED!"
- Show: Abductions completed, Time survived
- "Retry" button

## Game Elements

### UFO Controls
```
MOVEMENT:
  - Drag/tilt to move
  - Smooth acceleration (no instant stops)
  - Max speed: 400 px/second
  - Hover height: 300px above ground

TRACTOR BEAM:
  - Range: 200px radius
  - Pull speed: 150 px/second
  - Can hold 3 objects simultaneously
  - Heavier objects slower to lift
```

### Target Types & Values
```
HUMAN:
  - Points: 10
  - Weight: Light (quick abduction)
  - Special: Sometimes runs away

COW:
  - Points: 15
  - Weight: Medium
  - Special: None (easy target)

CAR:
  - Points: 25
  - Weight: Heavy (slow lift)
  - Special: Driver may escape

RARE TARGETS (later):
  - Dog: 20 points, very fast
  - Truck: 40 points, very heavy
  - Helicopter (steal it!): 100 points
```

### Defense Systems
```
HELICOPTER:
  - Appears at 20 second mark
  - Fires missiles if UFO stays too long
  - Can be abducted for bonus!

TANK:
  - Appears at 35 second mark
  - Stationary, fires at UFO
  - Cannot be abducted
  - Shoot 1 missile every 3 seconds

MISSILE:
  - Travels to UFO position
  - Deals 25 damage on hit
  - Can be dodged by moving
  - Warning indicator before launch
```

### Combo System
```
Continuous Abductions:
  - 3 in a row: 2x multiplier
  - 5 in a row: 3x multiplier
  - 8 in a row: 5x multiplier
  
Breaks on:
  - 3 seconds without abduction
  - Taking damage from missile
```

## Visual Feedback
- Tractor beam glows brighter with more objects
- Objects levitate slowly toward UFO
- Humans run and scream (comic style)
- Cows rotate humorously while levitating
- Screen shakes when missiles hit
- Combo counter grows with achievements
- UFO damage shows sparks and smoke
- Missile warning indicator flashes red

## User Interface

### HUD Elements
- **Quota Counter** (Top left, 100, 40): "Targets: 6/10"
- **Health Bar** (Top center, 960, 40): UFO health (start: 100)
- **Combo Multiplier** (Top right, 1720, 40): "x3 COMBO!"
- **Cargo Bay** (Right panel, 1650, 200): Shows captured items
- **Mothership Beacon** (Appears at 50s): Arrow pointing to escape zone

### Control Layout (Two-Button Mode)
```
Main screen: Drag area for UFO movement
Bottom center (960, 950):
  - Beam Button (180×180 circular): Hold to activate
  - Visual indicator shows beam range
```

### Control Layout (One-Button Mode)
```
Tilt device to move UFO
Tap anywhere on screen to activate beam
Beam auto-targets closest object in range
```

## Placeholder Image Specifications

### background_city.png
- **Size**: 1920x1080
- **Content**: Top-down view of city at night with lights
- **Format**: Placeholder = Dark blue/black with yellow light dots

### ufo_ship.png
- **Size**: 150x100
- **Content**: Classic flying saucer with lights
- **Format**: Placeholder = Gray disc with colored lights

### tractor_beam.png
- **Size**: 150x300
- **Content**: Glowing beam of light
- **Format**: Placeholder = Semi-transparent yellow cone gradient

### human_target.png
- **Size**: 50x80
- **Content**: Person from top-down view
- **Format**: Placeholder = Small human silhouette

### cow_target.png
- **Size**: 70x50
- **Content**: Cow from top-down view
- **Format**: Placeholder = Black and white cow shape

### car_target.png
- **Size**: 80x50
- **Content**: Car from top view
- **Format**: Placeholder = Rectangular car shape

### building.png
- **Size**: 200x300
- **Content**: Building viewed from above
- **Format**: Placeholder = Gray rectangle with window grid

### tank_defense.png
- **Size**: 100x70
- **Content**: Military tank
- **Format**: Placeholder = Dark green tank shape

### helicopter.png
- **Size**: 120x80
- **Content**: Attack helicopter
- **Format**: Placeholder = Helicopter shape with rotor

### missile.png
- **Size**: 40x20
- **Content**: Missile projectile
- **Format**: Placeholder = Red pointed oval

### button_beam.png
- **Size**: 180x180
- **Content**: Tractor beam activation button
- **Format**: Placeholder = Yellow circle with beam icon

## Development Notes

### Simplified 1-Minute Demo Flow
```
[Start 1s] → [Tutorial 15s] → [City Chaos 20s] → [Military Phase 15s] → [Escape 9s] → [Results 4s] → [Loop]
```

### Key Features
1. ✅ Simple drag/tilt controls
2. ✅ Satisfying abduction physics
3. ✅ Escalating challenge (defenses activate)
4. ✅ Humorous visuals and reactions
5. ✅ Combo system for skill rewards
6. ✅ Quick restart loop

### Humor Elements
- Exaggerated character reactions
- Silly sound effects
- Cows spinning in beam
- Humans flailing arms
- Comic explosion effects

### Performance Targets
- 60 FPS on mobile
- Smooth beam rendering
- Responsive tilt/drag controls
- Multiple objects in beam simultaneously

## Completion Checklist
- [ ] All PNG placeholders created
- [ ] UFO movement system
- [ ] Tractor beam mechanics
- [ ] Target spawning and AI
- [ ] Defense system (missiles, tanks)
- [ ] Combo tracking
- [ ] Health and damage
- [ ] Quota completion detection
- [ ] Mothership escape sequence
