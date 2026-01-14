# GitHub Actions Workflows

## Game Tests and Screenshots

This workflow automatically runs tests and generates screenshots for all game variants in the POC collection.

### What it does

1. **Runs automated tests** for each game variant using Jest
2. **Generates code coverage reports** for all tested code
3. **Captures gameplay screenshots** using Playwright:
   - Initial game state
   - Action screenshots (movement, jumping)
   - Mobile responsive view
4. **Uploads artifacts** for test results and screenshots
5. **Comments on pull requests** with test coverage results

### Triggering the workflow

The workflow runs automatically on:
- Pushes to `main` or `copilot/create-game-structure-poc` branches
- Pull requests targeting `main`
- Manual trigger via workflow_dispatch

### Game variants tested

- ✅ **game-poc** - Original top-down physics demo
- ✅ **side-scroller** - Horizontal platformer
- ✅ **admin-game** - Element management system
- ✅ **tower-defense** - Tower defense game
- ✅ **physics-adventure** - Momentum platformer

### Viewing results

After the workflow completes:

1. **Test Coverage**: Check the workflow summary or PR comments for coverage percentages
2. **Screenshots**: Download from the Actions artifacts section
   - `screenshots-game-poc`
   - `screenshots-side-scroller`
   - `screenshots-admin-game`
   - `screenshots-tower-defense`
   - `screenshots-physics-adventure`

### Local testing

To run the same checks locally:

```bash
# Run tests for a specific game
cd game-poc
npm test -- --coverage

# Generate screenshots (requires Playwright)
npm install --save-dev playwright
npx playwright install chromium
node screenshot-game.js
```

### Screenshot naming

- `game-start.png` - Initial game state after loading
- `game-action-1.png` - After right arrow key press
- `game-action-2.png` - After jump/space key press
- `game-mobile.png` - Mobile responsive view (375×667)

### Artifacts retention

- Test results and screenshots are kept for **30 days**
- Download them from the workflow run page before they expire
