# Game Design Document: Alien Autopsy

## Game Overview
A dark management and simulation game where players perform autopsies on alien bodies in a secret laboratory, dissecting tissues, extracting organs, and managing contamination risks.

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
| `background_lab.png` | 1920x1080 | Secret laboratory environment |
| `autopsy_table.png` | 800x600 | Operating table with equipment |
| `alien_body.png` | 600x400 | Alien subject on table |
| `scalpel_tool.png` | 100x100 | Surgical scalpel cursor |
| `forceps_tool.png` | 100x100 | Forceps tool cursor |
| `scanner_tool.png` | 100x100 | Scanning device cursor |
| `organ_heart.png` | 120x120 | Alien heart organ |
| `organ_brain.png` | 150x120 | Alien brain organ |
| `organ_unknown.png` | 100x100 | Mysterious organ |
| `contamination_meter.png` | 300x60 | Contamination level bar |
| `timer_panel.png` | 250x80 | Time remaining display |
| `tool_panel.png` | 400x120 | Tool selection interface |
| `results_panel.png` | 900x600 | Results screen background |
| `button_continue.png` | 220x80 | Continue button |

## Game Flow (1-Minute Demo)

### 1. Intro Sequence (3 seconds - Story setup)
- Facility alarm blares
- Containment pod opens with steam
- Alien body revealed on autopsy table
- Radio voice: "New specimen. Proceed with analysis."
- Tools appear on tray
- **No player input required** - Auto-advances to gameplay

### 2. Game Screen (Main Gameplay - 54 seconds)
- **Layout**:
  - Center: Alien body on autopsy table (960x540)
  - Left panel: Tool selection (x: 100, y: 200)
  - Right panel: Objectives checklist (x: 1650, y: 200)
  - Top: Contamination meter and timer (y: 40)
  - Bottom: Instruction text (y: 1000)

- **Controls**: 
  - **SINGLE BUTTON MODE** (Simplified):
    - **Tap on body**: Automatically uses correct tool for that area
    - Organs auto-extract when exposed
  
  - **TWO BUTTON MODE** (Standard):
    - **Select Tool**: Tap tool icon (left panel)
    - **Use Tool**: Tap/drag on alien body
    - Different tools for different tasks

- **Mechanics**:
  1. **Scan Phase** (5 seconds):
     - Use scanner to identify organ locations
     - 3 organs highlighted: Heart, Brain, Unknown
  
  2. **Incision Phase** (15 seconds):
     - Use scalpel to cut along highlighted lines
     - Follow the glowing path
     - Precision affects contamination
  
  3. **Extraction Phase** (25 seconds):
     - Use forceps to remove organs carefully
     - Drag organs to collection tray
     - Must extract all 3 organs
     - Careful movements reduce contamination
  
  4. **Analysis** (9 seconds):
     - Each organ auto-analyzes
     - Discoveries unlock as organs are examined
     - Final contamination level calculated

- **Objectives**:
  - ✓ Scan the specimen
  - ✓ Extract heart
  - ✓ Extract brain  
  - ✓ Extract unknown organ
  - ✓ Keep contamination below 80%

- **Win Condition**: Extract all organs with contamination < 80%
- **Lose Condition**: Contamination reaches 100% OR time runs out

### 3. End Screen (5 seconds)
- **Success Screen**:
  - Display: "AUTOPSY COMPLETE"
  - Show: Organs discovered, Contamination level, Time taken
  - "Next Specimen" button
  
- **Failure Screen**:
  - Display: "CONTAMINATION BREACH" or "TIME EXPIRED"
  - Show: Progress made
  - "Retry" button

- **Transition**: Loop to new specimen (Game Screen)

## Game Elements Detail

### Tool System
```
SCANNER:
  - Function: Reveals organ locations
  - Usage: Drag over body
  - Time: 3-5 seconds to complete scan
  - Contamination: 0%

SCALPEL:
  - Function: Makes incisions
  - Usage: Drag along highlighted paths
  - Precision required: Stay within 20px of line
  - Contamination: +5% per deviation

FORCEPS:
  - Function: Extracts organs
  - Usage: Tap organ, drag to tray
  - Speed affects contamination: Slow = 0%, Fast = +10%
  - Must be gentle
```

### Contamination System
```
Starting Level: 0%
Increases from:
  - Rough scalpel work: +5% per mistake
  - Fast organ extraction: +10%
  - Dropped organs: +15%
  - Idle time: +1% per 2 seconds

Decreases from:
  - Using scanner: -0% (neutral)
  - Precise movements: -0% (neutral, just doesn't increase)

Critical: 100% = Instant failure
Warning: 80%+ = Red warning flashes
```

### Organ Extraction Sequence
```
1. HEART (Bottom right):
   - Scan reveals location
   - Cut pattern: U-shape
   - Extraction difficulty: Easy
   - Points: 25

2. BRAIN (Top center):
   - Scan reveals location
   - Cut pattern: Circle
   - Extraction difficulty: Medium
   - Points: 35

3. UNKNOWN ORGAN (Left center):
   - Scan reveals location
   - Cut pattern: Irregular zigzag
   - Extraction difficulty: Hard
   - Points: 40
```

