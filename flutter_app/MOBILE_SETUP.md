# Mobile Setup Instructions

## 🚀 Quick Start Commands

### 1. Generate Platform Files
```bash
cd flutter_app
flutter create . --platforms=android,ios
```

### 2. Install Dependencies
```bash
flutter pub get
```

### 3. Run on Device/Emulator
```bash
# Android
flutter run -d android

# iOS (macOS only)
flutter run -d ios
```

## 📱 Platform-Specific Setup

### Android Configuration

#### Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<!-- Add these permissions before <application> tag -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
<uses-permission android:name="android.permission.USE_FINGERPRINT" />
```

#### Update `android/app/build.gradle`:
```gradle
android {
    compileSdkVersion 34
    
    defaultConfig {
        minSdkVersion 21
        targetSdkVersion 34
    }
}
```

### iOS Configuration

#### Add to `ios/Runner/Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>Camera access for property photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Photo library access for property images</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Location access for property mapping</string>
<key>NSFaceIDUsageDescription</key>
<string>Face ID for secure authentication</string>
```

## 🔧 Current App Status

### ✅ COMPLETED:
- ✅ Enhanced API Client with authentication
- ✅ Basic asset files (loading animation, app logo)
- ✅ Complete dependency injection
- ✅ Mock authentication system
- ✅ Platform configuration instructions

### 🚧 READY FOR DEVELOPMENT:
- **Mock Login**: Use any email/password to login
- **Navigation**: All routes are set up
- **State Management**: BLoC pattern implemented
- **Storage**: Secure storage configured

### 📋 NEXT STEPS:
1. Run `flutter create . --platforms=android,ios`
2. Add platform permissions as mentioned above
3. Run `flutter pub get`
4. Test on device with `flutter run`

## 🧪 Testing the App

### Mock Authentication:
- **Email**: Any valid email format
- **Password**: Any non-empty password
- **Role**: Choose "landlord" or "tenant"

### Available Features:
- Splash screen with loading animation
- Onboarding flow
- Login/Register (mock)
- Dashboard navigation
- All pages are placeholder-ready for implementation

## 🛠️ Development Notes

The app is configured to work immediately with:
- Mock API responses for authentication
- Local storage for user data
- Placeholder UI for all features
- Clean architecture with BLoC pattern

To switch to real backend:
1. Update `baseUrl` in `app_constants.dart`
2. Replace mock data source with real implementation
3. Implement actual API endpoints

## 📱 Build Commands

### Debug Build:
```bash
flutter run
```

### Release Build:
```bash
# Android APK
flutter build apk --release

# Android App Bundle
flutter build appbundle --release

# iOS (macOS only)
flutter build ios --release
```