# Game Design Document: Iron Command

## Game Overview
A large-scale war strategy game emphasizing logistics, infrastructure, disease, and combined arms warfare across land, air, and sea. Units consume supplies, suffer attrition, and are affected by environmental conditions.

## Technical Specifications

### Platform & Orientation
- **Platform**: Mobile (primary), Desktop fullscreen (secondary)
- **Orientation**: Horizontal (Landscape)
- **Screen Resolution**: 1920x1080 (16:9 aspect ratio)

### Image Assets & Specifications

| Asset Name | Size (px) | Description |
|------------|-----------|-------------|
| `background_warmap.png` | 1920x1080 | Strategic war map |
| `unit_infantry.png` | 70x60 | Infantry unit icon |
| `unit_tank.png` | 90x70 | Tank unit icon |
| `unit_artillery.png` | 85x65 | Artillery unit icon |
| `unit_aircraft.png` | 80x60 | Aircraft unit icon |
| `unit_ship.png` | 100x70 | Naval unit icon |
| `supply_depot.png` | 120x100 | Supply depot building |
| `factory.png` | 140x120 | Production factory |
| `hospital.png` | 130x110 | Medical facility |
| `airfield.png` | 150x120 | Aircraft base |
| `port.png` | 140x130 | Naval port |
| `supply_line.png` | 10x10 | Supply route segment |
| `terrain_forest.png` | 200x200 | Forest terrain tile |
| `terrain_mountain.png` | 200x200 | Mountain terrain tile |
| `terrain_water.png` | 200x200 | Water terrain tile |
| `weather_rain.png` | 128x128 | Rain weather icon |
| `weather_snow.png` | 128x128 | Snow weather icon |
| `disease_outbreak.png` | 100x100 | Disease alert icon |
| `attrition_icon.png` | 80x80 | Attrition indicator |
| `button_deploy.png` | 180x70 | Deploy unit button |
| `button_resupply.png` | 180x70 | Resupply button |
| `stats_panel.png` | 400x600 | Unit statistics panel |

## Game Flow (1-Minute Demo)

### Intro Sequence (3 seconds - Story setup)
- War room, officers around strategic map
- Radio: "Enemy forces massing at all fronts!"
- Commander: "Hold the line. Reinforcements in 60 seconds."
- Map zooms to your defensive positions
- Text: "HOLD OR DIE"
- **No player input required** - Auto-advances to gameplay
- Starting forces: 2 Infantry, 1 Tank, 1 Artillery

### Game Screen (54 seconds)
- **Layout**:
  - Center: Strategic map (hexagonal grid)
  - Left panel: Available units and supplies
  - Right panel: Infrastructure and status
  - Top: Resources (supplies, fuel, ammo)
  - Bottom: Action buttons

- **ONE BUTTON MODE** (Simplified):
  - Tap hex: Deploy next unit or resupply existing
  - Auto-manages supply lines
  
- **TWO BUTTON MODE** (Standard):
  - Deploy button: Place units
  - Resupply button: Send supplies to frontline
  - Tap hex to select target

**Timeline**:

**Phase 1 - Deployment (0-15s):**
- Place starting units on defensive line
- Establish supply depot in rear
- Connect supply lines to frontline
- Enemy scouts appear (no combat yet)

**Phase 2 - First Contact (15-30s):**
- Enemy infantry attack (5 units)
- Your units auto-engage
- Supplies deplete: -10/second during combat
- Must resupply or units lose effectiveness
- Weather: Rain starts (-20% movement)

**Phase 3 - Escalation (30-45s):**
- Enemy reinforcements: Tanks + Artillery
- Deploy your reserve tank
- Disease outbreak in one unit (-50% effectiveness)
- Must evacuate or treat with hospital
- Supply lines under pressure

**Phase 4 - Final Push (45-54s):**
- Massive enemy assault (all unit types)
- Combined arms required
- Air support available (if airfield built)
- Critical supply situation
- Attrition mounting

