# Game Design Document: World Tension

## Game Overview
A deep geopolitical simulation where players manage countries with complex social, economic, and political variables to maintain stability and survive cascading crises.

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
| `background_world_map.png` | 1920x1080 | World map background |
| `country_region.png` | 300x250 | Selectable country region |
| `stability_meter.png` | 350x80 | Stability level indicator |
| `economy_icon.png` | 80x80 | Economic status icon |
| `military_icon.png` | 80x80 | Military strength icon |
| `diplomacy_icon.png` | 80x80 | Diplomatic relations icon |
| `crisis_alert.png` | 500x300 | Crisis notification panel |
| `decision_card.png` | 600x400 | Decision choice card |
| `button_option_a.png` | 250x90 | Option A button |
| `button_option_b.png` | 250x90 | Option B button |
| `stats_panel.png` | 400x600 | Country statistics panel |
| `timeline_bar.png` | 1600x60 | Progress timeline |
| `icon_unrest.png` | 64x64 | Social unrest indicator |
| `icon_growth.png` | 64x64 | Economic growth indicator |

## Game Flow (1-Minute Demo)

### 1. Intro Sequence (3 seconds - Story setup)
- World map zooms to your nation
- Advisor appears: "Mr. President, we have a situation..."
- Crisis indicators flash on borders
- Text: "Your decisions will shape history"
- **No player input required** - Auto-advances to first decision
- **Transition**: Fade to Game Screen

### 2. Game Screen (Main Gameplay - 54 seconds)
- **Layout**:
  - Center: World map with your nation highlighted
  - Left panel: Nation statistics (stability, economy, military)
  - Right panel: Current events/decisions
  - Bottom: Timeline progress bar
  - Top: Crisis alerts

- **Controls**: 
  - **TWO BUTTON MODE** (Standard):
    - **Option A**: Left choice for each decision
    - **Option B**: Right choice for each decision
    - Each decision has clear consequences shown

- **Mechanics**:
  1. **Month 1** (10 seconds):
     - **Crisis**: "Economic Recession Looms"
     - **Option A**: Increase spending (-economy, +stability)
     - **Option B**: Cut spending (+economy, -stability)
     - Player has 8 seconds to decide
  
  2. **Month 2** (10 seconds):
     - **Crisis**: "Border Tensions Rising"
     - **Option A**: Diplomatic approach (+diplomacy, -military prestige)
     - **Option B**: Military posturing (+military, -diplomacy)
  
  3. **Month 3** (10 seconds):
     - **Crisis**: "Trade Deal Opportunity"
     - **Option A**: Accept deal (+economy, +foreign influence)
     - **Option B**: Reject deal (status quo, +independence)
  
  4. **Month 4** (12 seconds):
     - **Major Crisis**: "Civil Unrest" (based on previous choices)
     - **Option A**: Harsh response
     - **Option B**: Concessions
     - Consequences more severe
  
  5. **Month 5** (12 seconds):
     - **Final Challenge**: Cascading crisis combining previous issues
     - Must balance all factors

- **Stats Monitored**:
  - **Stability**: 0-100 (Game over if < 20)
  - **Economy**: 0-100 (Affects all other stats)
  - **Military**: 0-100 (Needed for certain responses)
  - **Diplomacy**: 0-100 (Opens peaceful options)
  - **Public Support**: 0-100 (Based on all decisions)

- **Win Condition**: Maintain stability > 50 for 5 months
- **Lose Condition**: Any stat drops to critical level (< 20)

### 3. End Screen (4 seconds)
- **Success Screen**:
  - Display: "NATION STABILIZED"
  - Show: Final stats, Crisis rating, Leadership score
  - "Continue Governing" button
  
- **Failure Screen**:
  - Display: "GOVERNMENT COLLAPSED"
  - Show: Failure reason, Months survived
  - "Retry" button

- **Transition**: Loop to new scenario

## Game Elements Detail

### Decision System
```
Decision Structure:
  - Title: Brief crisis description
  - Context: 1-2 sentences explaining situation
  - Option A: Left choice with predicted effects
  - Option B: Right choice with predicted effects
  - Timer: 8-10 seconds to decide
  - Default: If no choice, random selection (bad outcome)

Decision Categories:
  - Economic: Trade, spending, taxation
  - Military: Defense, conflicts, alliances
  - Social: Unrest, reform, freedoms
  - Diplomatic: Relations, treaties, negotiations
  - Environmental: Resources, disasters, policies
```

### Stats Impact System
```
Each decision affects 2-4 stats:
  Primary Effect: ±10-20 points
  Secondary Effect: ±5-10 points
  Cascading Effects: Delayed impact next turn

Stat Interactions:
  - Low Economy → Reduced Military capacity
  - Low Stability → Increased crisis frequency
  - High Diplomacy → Trade bonuses
  - High Military → Diplomatic penalties
  - Low Public Support → Harder to pass decisions
```

