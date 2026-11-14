# DRVLIFE — NATIVE ANDROID APPLICATION
## Kotlin, Jetpack Compose, Room Database & Firebase Spark Free Tier

**Package Name**: `com.example.liferece`  
**Target Platform**: Android 15 (API Level 35, Min SDK 26)  
**Architecture**: MVVM (Model-View-ViewModel) + Offline-First Local Storage  
**Firebase Project ID**: `drvlife-50995` (100% Free Spark Tier)  
**Release Binary**: `apk_release/drvlife-v1.0.apk` (Size: 30,055,659 bytes)  
**SHA-256 Digest**: `A420F818FF0DBDD0D6FC36DB220283709956E3025D5C4949C831C8870907018E`  

---

## 1. Directory Structure

```text
01_APP_ANDROID/
├── android_project/            # Full buildable Android Studio / Gradle project
│   ├── app/                    # Application source, manifests, resources
│   ├── gradle/                 # Version catalog (libs.versions.toml) & wrapper
│   ├── build.gradle.kts        # Root build configuration
│   ├── settings.gradle.kts     # Plugin management & repositories
│   └── gradlew.bat             # Gradle wrapper executable
├── source_code/                # Clean export of Kotlin Compose code & XML resources
├── assets/                     # App icons, logos, and mipmap resources
├── screenshots/                # Genuine Android application screenshots
├── apk_release/                # Verified production and debug APK binaries
├── configuration/              # google-services.json, manifests, file_paths.xml
├── database_firebase/          # Deployed Firestore rules and architecture specs
├── testing/                    # Unit test suites & comprehensive test reports
├── technical_documentation/    # Architecture, performance, and bug fix reports
├── api_documentation/          # Firebase REST & Google Gemini 2.5 API specs
└── README.md                   # This master documentation
```

---

## 2. Prerequisites & Building Instructions

1. **System Requirements**:
   - Android Studio Ladybug | 2024.2+ or Command Line Tools
   - Java Development Kit (JDK): OpenJDK 17 or 21
   - Android SDK Platform 35, Build Tools 35.0.0
2. **Build Debug APK**:
   ```powershell
   cd D:\Liferece\01_APP_ANDROID\android_project
   .\gradlew.bat assembleDebug
   ```
   *Output*: `android_project/app/build/outputs/apk/debug/app-debug.apk`
3. **Run Unit Tests (10/10 PASS)**:
   ```powershell
   .\gradlew.bat testDebugUnitTest
   ```
   *HTML Report*: `android_project/app/build/reports/tests/testDebugUnitTest/index.html`

---

## 3. Core Technical Features

- **Local-First Receipt Sandboxing**: Receipt images are captured, scaled down to 1200px max, and compressed to JPEG 80% (<2 MB) in app-private storage (`context.filesDir/local_receipts`). No binary image blobs are uploaded to cloud buckets.
- **Real-Time Metadata Sync**: Structured transaction documents (~400 bytes) synchronize over Cloud Firestore under `/users/{uid}/transactions`.
- **SHA-256 Deduplication**: `ValidationUtils.generateFingerprint()` produces 60-second time-bucketed cryptographic hashes to prevent accidental duplicate entries upon offline reconnection.
- **AI Financial Advisor**: Anonymized spending data is analyzed via Google Gemini 2.5 API with a 2,500ms client-side cooldown debounce to stay strictly within free tier limits.