**Objectives**:
- Prevent enemy breakthrough (hold 3 hexes)
- Maintain supply lines (no units at 0 supplies)
- Keep casualties below 50%

**Win**: Hold line for 60 seconds, maintain objectives
**Lose**: Enemy captures 3+ hexes OR all units destroyed

### End Screen (4 seconds)
- **Victory**: "OPERATION SUCCESSFUL"
  - Show: Casualties, Supplies used, Enemy defeated
  - "Next Operation" button
  
- **Defeat**: "LINE BROKEN"
  - Show: Territory lost, Survival time
  - "Retry" button

## Game Elements

### Unit System
```
INFANTRY:
  - Cost: 20 supplies
  - Strength: 100 HP
  - Supply consumption: 5/second in combat
  - Best vs: Infantry
  - Weak vs: Tanks, Artillery
  
TANK:
  - Cost: 50 supplies
  - Strength: 250 HP
  - Fuel consumption: 10/second
  - Best vs: Infantry, Tanks
  - Weak vs: Artillery, Aircraft
  
ARTILLERY:
  - Cost: 40 supplies
  - Strength: 150 HP
  - Ammo consumption: 8/second in combat
  - Best vs: Infantry, Fortifications
  - Weak vs: Fast units
  
AIRCRAFT:
  - Cost: 80 supplies
  - Strength: 100 HP
  - Fuel consumption: 15/second
  - Best vs: Tanks, Ships
  - Needs: Airfield
  
SHIPS (if coastal map):
  - Cost: 100 supplies
  - Strength: 400 HP
  - Best vs: Coastal targets
  - Needs: Port
```

### Resource Management
```
SUPPLIES:
  - Starting: 200
  - Generated: +20 per depot per 10 seconds
  - Used for: Deploying units, resupply
  
FUEL:
  - Starting: 150
  - Generated: +15 per depot per 10 seconds
  - Used for: Tanks, Aircraft, Ships movement
  
AMMUNITION:
  - Starting: 180
  - Generated: +18 per factory per 10 seconds
  - Used for: All combat, especially Artillery
```

### Infrastructure
```
SUPPLY DEPOT (Starting):
  - Cost: Free (1 starts deployed)
  - Generates: Supplies, Fuel, Ammo
  - Can build more: 60 supplies
  
HOSPITAL:
  - Cost: 50 supplies
  - Function: Treats disease, heals units
  - Radius: 3 hexes
  
FACTORY:
  - Cost: 80 supplies
  - Function: Produces ammo faster
  - Bonus: +50% ammo generation
  
AIRFIELD:
  - Cost: 100 supplies
  - Function: Enables aircraft
  - Needed for: Air support
  
PORT:
  - Cost: 90 supplies
  - Function: Enables naval units
  - Needed for: Ships
```

### Attrition System
```
Units lose effectiveness from:
  - Low supplies: -10% per 10% missing
  - Disease: -50% until treated
  - Weather (rain/snow): -20% movement
  - Difficult terrain: -30% in mountains
  - No resupply > 20s: -5% HP per second
```

### Combat System
```
Auto-combat between adjacent units:
  - Damage based on unit type matchup
  - Modified by supply levels
  - Affected by terrain
  - Weather impacts accuracy
  
Combat Results:
  - Victories: Enemy unit loses HP
  - Defeats: Your unit loses HP
  - Stalemates: Both lose HP slowly
  - Retreats: Low-supply units fall back
```

### Weather System
```
CLEAR (0-15s):
  - No modifiers
  - Normal combat
  
RAIN (15-35s):
  - -20% movement all units
  - -10% aircraft effectiveness
  
SNOW (35-45s):
  - -30% movement ground units
  - Aircraft grounded
  
CLEAR (45-54s):
  - Returns to normal
```

### Disease Outbreak
```
Random event at 30-35s:
  - One unit infected
  - -50% combat effectiveness
  - Spreads to adjacent friendly units if not treated
  - Treatment: Build hospital nearby
  - Prevention: Keep units supplied
```