### Crisis Progression (5-month demo)
```
Month 1: Economic focus, minor crisis
Month 2: Military/Diplomatic crisis
Month 3: Opportunity decision (no crisis)
Month 4: Social unrest (consequence of Month 1-2)
Month 5: Major cascading crisis (all previous factors)
```

### Visual Feedback
- Stats shown as colored bars (green/yellow/red)
- Map regions change color based on stability
- Decision cards slide in from right
- Timer bar drains during decision time
- Stat changes animate with +/- numbers
- Crisis alerts flash urgently
- Map highlights crisis locations

### Audio Cues (Optional)
- Tense background music
- Crisis alert sound
- Decision confirmation beep
- Stat increase/decrease sounds
- Public reaction sounds (cheers/protests)
- Diplomatic themes for peaceful choices
- Military drums for aggressive choices

## User Interface

### HUD Elements
- **Stats Panel** (Left, 100, 200):
  - Stability bar with percentage
  - Economy bar with trend arrow
  - Military strength indicator
  - Diplomacy rating
  - Public support meter

- **Decision Panel** (Right, 1320, 300):
  - Crisis title
  - Description text
  - Two option buttons
  - Predicted effects for each
  - Decision timer

- **Timeline** (Bottom center, 160, 1020):
  - Shows "Month X/5"
  - Progress bar
  - Major milestones marked

- **Crisis Alerts** (Top center, 760, 50):
  - Urgent notifications
  - Sliding alert panels
  - Priority indicators

## Placeholder Image Specifications

### background_world_map.png
- **Size**: 1920x1080
- **Content**: Stylized world map with your nation prominent
- **Color Scheme**: Political map style, muted colors
- **Format**: Placeholder = Beige map with country borders, one region highlighted

### country_region.png
- **Size**: 300x250
- **Content**: Nation territory shape
- **Format**: Placeholder = Irregular polygon shape, color-coded by stability

### stability_meter.png
- **Size**: 350x80
- **Content**: Horizontal bar meter
- **Format**: Placeholder = Gradient bar (green to red capability)

### economy_icon.png
- **Size**: 80x80
- **Content**: Currency/economy symbol
- **Format**: Placeholder = Gold coin or graph icon

### military_icon.png
- **Size**: 80x80
- **Content**: Military strength symbol
- **Format**: Placeholder = Shield or star icon

### diplomacy_icon.png
- **Size**: 80x80
- **Content**: Diplomatic relations symbol
- **Format**: Placeholder = Handshake or globe icon

### crisis_alert.png
- **Size**: 500x300
- **Content**: Crisis notification panel
- **Format**: Placeholder = Red alert box with warning symbol

### decision_card.png
- **Size**: 600x400
- **Content**: Decision background panel
- **Format**: Placeholder = White card with shadow

### button_option_a.png
- **Size**: 250x90
- **Content**: Left decision choice
- **Format**: Placeholder = Blue button with text area

### button_option_b.png
- **Size**: 250x90
- **Content**: Right decision choice
- **Format**: Placeholder = Green button with text area

### stats_panel.png
- **Size**: 400x600
- **Content**: Statistics display background
- **Format**: Placeholder = Semi-transparent dark panel

### timeline_bar.png
- **Size**: 1600x60
- **Content**: Progress timeline
- **Format**: Placeholder = Horizontal bar with month markers

### icon_unrest.png
- **Size**: 64x64
- **Content**: Social unrest indicator
- **Format**: Placeholder = Red exclamation mark

### icon_growth.png
- **Size**: 64x64
- **Content**: Economic growth indicator
- **Format**: Placeholder = Green upward arrow

## Development Notes

### Simplified 1-Minute Demo Flow
```
[Intro 2s] → [Month 1: 10s] → [Month 2: 10s] → [Month 3: 10s] → [Month 4: 12s] → [Month 5: 12s] → [Results 4s] → [Loop]
```

### Key Features for Demo
1. ✅ Simple two-choice decisions
2. ✅ Clear cause and effect
3. ✅ Visual feedback on all stat changes
4. ✅ Progressive difficulty (cascading crises)
5. ✅ Quick decision timers maintain pace
6. ✅ Multiple paths to victory

### Complexity Management
- Simplified from full game (5 stats instead of 20+)
- Decisions limited to 2 options (full game has more)
- Linear time progression (no complex event scheduling)
- Direct consequences (minimal hidden mechanics)

### Replayability Elements
- Different crisis orders in replay
- Randomized event variations
- Multiple viable strategies
- Butterfly effect from early decisions

### Performance Targets
- 60 FPS on mobile devices
- Smooth stat animations
- Instant button response
- Asset loading < 1 second

## Completion Checklist
- [ ] All PNG placeholder images created
- [ ] Decision system with two options
- [ ] Stats tracking and display
- [ ] Crisis generation system
- [ ] Consequence calculation engine
- [ ] Timer mechanics
- [ ] Win/lose condition detection
- [ ] Results screen with feedback
- [ ] Cascading crisis system
- [ ] Touch controls optimized