### Visual Feedback
- Scanner beam sweeps across body
- Organs glow when scanned
- Incision lines light up blue (correct) or red (off-path)
- Contamination meter fills red as level increases
- Organ pulses when ready to extract
- Success sparkles when organ collected
- Blood/fluid effects (stylized, not graphic)
- Screen borders pulse red at high contamination

### Audio Cues (Optional)
- Scanner beep sounds
- Scalpel cutting sound
- Organ extraction squelch (subtle)
- Contamination warning beep
- Success chime when organ secured
- Ambient lab machinery hum
- Timer tick at final 10 seconds

## User Interface

### HUD Elements
- **Contamination Meter**: Top left (200, 40), fills left-to-right, green→yellow→red
- **Timer**: Top right (1720, 40), "00:54" countdown format
- **Objectives Checklist**: Right panel (1650, 200), checkboxes appear as completed
- **Tool Selection**: Left panel (100, 200), 3 large tool icons (100×100 each)
- **Collection Tray**: Bottom right (1500, 850), shows collected organs (200×150)

### Control Layout (Single Button Mode)
```
Entire alien body: Interactive tap zones
  - Tap appropriate area with auto-tool selection
  - Visual hints show where to tap next
  - Simplified for quick play
```

### Control Layout (Two Button Mode)
```
Tool Panel (left side):
  - Scanner icon (100, 300)
  - Scalpel icon (100, 450)
  - Forceps icon (100, 600)
  
Selected tool: Follows cursor/finger
Active tool: Highlighted with glow effect
```

## Placeholder Image Specifications

### background_lab.png
- **Size**: 1920x1080
- **Content**: Sterile laboratory with equipment, monitors, containment units
- **Color Scheme**: Dark blues, sterile whites, steel grays
- **Format**: Placeholder = Dark blue gradient with white equipment silhouettes

### autopsy_table.png
- **Size**: 800x600
- **Content**: Metallic operating table with overhead lights
- **Format**: Placeholder = Gray rectangle with lighter gray center

### alien_body.png
- **Size**: 600x400
- **Content**: Alien subject (grey, humanoid but distinctly non-human)
- **Format**: Placeholder = Gray humanoid silhouette with enlarged head

### scalpel_tool.png
- **Size**: 100x100
- **Content**: Surgical scalpel
- **Format**: Placeholder = Silver blade shape with handle

### forceps_tool.png
- **Size**: 100x100
- **Content**: Surgical forceps/tweezers
- **Format**: Placeholder = Two silver prongs

### scanner_tool.png
- **Size**: 100x100
- **Content**: Handheld scanning device
- **Format**: Placeholder = Blue rectangle with circular lens

### organ_heart.png
- **Size**: 120x120
- **Content**: Alien heart (3 chambers, unusual color)
- **Format**: Placeholder = Purple organic blob shape

### organ_brain.png
- **Size**: 150x120
- **Content**: Alien brain (different lobe structure)
- **Format**: Placeholder = Pink organic folded shape

### organ_unknown.png
- **Size**: 100x100
- **Content**: Mysterious glowing organ
- **Format**: Placeholder = Green glowing circular shape

### contamination_meter.png
- **Size**: 300x60
- **Content**: Horizontal bar meter
- **Format**: Placeholder = Empty bar with gradient fill capability

### timer_panel.png
- **Size**: 250x80
- **Content**: Digital timer display
- **Format**: Placeholder = Black rectangle with white digital numbers

### tool_panel.png
- **Size**: 400x120
- **Content**: Tool selection interface background
- **Format**: Placeholder = Semi-transparent dark rectangle

### results_panel.png
- **Size**: 900x600
- **Content**: End screen background with results display
- **Format**: Placeholder = Dark blue rectangle with lighter border

### button_continue.png
- **Size**: 220x80
- **Content**: "CONTINUE" button
- **Format**: Placeholder = Blue rectangle with white border

## Development Notes

### Simplified 1-Minute Demo Flow
```
[Instant Start 1s] → [Scan 5s] → [Incision 15s] → [Extraction 25s] → [Analysis 9s] → [Results 5s] → [Loop]
```

### Key Features for Demo
1. ✅ Immediate gameplay start (no lengthy intro)
2. ✅ Clear step-by-step objectives
3. ✅ Simple tap/drag controls
4. ✅ Visual guides for player actions
5. ✅ Tension through contamination meter
6. ✅ Quick restart for replayability

### Progression Elements
- Organs revealed in sequence (not all at once)
- Difficulty increases with each organ
- Timer creates urgency
- Contamination adds risk management

### Ethical Considerations
- Stylized, non-realistic visuals
- Scientific/medical context
- No graphic violence
- Educational undertones (anatomy, precision)

### Performance Targets
- 60 FPS on mobile devices
- Smooth drag interactions
- Touch precision within 10px
- Asset loading < 1 second

## Completion Checklist
- [ ] All PNG placeholder images created
- [ ] Tool selection system implemented
- [ ] Scanning mechanics working
- [ ] Incision path-following system
- [ ] Organ extraction drag mechanics
- [ ] Contamination system functional
- [ ] Timer countdown working
- [ ] Win/lose conditions implemented
- [ ] Results screen and loop functional
- [ ] Touch controls optimized for precision
