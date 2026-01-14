# Game Design Document: Safe No More

## Game Overview
A psychological horror game with alternating cycles of comfort and terror. Peaceful environments with friendly people and cute imagery slowly transform into nightmarish scenarios filled with threats.

## Technical Specifications

### Platform & Orientation
- **Platform**: Mobile (primary), Desktop fullscreen (secondary)
- **Orientation**: Horizontal (Landscape)
- **Screen Resolution**: 1920x1080 (16:9 aspect ratio)

### Image Assets & Specifications

| Asset Name | Size (px) | Description |
|------------|-----------|-------------|
| `background_safe.png` | 1920x1080 | Peaceful room environment |
| `background_horror.png` | 1920x1080 | Corrupted nightmare version |
| `character_friend.png` | 100x150 | Friendly NPC |
| `character_twisted.png` | 100x150 | Corrupted NPC form |
| `object_teddy.png` | 80x90 | Cute teddy bear |
| `object_teddy_evil.png` | 80x90 | Twisted teddy bear |
| `door_safe.png` | 120x200 | Normal door |
| `door_ominous.png` | 120x200 | Shadowy door |
| `shadow_creature.png` | 150x200 | Horror threat |
| `light_source.png` | 100x100 | Flashlight/lamp |
| `sanity_meter.png` | 350x70 | Mental stability bar |
| `button_interact.png` | 180x80 | Interaction button |
| `button_run.png` | 180x80 | Run/escape button |
| `vignette_effect.png` | 1920x1080 | Screen darkening overlay |

## Game Flow (1-Minute Demo)

### Intro Sequence (3 seconds - Story setup)
- Black screen
- Sound of footsteps and door opening
- Lights turn on revealing cheerful room
- Text: "Home Sweet Home..."
- Door closes behind you (ominous click)
- **No player input required** - Auto-advances to gameplay

### Game Screen (54 seconds)
- **Layout**:
  - Main view: First-person perspective of room
  - Top: Sanity meter
  - Bottom: Interaction button
  - Right: Run button (appears in horror phase)

- **ONE BUTTON MODE** (Primary): 
  - **Tap anywhere**: Context-sensitive action
  - Safe Phase: Auto-interacts with nearest safe object
  - Horror Phase: Auto-runs toward exit door
  
- **TWO BUTTON MODE** (Advanced):
  - **Interact button**: Examine objects (safe phase)
  - **Run button**: Flee from threats (horror phase)

**Cycle Structure (3 complete cycles in 54 seconds)**:

**CYCLE 1 (0-18s):**
- **Safe Phase** (10s):
  - Bright, colorful room
  - Friendly character appears: "Hello friend!"
  - Cute teddy bear on shelf
  - Calm music
  - Task: Find 2 objects to "feel at home"
  
- **Transition** (3s):
  - Lights flicker
  - Music distorts
  - Colors desaturate
  
- **Horror Phase** (5s):
  - Room darkens
  - Friend's face twists grotesquely
  - Teddy bear eyes glow red
  - Shadow creature emerges from corner
  - Must run through safe door
  - Sanity: -30%

**CYCLE 2 (18-36s):**
- **Safe Phase** (8s):
  - New room, brighter than before (false comfort)
  - Same friend appears: "You're safe now"
  - More cute objects
  - Player knows it's temporary
  
- **Transition** (2s):
  - Faster this time
  - More abrupt change
  
- **Horror Phase** (8s):
  - Longer horror sequence
  - Multiple shadow creatures
  - Objects animate menacingly
  - Friend chases player
  - Maze-like escape
  - Sanity: -40%

**CYCLE 3 (36-54s):**
- **Safe Phase** (6s):
  - Even brighter, almost garish
  - Everything seems "too perfect"
  - Player suspicious
  
- **Transition** (1s):
  - Instant snap to horror
  
- **Horror Phase** (11s):
  - Full nightmare mode
  - Everything hostile
  - Multiple threats
  - Frantic escape sequence
  - Sanity: -50%

**Win Condition**: Survive all 3 cycles (Sanity > 0%)
**Lose Condition**: Sanity reaches 0% OR caught by creature

### End Screen (4 seconds)
- **Survival**:
  - "YOU ESCAPED... FOR NOW"
  - Show: Cycles survived, Final sanity
  - "Return?" button (ominous)
  
- **Death**:
  - Black screen with whispers
  - "THEY GOT YOU"
  - Show: Cycle reached
  - "Try Again" button

## Game Elements

### Sanity System
```
Starting Sanity: 100%
Depletion:
  - Horror Phase 1: -30%
  - Horror Phase 2: -40%
  - Horror Phase 3: -50%
  
Restoration:
  - Each Safe Phase: +20%
  - Finding safe objects: +5% each
  
Critical States:
  - 100-70%: Normal perception
  - 70-40%: Visual distortions begin
  - 40-20%: Hallucinations, screen effects
  - < 20%: Severe distortions, imminent death
```

### Environment Transformation
```
SAFE MODE:
  - Bright, warm lighting
  - Pastel colors
  - Cheerful music
  - Friendly NPCs
  - Cute decorations
  
HORROR MODE:
  - Dark, cold lighting
  - Desaturated/red tones
  - Distorted, scary music
  - Hostile entities
  - Corrupted decorations
```

