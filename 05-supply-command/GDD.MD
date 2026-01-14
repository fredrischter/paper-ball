# Game Design Document: Supply Command

## Game Overview
A logistics-focused war strategy game where players manage supply chains, transport routes, and resources to support frontline units under hostile conditions.

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
| `background_map.png` | 1920x1080 | Strategic map background |
| `base_hq.png` | 150x150 | Headquarters building |
| `frontline_unit.png` | 100x100 | Combat unit at front |
| `supply_depot.png` | 120x120 | Supply storage facility |
| `truck_convoy.png` | 80x60 | Supply truck sprite |
| `road_path.png` | 50x50 | Road tile texture |
| `bridge.png` | 150x100 | River bridge |
| `damaged_bridge.png` | 150x100 | Damaged bridge variant |
| `enemy_artillery.png` | 80x80 | Enemy attack indicator |
| `supply_crate_icon.png` | 64x64 | Supply resource icon |
| `fuel_icon.png` | 64x64 | Fuel resource icon |
| `ammo_icon.png` | 64x64 | Ammunition resource icon |
| `resources_panel.png` | 400x150 | Resource display panel |
| `route_line.png` | 10x10 | Supply route line segment |
| `mission_panel.png` | 800x500 | Mission briefing/results |
| `button_dispatch.png` | 200x80 | Dispatch convoy button |

## Game Flow (1-Minute Demo)

### 1. Start Screen (2 seconds - Brief intro)
- Mission briefing: "FRONTLINE REQUIRES SUPPLIES"
- Show: HQ, 3 frontline units, 1000 supply units available
- **Transition**: Quick fade to Game Screen

### 2. Game Screen (Main Gameplay - 53 seconds)
- **Layout**:
  - Center: Strategic map (1600x900)
  - Bottom left: HQ base (200, 750)
  - Top right, center, bottom right: 3 frontline units
  - Right panel: Resources and dispatch interface
  - Top: Mission timer and objectives

- **Controls**: 
  - **ONE BUTTON MODE** (Simplified):
    - **Tap frontline unit**: Auto-dispatch supplies via safest route
    - System auto-manages convoy size and path
  
  - **TWO BUTTON MODE** (Standard):
    - **Tap HQ**: Select dispatch
    - **Tap frontline unit**: Set destination
    - Route auto-calculates, player can adjust

- **Mechanics**:
  1. **Initial State**:
     - HQ has 1000 supply units
     - 3 frontline positions need supplies
     - Each unit consumes 10 supplies/second
     - Each unit needs minimum 200 supplies to be effective
  
  2. **Dispatch Phase** (ongoing):
     - Tap unit to dispatch 200 supply convoy
     - Trucks travel along roads (5 seconds journey)
     - Must manage 3 routes simultaneously
  
  3. **Challenges** (Random events):
     - **Weather** (15s mark): Roads slow down by 50%
     - **Bridge Damage** (30s mark): One route blocked, must reroute
     - **Enemy Artillery** (45s mark): One convoy under fire, 30% loss
  
  4. **Resource Management**:
     - Balance supplies between 3 frontlines
     - HQ receives +100 supplies every 10 seconds
     - Must prioritize critical units

- **Win Condition**: All 3 units maintained above 100 supplies for 60 seconds
- **Lose Condition**: Any unit drops to 0 supplies

### 3. End Screen (5 seconds)
- **Victory Screen**:
  - Display: "MISSION SUCCESS - Frontline Supplied"
  - Show: Total supplies delivered, Efficiency rating
  - "Next Mission" button
  
- **Defeat Screen**:
  - Display: "SUPPLY FAILURE - Unit Lost"
  - Show: Time survived, Units supplied
  - "Retry" button

- **Transition**: Loop to new mission

## Game Elements Detail

### Supply System
```
HQ Starting Supplies: 1000 units
HQ Supply Generation: +100 every 10 seconds
Convoy Size: 200 supplies per dispatch
Convoy Travel Time: 5 seconds (normal), 7.5 seconds (weather)

Unit Consumption:
  - Normal: 10 supplies/second
  - Heavy Combat: 15 supplies/second (after 40 seconds)
  
Unit Supply Capacity: 500 maximum
Critical Level: 100 (yellow warning)
Failure Level: 0 (red alert, unit lost)
```

### Route System
```
Primary Routes (3):
  - Route North: HQ → Unit A (straight path, 5s)
  - Route East: HQ → Unit B (via bridge, 5s normally)
  - Route South: HQ → Unit C (longest but safest, 6s)

Route Status:
  - Clear: Green, normal speed
  - Delayed: Yellow, 50% slower
  - Blocked: Red, unavailable
  - Under Fire: Orange, 30% supply loss
```

### Event Sequence (1-minute demo)
```
0:00 - Game starts, all routes clear
0:05 - First convoys should be dispatched
0:15 - WEATHER EVENT: All routes slow down
0:25 - Weather clears
0:30 - BRIDGE DAMAGE: East route blocked
0:35 - Must reroute to Unit B via alternative path
0:45 - ARTILLERY: South route under fire
0:50 - Critical supply phase, all units in heavy combat
1:00 - Mission end
```

