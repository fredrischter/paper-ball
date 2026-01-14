# Game Design Document: Eternal Seal

## Game Overview
A narrative-driven strategy game about forging pacts with demons, angels, and ancient entities. Each pact grants power but creates lasting consequences affecting factions, missions, and world state.

## Technical Specifications

### Platform & Orientation
- **Platform**: Mobile (primary), Desktop fullscreen (secondary)
- **Orientation**: Horizontal (Landscape)
- **Screen Resolution**: 1920x1080 (16:9 aspect ratio)

### Image Assets & Specifications

| Asset Name | Size (px) | Description |
|------------|-----------|-------------|
| `background_ritual.png` | 1920x1080 | Ritual chamber background |
| `entity_demon.png` | 200x250 | Demon entity portrait |
| `entity_angel.png` | 200x250 | Angel entity portrait |
| `entity_ancient.png` | 200x250 | Ancient being portrait |
| `player_avatar.png` | 150x200 | Player character |
| `pact_seal_demon.png` | 150x150 | Demon pact symbol |
| `pact_seal_angel.png` | 150x150 | Angel pact symbol |
| `pact_seal_ancient.png` | 150x150 | Ancient pact symbol |
| `power_fire.png` | 100x100 | Fire power icon |
| `power_light.png` | 100x100 | Light power icon |
| `power_void.png` | 100x100 | Void power icon |
| `faction_meter.png` | 350x80 | Faction influence bar |
| `consequence_card.png` | 600x400 | Consequence display panel |
| `mission_panel.png` | 700x500 | Mission briefing panel |
| `button_accept_pact.png` | 220x80 | Accept pact button |
| `button_refuse_pact.png` | 220x80 | Refuse pact button |

## Game Flow (1-Minute Demo)

### Intro Sequence (4 seconds - Story setup)
- Ritual chamber candles flicker to life
- Ancient book opens, symbols glow
- Three entity silhouettes appear: Demon, Angel, Ancient One
- Voice whispers: "Choose your fate..."
- Text: "Power demands sacrifice"
- **No player input required** - Auto-advances to first pact offer

### Game Screen (54 seconds)
- **Layout**:
  - Center: Entity offering pact (changes each phase)
  - Left panel: Your current pacts and powers
  - Right panel: Faction standings
  - Bottom: Mission status
  - Top: Consequence tracker

- **TWO BUTTON MODE**:
  - Accept Pact button (Green)
  - Refuse Pact button (Red)
  - Each choice has lasting effects

**Structure (3 pact opportunities, 2 missions)**:

**PACT 1 - Demon (0-12s):**
- **Offer**:
  - Entity: Demon Lord Azarok appears
  - Power Offered: "Hellfire Mastery" (+50% attack)
  - Price: "Corruption of soul" (-30% Angel faction)
  - Mission Impact: Unlock demon allies for Mission 1
  
- **Choice** (10s to decide):
  - Accept: Gain power, anger angels
  - Refuse: Stay neutral, remain weak

**MISSION 1 (12-22s):**
- Auto-battle against cultists
- Powers gained from pacts determine outcome
- If accepted demon pact: Easy victory with hellfire
- If refused: Harder fight, rely on basic abilities
- Result affects next pact offer

**PACT 2 - Angel (22-34s):**
- **Offer**:
  - Entity: Archangel Lumiel appears
  - Power Offered: "Divine Shield" (+100% defense)
  - Price: "Vow of mercy" (Cannot use lethal force)
  - Conditional: If you have demon pact, angels hostile!
  
- **Choice**:
  - If demon pact accepted: Angels refuse to deal (locked out)
  - If no demon pact: Can choose angel pact
  - This demonstrates consequence of first choice

**PACT 3 - Ancient One (34-46s):**
- **Offer**:
  - Entity: Elderthing from beyond time
  - Power Offered: "Void Manipulation" (Unique ability)
  - Price: "Eternal servitude" (Ending locked to ancient path)
  - Always available regardless of prior pacts
  