### Threat Types
```
SHADOW CREATURE:
  - Emerges from dark corners
  - Moves slowly toward player
  - Kills if it touches player
  - Vulnerable to light

TWISTED FRIEND:
  - Former friendly NPC
  - Chases player
  - Faster than shadow creatures
  - Can open doors

ANIMATED OBJECTS:
  - Toys come to life
  - Block paths
  - Create jumpscares
  - Can't kill but increase fear
```

### Interactive Objects (Safe Phase)
```
TEDDY BEAR:
  - Cute in safe mode
  - Click to hug: +5% sanity
  - Becomes evil in horror mode

PHOTO FRAME:
  - Shows happy memories
  - Click to examine: +5% sanity
  - Shows disturbing images in horror

LAMP:
  - Provides light
  - Click to turn on: Reveals clues
  - Flickers in horror mode
```

## Visual Feedback
- Sanity meter changes color: Blue → Yellow → Red
- Screen vignette darkens as sanity drops
- Visual glitches at low sanity
- Transition warnings (flicker effects)
- Shadow creature emergence (animated)
- Player heartbeat visual pulse
- Screen shake when threatened
- Color grading shifts dramatically

## Audio Cues
- Safe Phase: Calm, gentle music box melody
- Transition: Music distorts, slows down
- Horror Phase: Dissonant, tense ambient sounds
- Shadow creature: Low growling
- Twisted friend: Distorted laughter
- Footsteps behind player
- Heartbeat sound increases with danger

## User Interface

### HUD Elements
- **Sanity Meter** (Top center, 785, 40):
  - Horizontal bar, icon of mind/brain
  - Color shifts: Blue → Yellow → Orange → Red
  
- **Objective Text** (Top left, 100, 100):
  - Safe Phase: "Find comfort" / "Explore"
  - Horror Phase: "ESCAPE!" / "RUN!"

- **Interaction Prompt** (Bottom center, 960, 950):
  - Appears when near interactable object
  - Shows: "Press to [action]"

### Control Layout (Two-Button Mode)
```
Bottom left (300, 950):
  - Interact Button (180×80)
  - Used in safe phase for objects
  
Bottom right (1620, 950):
  - Run Button (180×80)
  - Only appears in horror phase
  - Hold to sprint to exit
```

### Control Layout (One-Button Mode)
```
Single tap anywhere:
  - Safe Phase: Interacts with nearest object
  - Horror Phase: Runs toward exit
  - Context-sensitive based on game state
```

## Placeholder Image Specifications

### background_safe.png
- **Size**: 1920x1080
- **Content**: Cozy room with warm lighting, furniture, decorations
- **Format**: Placeholder = Warm gradient (yellow/pink) with simple room shapes

### background_horror.png
- **Size**: 1920x1080
- **Content**: Same room but dark, corrupted, ominous
- **Format**: Placeholder = Dark gradient (black/dark red) with distorted shapes

### character_friend.png
- **Size**: 100x150
- **Content**: Friendly cartoon person
- **Format**: Placeholder = Simple smiling human figure, bright colors

### character_twisted.png
- **Size**: 100x150
- **Content**: Same character but corrupted, scary
- **Format**: Placeholder = Distorted figure, dark colors, unsettling features

### object_teddy.png
- **Size**: 80x90
- **Content**: Cute teddy bear
- **Format**: Placeholder = Brown bear shape with smile

### object_teddy_evil.png
- **Size**: 80x90
- **Content**: Scary teddy bear
- **Format**: Placeholder = Same bear but with red glowing eyes

### door_safe.png / door_ominous.png
- **Size**: 120x200
- **Content**: Door (normal vs shadowy)
- **Format**: Placeholder = Rectangle with doorknob, color varies

### shadow_creature.png
- **Size**: 150x200
- **Content**: Dark, amorphous horror entity
- **Format**: Placeholder = Black irregular shape with minimal detail

### light_source.png
- **Size**: 100x100
- **Content**: Flashlight or lamp
- **Format**: Placeholder = Yellow light cone

### sanity_meter.png
- **Size**: 350x70
- **Content**: Sanity level bar
- **Format**: Placeholder = Bar with gradient fill capability

### vignette_effect.png
- **Size**: 1920x1080
- **Content**: Screen darkening overlay
- **Format**: Placeholder = Radial gradient (transparent center to black edges)

## Development Notes

### Simplified 1-Minute Demo Flow
```
[Start 2s] → [Cycle 1: 18s] → [Cycle 2: 18s] → [Cycle 3: 18s] → [End 4s] → [Loop]
```

### Key Features
1. ✅ Psychological tension through cycles
2. ✅ Contrast between safe and horror
3. ✅ Sanity mechanic creates stakes
4. ✅ Simple controls (1-2 buttons)
5. ✅ Progressive difficulty
6. ✅ Unpredictability creates anxiety

### Horror Elements
- Subvert expectations (safe zones aren't truly safe)
- Build false sense of security
- Quick transitions shock player
- Familiar objects become threats
- Sound design amplifies tension

### Accessibility
- Visual horror (no jump scares harmful to those with conditions)
- Adjustable sanity drain
- Optional reduced effects mode
- Clear escape routes

### Performance Targets
- 60 FPS for smooth transitions
- Instant transition effects (< 100ms)
- Smooth lighting changes
- Responsive controls

## Completion Checklist
- [ ] All PNG placeholders created
- [ ] Safe/horror environment switching
- [ ] Sanity tracking system
- [ ] Threat AI and movement
- [ ] Interaction system
- [ ] Escape mechanics
- [ ] Visual effects (vignette, glitches)
- [ ] Cycle progression
- [ ] Win/lose conditions
- [ ] Atmospheric sound integration