### Visual Feedback
- Supply bars above each frontline unit (green/yellow/red)
- Convoy trucks move along roads with progress indicator
- HQ supply counter updates in real-time
- Routes highlight when selected
- Event notifications slide in from top
- Warning flashes when unit supply critical
- Damaged roads show visual deterioration
- Supply delivered animation (crate unloading)

### Audio Cues (Optional)
- Truck engine sounds (convoy moving)
- Radio chatter (dispatch confirmation)
- Warning siren (critical supply level)
- Explosion sound (artillery hit)
- Success bell (supplies delivered)
- Ambient war sounds (distant artillery)

## User Interface

### HUD Elements
- **Mission Timer**: Top center (960, 40), "00:53" countdown
- **HQ Supply Counter**: Bottom left (200, 900), "HQ: 1000" with crate icon
- **Frontline Supply Bars**: Above each unit, color-coded
- **Event Notifications**: Top center, sliding panels
- **Route Status**: Small icons on each path

### Control Panel (Right side)
```
Resources Panel (1650, 100):
  - HQ supplies: 1000
  - Convoys in transit: X/3
  - Last delivery: Xs ago

Dispatch Interface (1650, 400):
  - Unit A status + Dispatch button
  - Unit B status + Dispatch button
  - Unit C status + Dispatch button
  Each button: 180×60
```

### Map Layout
```
HQ Position: (300, 800)
Unit A Position: (1500, 200) - North
Unit B Position: (1200, 500) - East
Unit C Position: (1500, 900) - South

Roads drawn as curved lines connecting positions
```

## Placeholder Image Specifications

### background_map.png
- **Size**: 1920x1080
- **Content**: Topographical military map with terrain features
- **Color Scheme**: Tan/beige paper map style with green terrain
- **Format**: Placeholder = Beige background with topographic line patterns

### base_hq.png
- **Size**: 150x150
- **Content**: Military headquarters building with flag
- **Format**: Placeholder = Gray rectangle with triangle roof and small flag

### frontline_unit.png
- **Size**: 100x100
- **Content**: Military unit icon (tank/soldiers)
- **Format**: Placeholder = Dark green square with white star

### supply_depot.png
- **Size**: 120x120
- **Content**: Storage warehouse
- **Format**: Placeholder = Brown rectangle with stacked crate icons

### truck_convoy.png
- **Size**: 80x60
- **Content**: Military supply truck
- **Format**: Placeholder = Olive green rectangle with wheels

### road_path.png
- **Size**: 50x50
- **Content**: Road texture tile
- **Format**: Placeholder = Gray path with dashed center line

### bridge.png
- **Size**: 150x100
- **Content**: Bridge over river
- **Format**: Placeholder = Brown bridge shape over blue water

### damaged_bridge.png
- **Size**: 150x100
- **Content**: Partially destroyed bridge
- **Format**: Placeholder = Bridge with gap in center

### enemy_artillery.png
- **Size**: 80x80
- **Content**: Explosion/artillery strike indicator
- **Format**: Placeholder = Red burst/star shape

### supply_crate_icon.png
- **Size**: 64x64
- **Content**: Supply crate
- **Format**: Placeholder = Brown box with white markings

### fuel_icon.png
- **Size**: 64x64
- **Content**: Fuel barrel
- **Format**: Placeholder = Black barrel with fuel drop symbol

### ammo_icon.png
- **Size**: 64x64
- **Content**: Ammunition box
- **Format**: Placeholder = Green box with bullet symbol

### resources_panel.png
- **Size**: 400x150
- **Content**: Resource display background
- **Format**: Placeholder = Semi-transparent dark green rectangle

### route_line.png
- **Size**: 10x10
- **Content**: Route path segment
- **Format**: Placeholder = Dashed line tile

### mission_panel.png
- **Size**: 800x500
- **Content**: Mission briefing/results background
- **Format**: Placeholder = Military green rectangle with border

### button_dispatch.png
- **Size**: 200x80
- **Content**: "DISPATCH" button
- **Format**: Placeholder = Green button with white text

## Development Notes

### Simplified 1-Minute Demo Flow
```
[Briefing 2s] → [Gameplay 53s - Continuous supply management] → [Results 5s] → [Loop]
```

### Key Features for Demo
1. ✅ Simple tap-to-dispatch controls
2. ✅ Clear visual feedback on supply status
3. ✅ Auto-routing simplifies logistics
4. ✅ Events create dynamic challenges
5. ✅ Real-time resource management
6. ✅ Multiple simultaneous objectives

### Difficulty Balancing
- Early game: Plenty of supplies, easy management
- Mid game: Events require adaptation
- Late game: High consumption + limited supplies = tight management

### Strategic Elements
- Must prioritize which units to supply first
- Route selection affects delivery time
- Events force re-planning
- Resource generation requires timing awareness

### Performance Targets
- 60 FPS on mobile devices
- Smooth convoy movement animations
- Instant button response
- Asset loading < 1 second

## Completion Checklist
- [ ] All PNG placeholder images created
- [ ] Map and pathfinding system
- [ ] Convoy dispatch and movement
- [ ] Supply consumption mechanics
- [ ] Event system (weather, damage, artillery)
- [ ] Route management and rerouting
- [ ] Resource tracking and generation
- [ ] Win/lose conditions
- [ ] Results screen and mission loop
- [ ] Touch controls optimized