- **Choice**:
  - Accept: Gain ultimate power, lose free will
  - Refuse: Stay independent, face final mission weaker

**MISSION 2 - Final Battle (46-54s):**
- Boss fight (auto-battle with player input)
- Available powers based on pacts made
- Different strategies required based on pact combination
- Multiple possible outcomes:
  - All pacts: Overpowered but corrupted
  - Mixed pacts: Balanced approach
  - No pacts: Heroic but challenging
  - Ancient pact: Special ending

**Win Conditions** (Multiple):
- Survive final battle (any pact combination)
- Different endings based on choices

**Lose Condition**: Die in final battle

### End Screen (4 seconds)
- **Ending Variants**:
  - Demon Path: "Lord of Hellfire" - Powerful but corrupted
  - Angel Path: "Champion of Light" - Noble but restricted
  - Ancient Path: "Eternal Servant" - Powerful but enslaved
  - Mixed Pacts: "Conflicted Soul" - Chaotic balance
  - No Pacts: "Self-Made Hero" - Difficult but free
  
- Show: Pacts made, Powers gained, Faction standings, World consequences
- "Seal Another Fate" button → Loop with different choices

## Game Elements

### Pact System
```
DEMON PACTS:
  - Powers: Offensive, destructive
  - Consequences: Corruption, angel hostility
  - Faction: +Demon, -Angel, Neutral Ancient
  
ANGEL PACTS:
  - Powers: Defensive, supportive
  - Consequences: Moral restrictions, demon hostility
  - Faction: +Angel, -Demon, Neutral Ancient
  
ANCIENT PACTS:
  - Powers: Unique, reality-warping
  - Consequences: Loss of agency, unknown effects
  - Faction: +Ancient, affects ending
```

### Power Types
```
HELLFIRE (Demon):
  - +50% attack damage
  - Unlocks fire-based abilities
  - Makes you feared

DIVINE SHIELD (Angel):
  - +100% defense
  - Auto-resurrection once
  - Makes you trusted

VOID MANIPULATION (Ancient):
  - Rewrite probability
  - One-time reality change
  - Makes you powerful but bound
```

### Faction System
```
Each faction: 0-100 influence
Starting: All at 50 (neutral)

DEMON FACTION:
  - High: Demon allies in missions
  - Low: Demons attack you
  
ANGEL FACTION:
  - High: Divine protection
  - Low: Angels oppose you
  
ANCIENT FACTION:
  - High: Unlocks cosmic powers
  - Locks you into servitude ending
```

### Mission Types
```
MISSION 1: Cultist Assault
  - Enemy: 5 cultists
  - Difficulty: Medium
  - Powers help: Hellfire = easy, None = hard
  
MISSION 2: Final Boss
  - Enemy: Varies based on pacts
  - If Demon pact: Fight angel boss
  - If Angel pact: Fight demon boss
  - If Ancient pact: Fight reality itself
  - If Mixed: Fight cosmic arbiter
  - If None: Fight your own fear
```

### Consequence Tracking
```
Every pact logs:
  - Power gained
  - Faction change
  - Future mission impact
  - Ending path opened/closed

Displayed as timeline:
  - Past choices grayed out
  - Future branches shown
  - Current position highlighted
```

## Visual Feedback
- Entity appearance: Dramatic reveal with effects
- Pact seals: Glow when activated
- Faction meters: Color-coded (Red/Gold/Purple)
- Consequence cards: Slide in showing effects
- Power icons: Pulse when usable in missions
- Battle effects based on powers used
- Screen tint based on dominant faction
- Ending screen matches pact theme

## User Interface

### HUD Elements
- **Pact Collection** (Left panel, 100, 200):
  - Shows all accepted pacts as seal icons
  - Hover/tap shows pact details
  
- **Faction Meters** (Right panel, 1550, 200):
  - Demon influence (red bar)
  - Angel influence (gold bar)
  - Ancient influence (purple bar)
  