## Visual Feedback
- Units show supply level (green/yellow/red indicator)
- Supply lines animated (resources flowing)
- Combat: Explosion effects, unit HP bars
- Attrition: Units flash red when suffering
- Weather: Rain/snow overlays on map
- Disease: Pulsing red indicator on unit
- Resource counters update continuously
- Terrain affects unit appearance (snow on units, etc.)

## User Interface

### HUD Elements
- **Resource Panel** (Top, 760, 40):
  - Supplies: 200 (crate icon)
  - Fuel: 150 (barrel icon)
  - Ammo: 180 (bullet icon)
  
- **Unit List** (Left panel, 100, 200):
  - Available units to deploy
  - Each shows cost and supply requirement
  
- **Infrastructure** (Right panel, 1650, 200):
  - Built structures
  - Production rates
  - Build new options
  
- **Objectives** (Top left, 100, 100):
  - Hold line: ✓/✗
  - Supply status: OK/CRITICAL
  - Casualties: 15/50

### Map Grid
```
Hexagonal grid: 15×10 hexes
Each hex: 120px wide
Terrain types visible
Units placed on hexes
Supply lines connect hexes
```

### Control Layout (Two-Button Mode)
```
Bottom action bar (400, 950):
  - Deploy Unit (180×70)
  - Resupply (180×70)
  - Build Infrastructure (180×70)
  
Workflow:
  1. Select action button
  2. Tap hex on map
  3. Confirm/execute
```

## Placeholder Image Specifications

### background_warmap.png
- **Size**: 1920x1080
- **Content**: Military topographic map with hex grid
- **Format**: Placeholder = Tan background with hex grid overlay

### Unit icons (all 60-100px wide)
- **unit_infantry.png**: Soldier silhouettes
- **unit_tank.png**: Tank top-down view
- **unit_artillery.png**: Cannon icon
- **unit_aircraft.png**: Plane silhouette
- **unit_ship.png**: Ship top-down

### Infrastructure (100-150px)
- **supply_depot.png**: Warehouse building
- **factory.png**: Industrial building with smokestacks
- **hospital.png**: Medical cross building
- **airfield.png**: Runway with hangar
- **port.png**: Dock with cranes

### Terrain tiles (200x200 hex tiles)
- **terrain_forest.png**: Green trees
- **terrain_mountain.png**: Brown/gray peaks
- **terrain_water.png**: Blue water texture

### Effects
- **weather_rain.png** (128×128): Rain droplets
- **weather_snow.png** (128×128): Snowflakes
- **disease_outbreak.png** (100×100): Biohazard symbol
- **attrition_icon.png** (80×80): Warning symbol

## Development Notes

### Simplified 1-Minute Demo Flow
```
[Briefing 2s] → [Deploy 15s] → [Combat 15s] → [Escalation 15s] → [Final 9s] → [Results 4s] → [Loop]
```

### Key Features
1. ✅ Combined arms warfare
2. ✅ Logistics management crucial
3. ✅ Environmental effects matter
4. ✅ Infrastructure building
5. ✅ Auto-combat (strategy over micro)
6. ✅ Multiple systems interact

### Complexity Simplified
- Full game would have 50+ unit types
- Demo: 5 types for clarity
- Full game: 100+ hexes map
- Demo: Focused 15×10 map
- Simplified supply (3 resources vs 10+)

### Strategic Depth
- Resource allocation decisions
- Unit positioning matters
- Combined arms synergies
- Infrastructure investment timing
- Weather adaptation

### Performance Targets
- 60 FPS on mobile
- Smooth unit animations
- Efficient pathfinding
- Clean map rendering

## Completion Checklist
- [ ] All PNG placeholders created
- [ ] Hex grid map system
- [ ] Unit deployment mechanics
- [ ] Supply consumption tracking
- [ ] Auto-combat resolution
- [ ] Resource generation system
- [ ] Infrastructure building
- [ ] Weather effects
- [ ] Disease outbreak event
- [ ] Attrition calculation
- [ ] Win/lose conditions
- [ ] Combined arms bonuses
