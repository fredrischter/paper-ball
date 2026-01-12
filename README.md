# Paper Ball Game

A fun HTML5 canvas game where you shoot a paper ball using a moving hand and try to get it affected by a fan's wind.

## Play in Browser

Open `index.html` in your web browser to play the game.

## Build for Android

This project uses Capacitor to build native Android APK files.

### Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)
- Android Studio (for Android builds)
- Java Development Kit (JDK 17)

### Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Initialize Android platform:**
   ```bash
   npm run android:init
   ```

3. **Open in Android Studio:**
   ```bash
   npm run android:open
   ```
   This will open the project in Android Studio where you can:
   - Build and run on an emulator or physical device
   - Generate signed APK/AAB files
   - Configure app settings

### Build APK from Command Line

**Debug APK:**
```bash
npm run android:build-debug
```
The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

**Release APK:**
```bash
npm run android:build
```
The APK will be at: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

Note: For release builds, you'll need to configure signing keys in Android Studio or via the command line.

## Game Controls

- **Tap/Click** anywhere on the screen to shoot the paper ball upward
- The hand moves automatically in a sine wave pattern
- Try to get the ball through the fan's wind zone

## Technical Details

- Built with vanilla JavaScript and HTML5 Canvas
- Responsive design that adapts to any screen size
- Touch-optimized for mobile devices
- Packaged as Android app using Capacitor