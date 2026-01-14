# Game Design Document: Dino Ranch

## Game Overview
A management game where players run dinosaur operations including farms, trading, training, and combat arenas, blending economy, spectacle, and creature management.

## Technical Specifications

### Platform & Orientation
- **Platform**: Mobile (primary), Desktop fullscreen (secondary)
- **Orientation**: Horizontal (Landscape)
- **Screen Resolution**: 1920x1080 (16:9 aspect ratio)

### Image Assets & Specifications

| Asset Name | Size (px) | Description |
|------------|-----------|-------------|
| `background_ranch.png` | 1920x1080 | Dinosaur ranch environment |
| `dino_trex.png` | 150x180 | T-Rex dinosaur |
| `dino_raptor.png` | 100x120 | Velociraptor dinosaur |
| `dino_trike.png` | 140x100 | Triceratops dinosaur |
| `dino_ptero.png` | 120x80 | Pteranodon (flying) |
| `egg_nest.png` | 80x70 | Dinosaur egg in nest |
| `feeding_trough.png` | 120x80 | Food trough |
| `training_ring.png` | 300x250 | Training arena |
| `battle_arena.png` | 400x300 | Combat arena |
| `fence.png` | 200x100 | Enclosure fence |
| `resource_meat.png` | 64x64 | Meat resource icon |
| `resource_money.png` | 64x64 | Currency icon |
| `button_feed.png` | 160x70 | Feed button |
| `button_train.png` | 160x70 | Train button |
| `button_breed.png` | 160x70 | Breed button |
| `stats_card.png` | 350x400 | Dinosaur stats panel |

## Game Flow (1-Minute Demo)

### Intro Sequence (3 seconds - Story setup)
- Helicopter view descending to ranch
- Sign appears: "JURASSIC RANCH - GRAND OPENING"
- Land at main gate
- Text: "Welcome, New Ranch Owner!"
- Camera zooms to first pen with eggs
- **No player input required** - Auto-advances to gameplay

### Game Screen (55 seconds)
- **Layout**:
  - Center: Ranch view with pens (3 zones)
  - Left panel: Dinosaur list with stats
  - Right panel: Actions and resources
  - Bottom: Quick action buttons

- **ONE BUTTON MODE** (Primary): 
  - **Tap dinosaur**: Auto-performs next needed action
  - System intelligently prioritizes: Feed if hungry → Train if ready → Battle if trained → Breed if mature
  
- **TWO BUTTON MODE** (Advanced): 
  - **Tap action button first** (Feed/Train/Breed/Battle)
  - **Then tap dinosaur** to execute action

**Timeline**:
- 0-15s: Feed dinosaurs (management phase)
- 15-30s: Train one raptor (mini-game: timing taps)
- 30-45s: Battle arena (auto-combat, watch raptors fight rival dino)
- 45-55s: Collect rewards, breed new dino from egg

**Objectives**:
- Keep all dinos fed (happiness > 50%)
- Train 1 dino to level 2
- Win 1 arena battle
- Breed 1 new dino

**Win**: Complete all 4 objectives
**Lose**: Any dino dies (hunger reaches 0%)

### End Screen (4 seconds)
- Victory: "RANCH THRIVING!"
- Show: Total dinos, Ranch value, Battle wins
- "Expand Ranch" button → Loop

- Defeat: "RANCH FAILED!"
- Show: Days survived, Dinos owned
- "Restart" button

## Game Elements

### Dinosaur Types
```
RAPTOR:
  - Cost: 50 coins
  - Stats: Speed 8, Attack 7, Defense 4
  - Use: Fast battles, hunting
  - Food: 5 meat/feed

T-REX:
  - Cost: 200 coins (earned later)
  - Stats: Speed 3, Attack 10, Defense 7
  - Use: Arena champion
  - Food: 15 meat/feed

TRICERATOPS:
  - Cost: 75 coins
  - Stats: Speed 4, Attack 5, Defense 9
  - Use: Steady defender
  - Food: 8 meat/feed

PTERANODON:
  - Cost: 100 coins
  - Stats: Speed 10, Attack 4, Defense 3
  - Use: Shows, racing
  - Food: 3 meat/feed
```

### Resource Management
```
STARTING RESOURCES:
  - Coins: 100
  - Meat: 50
  - Dinos: 2 Raptors, 1 Trike

RESOURCE GENERATION:
  - Dinos produce eggs: +1 every 30 seconds
  - Eggs can be sold: 25 coins each
  - Or hatched: New dino in 20 seconds

RESOURCE CONSUMPTION:
  - Feeding: 5-15 meat per dino
  - Training: 10 coins per session
  - Breeding: 30 coins + 20 meat
```

