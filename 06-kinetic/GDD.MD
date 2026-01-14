# Game Design Document: Kinetic

## Game Overview
A skill-based action game where movement is the core mechanic. Players perform precise sequences of dashes, jumps, attacks, and abilities to counter enemy behavior, with complexity increasing through longer input chains.

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
| `background_arena.png` | 1920x1080 | Combat arena environment |
| `player_character.png` | 100x120 | Player character sprite |
| `enemy_basic.png` | 90x110 | Basic enemy sprite |
| `enemy_fast.png` | 80x100 | Fast enemy sprite |
| `enemy_heavy.png` | 120x140 | Heavy enemy sprite |
| `dash_effect.png` | 150x50 | Dash motion trail |
| `attack_slash.png` | 120x120 | Attack effect animation |
| `combo_counter.png` | 300x100 | Combo display panel |
| `input_prompt.png` | 80x80 | Input button prompt |
| `button_dash.png` | 150x150 | Dash button (circular) |
| `button_jump.png` | 150x150 | Jump button (circular) |
| `button_attack.png` | 150x150 | Attack button (circular) |
| `health_bar.png` | 400x50 | Player health bar |
| `perfect_indicator.png` | 200x200 | "PERFECT" timing feedback |

## Game Flow (1-Minute Demo)

### 1. Start Screen (Auto-skip to tutorial)
- Brief flash: "FLOW STATE PROTOCOL INITIATED"
- **Transition**: Immediate to gameplay with first prompt

### 2. Game Screen (Main Gameplay - 56 seconds)
- **Layout**:
  - Center: Combat arena (main play area)
  - Player starts left side (400, 540)
  - Enemies approach from right
  - Bottom right: 3 action buttons in arc formation
  - Top: Combo counter and health
  - Center: Input prompts appear above enemies

- **Controls**: 
  - **THREE BUTTON MODE** (Standard):
    - **DASH** (bottom right, 1700, 950): Quick forward dash
    - **JUMP** (middle right, 1750, 800): Vertical jump/dodge
    - **ATTACK** (top right, 1700, 650): Strike attack
  
  - **SIMPLIFIED MODE**:
    - Tap enemy: Auto-performs correct action
    - Timing still matters for combos

- **Mechanics**:
  1. **Tutorial** (First 10 seconds):
     - Enemy A appears with "DASH" prompt
     - Player must hit DASH when enemy in range
     - Enemy B appears with "ATTACK" prompt
     - Enemy C appears with "JUMP" prompt (attack from above)
  
  2. **Combo Phase 1** (10-25 seconds):
     - 2-button sequences: "DASH → ATTACK"
     - Enemies telegraph moves with visual indicators
     - Correct sequence defeats enemy + builds combo
  
  3. **Combo Phase 2** (25-40 seconds):
     - 3-button sequences: "JUMP → DASH → ATTACK"
     - Faster enemy spawns
     - Must maintain rhythm
  
  4. **Final Challenge** (40-56 seconds):
     - 4-button sequences: "DASH → JUMP → DASH → ATTACK"
     - Multiple enemies with different patterns
     - Perfect timing required

- **Combo System**:
  - Correct input: +1 combo, +10 points
  - Perfect timing (< 0.1s): +2 combo, +25 points, "PERFECT!" flash
  - Wrong input or missed timing: Combo resets, take damage
  - Combo multiplier: Points × combo count

- **Win Condition**: Defeat 15 enemies and achieve 50+ combo
- **Lose Condition**: Health reaches 0

### 3. End Screen (4 seconds)
- **Victory Screen**:
  - Display: "FLOW STATE ACHIEVED"
  - Show: Max combo, Perfect inputs, Total score
  - "Continue Flow" button
  
- **Defeat Screen**:
  - Display: "FLOW INTERRUPTED"
  - Show: Max combo achieved, Enemies defeated
  - "Retry" button

- **Transition**: Loop to gameplay

## Game Elements Detail

### Input System
```
Timing Windows:
  - Perfect: ±0.1 seconds (blue flash)
  - Good: ±0.25 seconds (green flash)
  - Late/Early: ±0.5 seconds (yellow flash, reduced damage)
  - Miss: > 0.5 seconds (red flash, no damage, combo broken)

Input Sequences (Progressive):
  - Wave 1: Single buttons
  - Wave 2: 2-button combos
  - Wave 3: 3-button combos
  - Wave 4: 4-button combos
  - Wave 5: Mixed 2-4 button combos
```

### Enemy Types & Patterns
```
BASIC ENEMY:
  - Health: 1 hit
  - Sequence: Single button (random)
  - Speed: Slow approach
  - Points: 10

FAST ENEMY:
  - Health: 2 hits
  - Sequence: 2-button combo
  - Speed: Quick approach
  - Points: 25

HEAVY ENEMY:
  - Health: 3 hits
  - Sequence: 3-button combo
  - Speed: Very slow
  - Points: 40

ELITE ENEMY (final wave):
  - Health: 4 hits
  - Sequence: 4-button combo
  - Speed: Medium
  - Points: 60
```

### Visual Feedback System
- **Input Prompts**: Appear 2 seconds before action needed
- **Enemy Telegraphs**: Color-coded attacks
  - Red glow: ATTACK required
  - Blue glow: DASH required
  - Yellow glow: JUMP required
