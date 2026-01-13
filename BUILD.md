# Building Paper Ball Game for Android

This guide provides detailed instructions for building the Paper Ball game as an Android APK.

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Java Development Kit (JDK 17)**
   - Download from: https://adoptium.net/ or https://www.oracle.com/java/technologies/downloads/
   - Verify installation: `java -version`
   - Set JAVA_HOME environment variable

4. **Android Studio** (optional but recommended)
   - Download from: https://developer.android.com/studio
   - Install Android SDK (API Level 33 or higher recommended)
   - Set ANDROID_HOME environment variable

5. **Android SDK Command Line Tools** (if not using Android Studio)
   - Can be installed standalone from: https://developer.android.com/studio#command-tools

## Step-by-Step Build Instructions

### 1. Install Project Dependencies

```bash
npm install
```

This will install Capacitor and its Android platform dependencies.

### 2. Initialize Android Platform

```bash
npm run android:init
```

This creates the `android/` directory with the native Android project structure.

### 3. Sync Web Assets to Android

```bash
npm run android:sync
```

This copies your web files (index.html, game.js, etc.) to the Android project's assets folder.

### 4. Build the APK

#### Option A: Build Debug APK (Recommended for Testing)

```bash
npm run android:build-debug
```

The debug APK will be generated at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

This APK is signed with a debug keystore and can be installed immediately on any device for testing.

#### Option B: Build Using Android Studio (Recommended for Release)

1. Open the project in Android Studio:
   ```bash
   npm run android:open
   ```

2. In Android Studio:
   - Wait for Gradle sync to complete
   - Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
   - Once complete, click **locate** to find the APK file

3. For a signed release APK:
   - Click **Build** → **Generate Signed Bundle / APK**
   - Select **APK**
   - Create or select a keystore file
   - Fill in keystore credentials
   - Choose **release** build variant
   - Click **Finish**

#### Option C: Build Release APK from Command Line

```bash
npm run android:build
```

This generates an unsigned release APK at:
```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

**Note:** Unsigned APKs cannot be installed on devices. You need to sign them first.

### 5. Install APK on Device

#### Install Debug APK

Using ADB (Android Debug Bridge):
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

Or simply transfer the APK file to your Android device and open it to install.

#### Install via Android Studio

With your device connected:
1. Click the **Run** button (green play icon)
2. Select your device
3. The app will be installed and launched automatically

## Signing Release APK

To distribute your app, you need to sign the release APK.

### Create a Keystore

```bash
keytool -genkey -v -keystore paper-ball-release.keystore -alias paper-ball -keyalg RSA -keysize 2048 -validity 10000
```

### Sign the APK

```bash
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore paper-ball-release.keystore android/app/build/outputs/apk/release/app-release-unsigned.apk paper-ball
```

### Optimize with zipalign

```bash
zipalign -v 4 android/app/build/outputs/apk/release/app-release-unsigned.apk paper-ball-release.apk
```

## Troubleshooting

### Gradle Build Failed

- Ensure JAVA_HOME is set correctly to JDK 17
- Update Android SDK tools in Android Studio
- Clean and rebuild: `cd android && ./gradlew clean`

### ANDROID_HOME not set

Add to your `.bashrc`, `.zshrc`, or system environment variables:
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
```

### Command not found: capacitor

Make sure dependencies are installed:
```bash
npm install
```

### APK won't install on device

- For debug builds: Enable "Install from Unknown Sources" in device settings
- For release builds: Ensure the APK is properly signed
- Check that the device API level is compatible (Android 5.0+/API 21+)

## Updating the App

When you make changes to the game code (game.js or index.html):

1. Sync changes to Android:
   ```bash
   npm run android:sync
   ```

2. Rebuild the APK:
   ```bash
   npm run android:build-debug
   ```

## File Locations

- **Web assets**: Root directory (`index.html`, `game.js`)
- **Capacitor config**: `capacitor.config.json`
- **Android project**: `android/` (generated, in .gitignore)
- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

## Additional Resources

- Capacitor Documentation: https://capacitorjs.com/docs
- Android Developer Guide: https://developer.android.com/guide
- App Signing Guide: https://developer.android.com/studio/publish/app-signing
