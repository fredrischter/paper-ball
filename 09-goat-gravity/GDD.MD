# Game Design Document: Goat Gravity

## Game Overview
A physics-driven arcade game where goats climb mountains, descend slopes, and knock rivals off terrain using momentum, collisions, and environmental chaos.

## Technical Specifications

### Platform & Orientation
- **Platform**: Mobile (primary), Desktop fullscreen (secondary)
- **Orientation**: Horizontal (Landscape)
- **Screen Resolution**: 1920x1080 (16:9 aspect ratio)

### Image Assets & Specifications

| Asset Name | Size (px) | Description |
|------------|-----------|-------------|
| `background_mountain.png` | 1920x1080 | Mountain landscape |
| `goat_player.png` | 80x70 | Player goat sprite |
| `goat_rival.png` | 80x70 | AI rival goat |
| `rock_obstacle.png` | 100x100 | Boulder obstacle |
| `slope_ramp.png` | 200x100 | Slope terrain piece |
| `cliff_edge.png` | 150x300 | Cliff drop-off |
| `grass_tuft.png` | 50x30 | Grass decoration |
| `flag_checkpoint.png` | 60x120 | Mountain checkpoint flag |
| `button_jump.png` | 180x180 | Jump button (circular) |
| `button_charge.png` | 180x180 | Charge/ram button |
| `score_panel.png` | 300x100 | Score display |
| `knockoff_effect.png` | 128x128 | Explosion/impact effect |

## Game Flow (1-Minute Demo)

### Intro Sequence (3 seconds - Story setup)
- Mountain peak silhouette against sunset
- Rival goat stands at summit (silhouette)
- Text: "THERE CAN BE ONLY ONE KING"
- Your goat appears at base, looks up determined
- **No player input required** - Auto-advances to gameplay

### Game Screen (56 seconds)
- **Layout**: Side-scrolling mountain terrain
- **ONE BUTTON MODE** (Primary): 
  - **Tap anywhere**: Jump (auto-charges if held > 0.5s)
  - Quick tap = normal jump
  - Hold tap = charge attack
  
- **TWO BUTTON MODE** (Advanced): 
  - **Jump button** (right bottom): Tap to jump
  - **Charge button** (right top): Tap to ram attack

**Gameplay**:
- 0-20s: Climb slopes, basic jumping
- 20-40s: Rivals appear, initiate collisions
- 40-56s: Steep terrain, multiple rivals, chaos

**Objectives**:
- Knock off 5 rival goats
- Reach mountaintop checkpoint
- Don't fall off yourself!

**Win**: Reach summit with 3+ knockoffs
**Lose**: Fall off mountain 3 times

### End Screen (4 seconds)
- Victory: "KING OF THE MOUNTAIN!"
- Show: Rivals knocked off, Height reached
- "Climb Again" → Loop

## Game Elements

### Physics Parameters
```
Gravity: 1200 px/s²
Jump Force: 600 px/s
Charge Speed: 500 px/s
Momentum Carry: 0.95 (slippery slopes)
Collision Force: Based on speed
```

### Terrain Elements
```
SLOPES: Increase momentum downward
CLIFFS: Instant KO if fallen off
ROCKS: Obstacles to jump over
FLAT AREAS: Safe zones for positioning
```

### Goat Abilities
```
JUMP: Basic movement
CHARGE: Ram attack, knockback enemies
MOMENTUM: Natural physics create emergent gameplay
```

## Placeholder Images
- **background_mountain.png** (1920x1080): Mountain with slopes
- **goat_player.png** (80x70): White goat with horns
- **goat_rival.png** (80x70): Brown rival goats
- **rock_obstacle.png** (100x100): Gray boulder
- **slope_ramp.png** (200x100): Green grassy slope

## Controls
- Jump button (right side, bottom)
- Charge button (right side, top)
- Or single-tap mode with auto-charge

## Completion Checklist
- [ ] PNG placeholders created
- [ ] Physics engine (gravity, momentum)
- [ ] Collision system
- [ ] Terrain generation
- [ ] Rival AI
- [ ] Knockoff detection
- [ ] Win/lose conditions