- **Power Bar** (Bottom left, 200, 1000):
  - Available powers with cooldowns
  
- **Consequence Log** (Top center, 760, 50):
  - "Choices Made: X" with scroll icon

### Pact Offer Screen
```
Center (760, 400):
  - Entity portrait (200×250)
  - Pact name and description
  - Power offered (detailed)
  - Price (consequence)
  - Timer: 10 seconds to decide

Bottom (760, 900):
  - Accept Button (220×80, green, left)
  - Refuse Button (220×80, red, right)
```

### Mission Screen
```
Center: Auto-battle visualization
  - Your avatar on left
  - Enemy on right
  - Powers activate as icons flash
  - Health bars for both sides
  - Victory/defeat animation
```

## Placeholder Image Specifications

### background_ritual.png
- **Size**: 1920x1080
- **Content**: Dark ritual chamber with mystical symbols
- **Format**: Placeholder = Dark purple/black gradient with glowing runes

### entity_demon.png
- **Size**: 200x250
- **Content**: Demonic entity with horns, red aura
- **Format**: Placeholder = Red/black silhouette with horns

### entity_angel.png
- **Size**: 200x250
- **Content**: Angelic being with wings, golden light
- **Format**: Placeholder = White/gold silhouette with wings

### entity_ancient.png
- **Size**: 200x250
- **Content**: Cosmic horror, tentacles, incomprehensible
- **Format**: Placeholder = Purple/black swirling form

### player_avatar.png
- **Size**: 150x200
- **Content**: Player character in robes
- **Format**: Placeholder = Gray hooded figure

### pact_seal_(type).png
- **Size**: 150x150 each
- **Content**: Magical seal/sigil for each pact type
- **Format**: Placeholder = Circular symbols (red/gold/purple)

### power icons (100x100 each)
- **power_fire.png**: Flame symbol
- **power_light.png**: Radiant burst
- **power_void.png**: Swirling vortex

### faction_meter.png
- **Size**: 350x80
- **Content**: Influence bar
- **Format**: Placeholder = Bar with color fill capability

### consequence_card.png
- **Size**: 600x400
- **Content**: Effect display panel
- **Format**: Placeholder = Parchment-style panel with borders

### mission_panel.png
- **Size**: 700x500
- **Content**: Mission briefing background
- **Format**: Placeholder = Dark panel with frame

### buttons (220x80 each)
- **button_accept_pact.png**: Green glowing button
- **button_refuse_pact.png**: Red warning button

## Development Notes

### Simplified 1-Minute Demo Flow
```
[Start 2s] → [Pact 1: 12s] → [Mission 1: 10s] → [Pact 2: 12s] → [Pact 3: 12s] → [Mission 2: 8s] → [Ending 4s] → [Loop]
```

### Key Features
1. ✅ Meaningful choice system
2. ✅ Visible consequences
3. ✅ Multiple endings (replayability)
4. ✅ Simple two-button decisions
5. ✅ Auto-combat (strategy in build, not execution)
6. ✅ Faction system creates complexity

### Narrative Branching
- 3 pacts × 2 choices = 8 possible combinations
- Each combination yields different ending
- Some pacts lock out others (consequence)
- Encourages multiple playthroughs

### Replayability
- Different pact combinations to try
- Discover all 5+ endings
- Optimize for specific faction
- Challenge runs (no pacts, or all pacts)

### Performance Targets
- 60 FPS on mobile
- Smooth faction meter animations
- Quick pact seal effects
- Instant button response

## Completion Checklist
- [ ] All PNG placeholders created
- [ ] Pact offer system
- [ ] Choice consequence tracking
- [ ] Faction influence system
- [ ] Power activation mechanics
- [ ] Auto-battle with power effects
- [ ] Multiple ending paths
- [ ] Ending determination logic
- [ ] Results screen with statistics
- [ ] Replay with different choices
