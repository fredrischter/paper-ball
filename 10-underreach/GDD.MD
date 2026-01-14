# Game Design Document: Underreach

## Game Overview
A tactical exploration game set in enclosed underground environments where players manage teams, oxygen, tools, flooding, and toxic air while navigating tight spaces with occasional hostile creatures.

## Technical Specifications

### Platform & Orientation
- **Platform**: Mobile (primary), Desktop fullscreen (secondary)
- **Orientation**: Horizontal (Landscape)
- **Screen Resolution**: 1920x1080 (16:9 aspect ratio)

### Image Assets & Specifications

| Asset Name | Size (px) | Description |
|------------|-----------|-------------|
| `background_cave.png` | 1920x1080 | Underground cave environment |
| `team_leader.png` | 70x90 | Team leader character |
| `team_member.png` | 70x90 | Team member sprite |
| `tunnel_path.png` | 200x150 | Cave tunnel segment |
| `water_flood.png` | 300x200 | Rising water hazard |
| `toxic_cloud.png` | 150x150 | Toxic gas cloud |
| `oxygen_tank.png` | 60x80 | Oxygen supply item |
| `flashlight.png` | 50x30 | Light source tool |
| `rope.png` | 80x200 | Climbing rope |
| `creature_bat.png` | 60x50 | Cave bat enemy |
| `oxygen_meter.png` | 350x70 | Oxygen level bar |
| `map_panel.png` | 400x400 | Mini-map display |
| `button_move.png` | 160x70 | Movement button |
| `button_tool.png` | 160x70 | Use tool button |

## Game Flow (1-Minute Demo)

### Intro Sequence (3 seconds - Story setup)
- Dark cave entrance, headlamp beam pierces darkness
- Radio: "Team Alpha, you're cleared for descent"
- Team rappels down into depths
- Oxygen meter appears: 100%
- Text: "Reach 300m and return alive"
- **No player input required** - Auto-advances to gameplay
### Game Screen (54 seconds)
- **Layout**:
  - Main view: Cave cross-section (side view)
  - Top: Oxygen meter, time elapsed
  - Right: Team status, available tools
  - Bottom: Movement and action buttons

- **ONE BUTTON MODE**: Tap to move team forward, auto-avoid hazards
- **TWO BUTTON MODE**: Move button + Tool/Action button

**Timeline**:
- 0-15s: Navigate first tunnel, collect oxygen tank
- 15-30s: Encounter water flooding, must climb higher
- 30-45s: Toxic gas area, use flashlight to find safe path
- 45-54s: Bats attack, reach exit chamber

**Objectives**:
- Keep team alive
- Manage oxygen (depletes 2%/second, tanks restore 30%)
- Navigate to exit (300 meters deep)
- Avoid/survive hazards

**Win**: Reach exit with at least 1 team member alive
**Lose**: All team members die OR oxygen reaches 0%

### End Screen (5 seconds)
- Victory: "SURFACE REACHED"
- Show: Team survivors, Depth explored, Time taken
- "Next Expedition" button

- Failure: "EXPEDITION LOST"
- Show: Cause of failure, Depth reached
- "Retry" button

## Game Elements

### Resource Management
```
OXYGEN:
  - Starting: 100%
  - Depletion: -2% per second
  - Tanks restore: +30% each
  - Critical: < 20% (warning alert)

TEAM HEALTH:
  - 3 members, each has 100 HP
  - Hazards deal damage
  - Lost members reduce team speed
```

### Hazard Types
```
FLOODING WATER:
  - Blocks lower paths
  - Forces climbing/rerouting
  - Deals 10 damage/second if in water

TOXIC GAS:
  - Reduces oxygen by extra 5%/second
  - Can't pass without light
  - Deal 15 damage/second

CREATURES (Bats):
  - Appear in dark areas
  - Attack team: 20 damage
  - Defeated by flashlight

CAVE-INS:
  - Block paths suddenly
  - Must find alternate route
  - Can trap team members
```

### Tools & Items
```
OXYGEN TANK:
  - Found in environment
  - Restores 30% oxygen
  - 3 available in demo level

FLASHLIGHT:
  - Reveals hidden paths
  - Scares creatures
  - Battery lasts 15 seconds

ROPE:
  - Climb vertical shafts
  - Required for some paths
  - Found at checkpoints
```

