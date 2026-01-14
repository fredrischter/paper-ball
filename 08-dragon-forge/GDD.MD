# Game Design Document: Dragon Forge

## Game Overview
A fantasy management and combat game focused on breeding, training, and deploying dragons. Players manage facilities, resources, and dragon lineages for battles and prestige.

## Technical Specifications

### Platform & Orientation
- **Platform**: Mobile (primary), Desktop fullscreen (secondary)
- **Orientation**: Horizontal (Landscape)
- **Screen Resolution**: 1920x1080 (16:9 aspect ratio)

### Image Assets & Specifications

| Asset Name | Size (px) | Description |
|------------|-----------|-------------|
| `background_forge.png` | 1920x1080 | Dragon forge facility |
| `dragon_egg.png` | 100x120 | Dragon egg sprite |
| `dragon_hatchling.png` | 120x100 | Young dragon |
| `dragon_adult_fire.png` | 200x180 | Adult fire dragon |
| `dragon_adult_ice.png` | 200x180 | Adult ice dragon |
| `dragon_adult_storm.png` | 200x180 | Adult storm dragon |
| `forge_station.png` | 250x200 | Dragon breeding station |
| `training_ground.png` | 300x250 | Training facility |
| `battle_arena.png` | 400x300 | Combat arena |
| `resource_gold.png` | 64x64 | Gold currency icon |
| `resource_food.png` | 64x64 | Dragon food icon |
| `button_breed.png` | 180x70 | Breed button |
| `button_train.png` | 180x70 | Train button |
| `button_battle.png` | 180x70 | Battle button |
| `stats_card.png` | 350x450 | Dragon stats display |

## Game Flow (1-Minute Demo)

### Start Screen (1 second - Auto-skip)
- "DRAGON FORGE ACTIVATED"

### Game Screen (55 seconds)
- **ONE BUTTON MODE**: Tap dragon → Auto-select best action
- **TWO BUTTON MODE**: Select action, then select dragon

**Timeline**:
- 0-15s: Breed and hatch first dragon
- 15-30s: Train dragon (tap mini-game)
- 30-45s: First battle (auto-combat)
- 45-55s: Collect rewards, breed second dragon

**Win**: Complete one full dragon lifecycle
**Lose**: Run out of resources

### End Screen (4 seconds)
- Display stats, next dragon preview
- "Continue Forging" button → Loop

## Game Elements

### Dragon Types
```
FIRE DRAGON: High attack, Low defense
ICE DRAGON: Balanced stats
STORM DRAGON: High speed, Medium power
```

### Resources
```
Starting: 100 Gold, 50 Food
Breeding Cost: 30 Gold
Training Cost: 20 Food/session
Battle Rewards: 50 Gold + Food
```

## Placeholder Images
- **background_forge.png** (1920x1080): Dark fantasy forge with lava
- **dragon_egg.png** (100x120): Scaly egg
- **dragon_adult_fire.png** (200x180): Red dragon with flames
- All resource icons: 64x64 simple symbols

## Controls
- Tap dragon or facility
- Select action button
- Training: Tap timing mini-game

## Completion Checklist
- [ ] All PNG placeholders created
- [ ] Dragon breeding system
- [ ] Training mini-game
- [ ] Auto-battle system
- [ ] Resource management
- [ ] Lifecycle loop
