# Mobile Application Technical Assignment

This is a premium React Native mobile application built using Expo, combining high-quality video learning with interactive triggers and a robust offline gaming platform.

## 🚀 Key Features

### 1. Video Learning Module
- **Topic List**: Browse a curated list of educational topics.
- **Interrupted Playback**: Smart pausing system that triggers every 60 seconds.
- **Interactive Activities**: Integrated activity selector to resume playback, encouraging active learning.
- **Session Tracking**: Real-time tracking of completed activities.

### 2. Offline Games Module
- **Cloud-Synced Downloads**: Download interactive HTML5 games on demand.
- **Local Persistence**: Games are reliably stored in the device's scoped document directory.
- **Offline WebView Playback**: High-performance extraction and local rendering of games using `react-native-zip-archive` and `WebView`.
- **Intelligent State Management**: Handles download progress, extraction status, and offline availability seamlessly.

## 🛠️ Tech Stack
- **Framework**: React Native (Expo SDK 54)
- **Video Engine**: `expo-av`
- **File System**: `expo-file-system/legacy` (Standardized for broad compatibility)
- **Local Storage**: `@react-native-async-storage/async-storage`
- **WebView**: `react-native-webview`
- **Graphics & Icons**: `lucide-react-native`
- **Navigation**: React Navigation v7

## 📂 Project Links
- **GitHub Repository**: [https://github.com/shaiksumaiah/mobile-app.git](https://github.com/shaiksumaiah/mobile-app.git)
- **Video Demonstration**: [Watch Demo on Google Drive](https://drive.google.com/file/d/1d2nA9gL2kyjotE5mih-Alk4oYqhi3NZS/view?usp=sharing)
- **Latest Build (APK)**: [Expo Build Artifact](https://expo.dev/accounts/shaiksumaiah/projects/mobile-app/builds/d15251cf-c1b0-49d9-ada0-3994cd692358)

## 🏗️ Getting Started

1. **Clone & Install**:
   ```bash
   git clone https://github.com/shaiksumaiah/mobile-app.git
   cd mobile-app
   npm install
   ```

2. **Start Development**:
   ```bash
   npx expo start
   ```

3. **Android Build**:
   The project is pre-configured for Android. Run `npx expo run:android` or use EAS for cloud builds:
   ```bash
   npx eas-cli build -p android --profile preview
   ```

## 📐 Architecture
- **Layered Design**: Clean separation between UI screens (`src/screens`) and core logic (`src/services`).
- **Singleton Services**: Centralized handlers like `FileService.js` for robust cross-platform file management.
- **UX Focused**: Glassmorphism effects, smooth animations, and a vibrant color palette for a premium feel.

---
*Created for the Mobile Application Technical Assignment.*
