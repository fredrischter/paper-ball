# Quick Start Guide - Building Paper Ball APK

## Fastest Way to Get an APK

### Option 1: Use GitHub Actions (Easiest - No Local Setup Required)

1. Push this code to your GitHub repository
2. Go to the "Actions" tab
3. Click on "Build Android APK" workflow
4. Click "Run workflow" button
5. Wait for the build to complete (~3-5 minutes)
6. Download the APK from the "Artifacts" section

The APK will be ready to install on any Android device!

### Option 2: Build Locally (Requires Setup)

**Prerequisites:**
- Node.js installed
- Java JDK 17 installed
- Android SDK installed (via Android Studio)

**Quick Commands:**
```bash
# 1. Install dependencies
npm install

# 2. Initialize Android platform
npm run android:init

# 3. Build debug APK
npm run android:build-debug

# 4. Find your APK at:
# android/app/build/outputs/apk/debug/app-debug.apk
```

**Transfer the APK to your phone and install it!**

### Option 3: Use Android Studio (Most Control)

```bash
# 1. Install dependencies
npm install

# 2. Initialize and open Android Studio
npm run android:init
npm run android:open

# 3. In Android Studio:
# - Click "Build" → "Build Bundle(s) / APK(s)" → "Build APK(s)"
# - Click "locate" to find the APK file
```

## What's Included

This project now has everything needed to build an Android APK:

- ✅ `index.html` - Main HTML file for the game
- ✅ `game.js` - Game logic (unchanged)
- ✅ `package.json` - Build scripts and dependencies
- ✅ `capacitor.config.json` - Android app configuration
- ✅ `.github/workflows/build-android.yml` - Automated CI build
- ✅ `BUILD.md` - Detailed build instructions
- ✅ `README.md` - Updated with Android build info

## Next Steps After Building

1. **Install on Device**: Transfer the APK to your Android phone and install it
2. **Test the Game**: Make sure it works properly on mobile
3. **Customize**: 
   - Change app name in `capacitor.config.json` (appName)
   - Change package name in `capacitor.config.json` (appId)
   - Add app icons (see BUILD.md for details)
4. **Publish**: Sign the APK and upload to Google Play Store (see BUILD.md)

## Troubleshooting

**"npm: command not found"**
- Install Node.js from https://nodejs.org/

**"ANDROID_HOME not set"**
- Install Android Studio and set up the Android SDK
- See BUILD.md for detailed instructions

**Build fails in GitHub Actions**
- Check the Actions tab for error logs
- The workflow should work automatically with no configuration

**APK won't install on phone**
- Enable "Install from Unknown Sources" in phone settings
- Make sure you're using the debug APK for testing

## Support

For detailed instructions, see:
- `BUILD.md` - Complete build guide with troubleshooting
- `README.md` - Project overview and quick instructions