- **Combo Meter**: Fills with each success, empties on miss
- **Screen Effects**: Slow-motion on perfect timing (0.2s)
- **Trail Effects**: Character leaves motion trails during combos
- **Impact Frames**: Brief freeze on successful hits

### Progression Curve
```
0-10s: Tutorial (single inputs)
10-25s: Basic combos (2 buttons)
25-40s: Advanced combos (3 buttons)
40-56s: Master combos (4 buttons + speed)
```

### Audio Cues (Optional)
- Distinct sound for each button press
- "Whoosh" for dash
- "Clang" for attack
- "Hop" for jump
- Combo build-up music intensity
- "Ting" for perfect timing
- "Break" sound for missed combo
- Rhythmic background beat matching input timing

## User Interface

### HUD Elements
- **Combo Counter**: Top center (960, 80), large numbers with multiplier
- **Health Bar**: Top left (200, 50), segments for each hit point
- **Score**: Top right (1720, 50), running total with combo bonus
- **Input Prompt**: Above enemy (follows enemy position), icon + text
- **Perfect Indicator**: Center screen (960, 400), appears briefly on perfect timing

### Button Layout (Three-Button Mode)
```
Arc formation on right side:
  - Attack Button: (1700, 650) - Circular, 150px diameter, RED
  - Jump Button: (1750, 800) - Circular, 150px diameter, YELLOW
  - Dash Button: (1700, 950) - Circular, 150px diameter, BLUE

All buttons: Semi-transparent when not prompted
Highlighted when prompt active
Glow effect on correct timing
```

## Placeholder Image Specifications

### background_arena.png
- **Size**: 1920x1080
- **Content**: Minimalist arena with grid floor, neon outlines
- **Color Scheme**: Dark purple/blue with neon accents
- **Format**: Placeholder = Dark gradient with grid pattern

### player_character.png
- **Size**: 100x120
- **Content**: Sleek warrior in ready stance
- **Format**: Placeholder = White humanoid silhouette with energy outline

### enemy_basic.png
- **Size**: 90x110
- **Content**: Basic enemy type
- **Format**: Placeholder = Red humanoid silhouette

### enemy_fast.png
- **Size**: 80x100
- **Content**: Agile enemy type
- **Format**: Placeholder = Orange slender humanoid silhouette

### enemy_heavy.png
- **Size**: 120x140
- **Content**: Large armored enemy
- **Format**: Placeholder = Dark red bulky humanoid silhouette

### dash_effect.png
- **Size**: 150x50
- **Content**: Motion trail effect
- **Format**: Placeholder = Blue streaked gradient

### attack_slash.png
- **Size**: 120x120
- **Content**: Slash attack effect
- **Format**: Placeholder = Red curved arc/crescent

### combo_counter.png
- **Size**: 300x100
- **Content**: Combo display panel background
- **Format**: Placeholder = Semi-transparent white rectangle with glow

### input_prompt.png
- **Size**: 80x80
- **Content**: Button prompt icon
- **Format**: Placeholder = Circle with button symbol inside

### button_dash.png
- **Size**: 150x150
- **Content**: Dash button
- **Format**: Placeholder = Blue circle with forward arrow

### button_jump.png
- **Size**: 150x150
- **Content**: Jump button
- **Format**: Placeholder = Yellow circle with up arrow

### button_attack.png
- **Size**: 150x150
- **Content**: Attack button
- **Format**: Placeholder = Red circle with sword/fist icon

### health_bar.png
- **Size**: 400x50
- **Content**: Health bar with segments
- **Format**: Placeholder = White outline with green/red fill capability

### perfect_indicator.png
- **Size**: 200x200
- **Content**: "PERFECT" text with effect
- **Format**: Placeholder = Gold text with star burst

## Development Notes

### Simplified 1-Minute Demo Flow
```
[Instant Start] → [Tutorial 10s] → [Phase 1: 15s] → [Phase 2: 15s] → [Final 16s] → [Results 4s] → [Loop]
```

### Key Features for Demo
1. ✅ Immediate action, no delays
2. ✅ Clear visual prompts for all inputs
3. ✅ Satisfying feedback on timing
4. ✅ Progressive difficulty curve
5. ✅ Rhythm-based gameplay loop
6. ✅ Three-button control (expandable to simplified mode)

### Rhythm & Flow
- Enemy spawns timed to create rhythm
- Input windows encourage flow state
- Perfect timing rewards create satisfaction
- Combo system provides goals
- Visual effects enhance sense of speed

### Accessibility Options
- Timing windows adjustable
- Visual prompts can be enlarged
- Color-blind mode (different enemy colors)
- Simplified auto-input mode available

### Performance Targets
- 60 FPS mandatory (rhythm timing dependent)
- Input latency < 16ms
- Touch response instant
- Effects don't impact performance

## Completion Checklist
- [ ] All PNG placeholder images created
- [ ] Three-button input system
- [ ] Timing detection system (perfect/good/miss)
- [ ] Enemy spawning and AI
- [ ] Input sequence system
- [ ] Combo counter and scoring
- [ ] Visual feedback effects
- [ ] Health system
- [ ] Win/lose conditions
- [ ] Results screen and loop
- [ ] Performance optimization for 60 FPS