### Level Layout (Side-scrolling underground)
```
Depth 0m: START - Safe chamber
Depth 50m: TUNNEL with oxygen tank
Depth 100m: FLOODING area (climb upward)
Depth 150m: SAFE REST (collect flashlight)
Depth 200m: TOXIC ZONE (use flashlight)
Depth 250m: BAT CAVE (enemy encounter)
Depth 300m: EXIT - Escape shaft
```

## Visual Feedback
- Oxygen meter color: Green → Yellow → Red
- Team members flash when damaged
- Water rises gradually (animated)
- Toxic gas swirls slowly
- Flashlight cone of light
- Mini-map shows explored areas
- Depth counter updates continuously

## User Interface

### HUD Elements
- **Oxygen Meter** (Top left, 100, 40): Horizontal bar, percentage shown
- **Depth Counter** (Top center, 960, 40): "Depth: 150m / 300m"
- **Team Status** (Right panel, 1650, 200): 3 character portraits with HP bars
- **Tools** (Right panel, 1650, 500): Available items with quantities
- **Mini-Map** (Bottom right, 1500, 700): Shows immediate area

### Control Layout (Two-Button Mode)
```
Bottom left:
  - Move Forward button (300, 950): Advances team
Bottom center:
  - Use Tool button (900, 950): Activates selected tool
Tool selection: Tap tool icon on right panel
```

## Placeholder Image Specifications

### background_cave.png
- **Size**: 1920x1080
- **Content**: Dark underground cave with rock formations
- **Format**: Placeholder = Dark brown/gray gradient with rocky textures

### team_leader.png / team_member.png
- **Size**: 70x90
- **Content**: Explorer with helmet and equipment
- **Format**: Placeholder = Yellow human silhouette with headlamp

### tunnel_path.png
- **Size**: 200x150
- **Content**: Cave passage
- **Format**: Placeholder = Dark tunnel opening

### water_flood.png
- **Size**: 300x200
- **Content**: Rising water surface
- **Format**: Placeholder = Blue gradient with wavy top edge

### toxic_cloud.png
- **Size**: 150x150
- **Content**: Green toxic gas
- **Format**: Placeholder = Semi-transparent green cloud

### oxygen_tank.png
- **Size**: 60x80
- **Content**: Compressed oxygen cylinder
- **Format**: Placeholder = Gray cylinder with valve

### flashlight.png
- **Size**: 50x30
- **Content**: Handheld flashlight
- **Format**: Placeholder = Black flashlight shape with yellow beam

### rope.png
- **Size**: 80x200
- **Content**: Climbing rope
- **Format**: Placeholder = Brown twisted rope

### creature_bat.png
- **Size**: 60x50
- **Content**: Cave bat
- **Format**: Placeholder = Black bat silhouette with wings spread

### oxygen_meter.png
- **Size**: 350x70
- **Content**: Horizontal meter bar
- **Format**: Placeholder = Bar with gradient fill capability

### map_panel.png
- **Size**: 400x400
- **Content**: Mini-map background
- **Format**: Placeholder = Dark square with grid lines

### button_move.png / button_tool.png
- **Size**: 160x70
- **Content**: Action buttons
- **Format**: Placeholder = Gray button with icon/text

## Development Notes

### Simplified 1-Minute Demo Flow
```
[Start 1s] → [Tunnel 15s] → [Flood 15s] → [Safe 9s] → [Toxic 15s] → [Bats 9s] → [Exit 5s] → [Loop]
```

### Key Features
1. ✅ Resource tension (oxygen management)
2. ✅ Environmental hazards
3. ✅ Team management
4. ✅ Tool-based problem solving
5. ✅ Simple forward progression
6. ✅ Clear visual feedback

### Performance Targets
- 60 FPS on mobile
- Smooth scrolling
- Instant button response

## Completion Checklist
- [ ] All PNG placeholders created
- [ ] Oxygen depletion system
- [ ] Team health tracking
- [ ] Hazard interaction
- [ ] Tool usage mechanics
- [ ] Depth progression
- [ ] Win/lose conditions
- [ ] Mini-map display