### Management Actions
```
FEED:
  - Costs meat (varies by dino type)
  - Restores hunger to 100%
  - Happy dinos train better

TRAIN:
  - Mini-game: Tap timing challenge
  - Success: +1 level, stats increase
  - Costs: 10 coins
  - Duration: 10 seconds

BREED:
  - Select 2 compatible dinos
  - Costs: 30 coins + 20 meat
  - Creates egg (20s hatch time)
  - Offspring inherits traits

BATTLE:
  - Select your dino
  - Auto-combat vs rival
  - Win: Earn 50 coins + prestige
  - Lose: Dino loses 20% health
  - Duration: 15 seconds
```

### Training Mini-Game
```
Timing Challenge:
  - Bar moves left-right
  - Tap when in green zone
  - 5 successful taps = level up
  - Perfect taps (+/-0.1s): Bonus stats
```

### Battle System
```
Auto-Combat:
  - Stats determine outcome
  - Speed = first strike
  - Attack vs Defense calculations
  - Visual: Dinos clash, effects show
  - Result: Winner announced, rewards given
```

## Visual Feedback
- Dinos animate (walking, eating, roaring)
- Hunger bars above each dino
- Training progress bar
- Battle effects (claw swipes, roars)
- Egg hatching animation
- Coins float up when earned
- Level up star burst effect

## User Interface

### HUD Elements
- **Resource Panel** (Top right, 1650, 40):
  - Coins: 100 (coin icon)
  - Meat: 50 (meat icon)
- **Dino List** (Left panel, 100, 200):
  - Each dino with mini portrait
  - Name, level, hunger bar
- **Action Panel** (Right panel, 1650, 400):
  - Feed, Train, Breed, Battle buttons
- **Ranch View** (Center): 3 pens visible

### Control Layout (Two-Button Mode)
```
Bottom action bar (200, 950):
  - Feed Button (200x70)
  - Train Button (200x70)
  - Breed Button (200x70)
  - Battle Button (200x70)

Workflow:
  1. Tap dinosaur in pen
  2. Tap action button
  3. Follow mini-game/watch result
```

## Placeholder Image Specifications

### background_ranch.png
- **Size**: 1920x1080
- **Content**: Outdoor ranch with pens, mountains background
- **Format**: Placeholder = Green grass with brown fence sections

### dino_trex.png
- **Size**: 150x180
- **Content**: T-Rex dinosaur sprite
- **Format**: Placeholder = Green reptilian T-Rex silhouette

### dino_raptor.png
- **Size**: 100x120
- **Content**: Velociraptor sprite
- **Format**: Placeholder = Brown raptor silhouette

### dino_trike.png
- **Size**: 140x100
- **Content**: Triceratops sprite
- **Format**: Placeholder = Gray/blue trike with horns

### egg_nest.png
- **Size**: 80x70
- **Content**: Dinosaur egg in straw nest
- **Format**: Placeholder = Speckled egg in brown nest

### feeding_trough.png
- **Size**: 120x80
- **Content**: Food trough
- **Format**: Placeholder = Brown wooden trough

### training_ring.png / battle_arena.png
- **Size**: 300x250 / 400x300
- **Content**: Circular training/battle area
- **Format**: Placeholder = Brown circular fence ring

### resource icons (64x64 each)
- **resource_meat.png**: Red meat icon
- **resource_money.png**: Gold coin icon

### buttons (160x70 each)
- **button_feed.png**: Green button with food icon
- **button_train.png**: Blue button with dumbbell icon
- **button_breed.png**: Purple button with heart icon

### stats_card.png
- **Size**: 350x400
- **Content**: Stats display panel
- **Format**: Placeholder = Beige card with stat bars

## Development Notes

### Simplified 1-Minute Demo Flow
```
[Start 1s] → [Feed 15s] → [Train 15s] → [Battle 15s] → [Breed 9s] → [Results 4s] → [Loop]
```

### Key Features
1. ✅ Simple management loop
2. ✅ Multiple dinosaur types
3. ✅ Training mini-game for interaction
4. ✅ Auto-battle for excitement
5. ✅ Resource balancing
6. ✅ Breeding for progression

### Progression Hook
- Start with basic dinos
- Earn coins from battles
- Breed better dinos
- Unlock T-Rex and other premium dinos
- Expand ranch capacity

### Performance Targets
- 60 FPS on mobile
- Smooth animations
- Instant button response

## Completion Checklist
- [ ] All PNG placeholders created
- [ ] Dinosaur stat system
- [ ] Feeding mechanics
- [ ] Training mini-game
- [ ] Battle auto-combat
- [ ] Breeding system
- [ ] Egg hatching
- [ ] Resource management
- [ ] Win/lose conditions
