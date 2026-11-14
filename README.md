# DrvLife (LifeRece) — AI-Powered Expense & Receipt Management System

> **Master of Computer Applications (MCA) — Semester 4 Final Project**  
> **Student:** Dhruvit Sarvaiya (Enrollment: `2401A00600037`)  
> **Institution:** Parul University, Centre for Distance and Online Education (CDOE)  
> **Academic Year:** 2026–2027 | **Project Guide:** Prof. Kinjal Ma'am  

---

## 🚀 Live Deployments & Downloads

| Service | Destination | Status |
| :--- | :--- | :--- |
| **Production Web Portal** | [https://liferece.surge.sh](https://liferece.surge.sh) | 🟢 Live |
| **Android Release APK (v1.0)** | [Download drvlife-v1.0.apk](https://liferece.surge.sh/downloads/drvlife-v1.0.apk) | 🟢 Available |
| **APK Direct Hash (SHA-256)** | `A420F818FF0DBDD0D6FC36DB220283709956E3025D5C4949C831C8870907018E` | Verified |
| **Firebase Project** | `drvlife-50995` (Spark Free Tier) | 🟢 Active |

---

## 📖 Project Overview

**DrvLife (LifeRece)** is a modern, cross-platform personal financial intelligence system engineered to eliminate manual receipt tracking and help individuals gain granular visibility over their spending habits. 

The system provides:
1. **Android Native Application**: Built with Kotlin and Jetpack Compose featuring Material Design 3, real-time receipt scanning/camera integration, local sandbox image storage, and intelligent financial insights.
2. **Web Portal**: Built with React 19, TypeScript, Vite, and Tailwind CSS offering responsive financial analytics, transaction categorization, and cloud synchronization.
3. **Cloud Firestore Sync**: Real-time multi-platform transaction metadata synchronization powered by Firebase Authentication and Cloud Firestore rules under the Spark Free Tier.
4. **AI-Powered Financial Advisory**: Contextual financial analysis, category breakdowns, and predictive budgeting tips powered by Google Gemini API.

---

## 🏛️ System Architecture & Storage Philosophy

```
+-----------------------------------------------------------------------------------+
|                                 USER TOUCHPOINTS                                 |
|                                                                                   |
|    +-----------------------------+             +-----------------------------+    |
|    |      Android Mobile App     |             |      Responsive Web App     |    |
|    |   (Kotlin + Jetpack Compose)|             |   (React 19 + TypeScript)   |    |
|    +--------------+--------------+             +--------------+--------------+    |
|                   |                                           |                   |
+-------------------|-------------------------------------------|-------------------+
                    |                                           |
                    v                                           v
+---------------------------------------+   +---------------------------------------+
|        LOCAL RECEIPT STORAGE          |   |        LOCAL RECEIPT STORAGE          |
|                                       |   |                                       |
| - Android Internal App Storage        |   | - Browser IndexedDB Cache             |
|   (context.filesDir / receipts)       |   | - Client-side receipt previews        |
| - 100% Privacy Preserved              |   | - Zero Cloud Storage Dependency       |
| - Zero Bandwidth / Storage Bill       |   | - Instant offline rendering           |
+-------------------+-------------------+   +-------------------+-------------------+
                    |                                           |
                    +--------------------+----------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                        FIREBASE SPARK FREE TIER BACKEND                           |
|                                                                                   |
|  +-------------------------------------+  +------------------------------------+  |
|  |       Firebase Authentication       |  |          Cloud Firestore           |  |
|  | - Email / Password Auth             |  | - User Profiles (users/{uid})      |  |
|  | - Client Token State & Persistence  |  | - Transactions (metadata & totals) |  |
|  | - Secure Firebase UID Mapping       |  | - Enforced Per-User Security Rules |  |
|  +-------------------------------------+  +------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

> **Zero Cloud Billing Guarantee:**  
> DrvLife operates strictly on **Firebase Spark Free Tier**. Receipt binary images remain securely stored in the origin device's local internal storage (`context.filesDir` on Android and IndexedDB on Web). Transaction metadata (amounts, dates, categories, notes) seamlessly synchronizes across devices via Firestore.

---

## 📂 Repository Organization

```text
D:\Liferece\
│
├── 01_APP_ANDROID/                      # Android Mobile Application
│   ├── android_project/                 # Complete Gradle & Kotlin Source Code
│   │   ├── app/src/main/java/...        # Jetpack Compose Screens, ViewModels, Repository
│   │   ├── app/src/main/res/            # Material Design Icons, Themes, Drawables
│   │   ├── app/build.gradle.kts         # Android Build Configuration & Dependencies
│   │   └── google-services.json         # Firebase Android Configuration
│   ├── apk_release/                     # Production Signed APK (drvlife-v1.0.apk)
│   ├── assets/                          # Design assets & vector graphics
│   ├── screenshots/                     # 13 Verified Android UI Screenshots
│   ├── technical_documentation/         # Architecture & Security Documentation
│   └── testing/                         # Android Unit Tests & Device Verification
│
├── 02_WEBSITE/                          # Production Web Application
│   ├── src/                             # React 19 + TypeScript Source Code
│   │   ├── components/                  # Navbar, Modals, Transaction Table, Analytics
│   │   ├── firebase/                    # Firebase Web SDK Configuration
│   │   └── types/                       # TypeScript interfaces
│   ├── public/downloads/                # Hosted APK distribution endpoint
│   ├── screenshots/                     # Web Portal UI Screenshots
│   ├── technical_documentation/         # Web Architecture & Cloud Sync Tests
│   └── package.json                     # Vite, Tailwind & React dependencies
│
└── 03_PARUL_UNIVERSITY_SUBMISSION/      # Academic Master Deliverables
    ├── 01_FINAL_REPORT/                 # 58-Page Complete MCA Project Report (DOCX & PDF)
    ├── 02_CERTIFICATES/                 # 10 Academic Certificates (1 page each, PDF & DOCX)
    ├── 03_PRESENTATION/                 # 19-Slide MCA Project Defense PPTX
    ├── 04_VIVA_PREPARATION/             # 160 Bilingual Q&A Comprehensive Viva Guide
    ├── 05_PROJECT_EVIDENCE/             # Security Audits, Firestore Rules, Test Logs
    └── 06_SUBMISSION_CHECKLIST/         # Academic Verification & QC Sign-off Matrix
```

---

## 🛠️ Tech Stack Matrix

| Layer | Android App | Web Portal |
| :--- | :--- | :--- |
| **Language** | Kotlin 1.9 | TypeScript 5.5 |
| **Framework** | Jetpack Compose (BOM 2024.04.01) | React 19 |
| **Styling / UI** | Material Design 3 (`androidx.compose.material3`) | Tailwind CSS 3.4 |
| **Build Tool** | Gradle 8.4.0 (Kotlin DSL) | Vite 5.4 |
| **Authentication** | Firebase Auth Android SDK (22.3.1) | Firebase Auth Web SDK (10.12.0) |
| **Database** | Cloud Firestore Android SDK (24.11.0) | Cloud Firestore Web SDK (10.12.0) |
| **Local Storage** | Android `context.filesDir` sandbox | Browser IndexedDB / LocalStorage |
| **AI Integration** | Google Gemini Generative AI SDK | Gemini REST Endpoint Integration |

---

## ⚡ Quick Start Guide

### 1. Android Application (Android Studio)
```bash
# Navigate to the Android project root
cd 01_APP_ANDROID/android_project

# Build the debug APK
./gradlew assembleDebug

# Run automated unit tests
./gradlew testDebugUnitTest
```

### 2. Web Portal (Node.js & npm)
```bash
# Navigate to website directory
cd 02_WEBSITE

# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

---

## 🎓 Academic Submission & Authorship

- **Author:** Dhruvit Sarvaiya
- **Enrollment Number:** `2401A00600037`
- **Program:** Master of Computer Applications (MCA) — Semester 4
- **University:** Parul University, Centre for Distance and Online Education (CDOE), Vadodara, Gujarat, India.
- **Academic Year:** 2026–2027
- **Individual Project Declaration:** This project was independently designed, developed, audited, and documented by Dhruvit Sarvaiya.

