# App Resources

This directory contains resources for building the Android APK.

## Icon

The `icon.svg` file is a simple app icon showing the key elements of the game:
- Paper ball
- Fan
- Hand

### Generating Android Icons

To generate properly sized icons for Android, you can use online tools like:

1. **Android Asset Studio**: https://romannurik.github.io/AndroidAssetStudio/
   - Upload icon.svg
   - Download the generated icon pack
   - Place files in `android/app/src/main/res/` after running `npm run android:init`

2. **Icon Kitchen**: https://icon.kitchen/
   - Upload icon.svg
   - Configure for Android
   - Download and extract to Android project

3. **Capacitor Assets Generator** (command-line):
   ```bash
   npm install -g @capacitor/assets
   npx capacitor-assets generate --android
   ```

### Manual Icon Sizes

If you want to manually create PNG icons, you'll need these sizes:

- `mipmap-mdpi/ic_launcher.png` - 48x48px
- `mipmap-hdpi/ic_launcher.png` - 72x72px
- `mipmap-xhdpi/ic_launcher.png` - 96x96px
- `mipmap-xxhdpi/ic_launcher.png` - 144x144px
- `mipmap-xxxhdpi/ic_launcher.png` - 192x192px

Place these in: `android/app/src/main/res/`

## Splash Screen (Optional)

You can create a splash screen by:

1. Creating a `splash.png` file (2732x2732px recommended)
2. Using Capacitor's splash screen plugin
3. Configuring in `capacitor.config.json`

For now, the app will use a simple white splash screen by default.

## Future Enhancements

Consider adding:
- Adaptive icons (foreground + background layers)
- Different icon variants for round icons
- Feature graphic for Google Play Store (1024x500px)
- Screenshots for store listing
