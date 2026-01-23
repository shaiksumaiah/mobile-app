# Mobile Application Technical Assignment

This is a React Native mobile application built using Expo that combines video learning with in-video activities and downloadable offline games.

## Features

### 1. Video Learning Module
- **Topic List**: Browse multiple topics.
- **Interrupted Playback**: Video pauses every 60 seconds of playback.
- **Activity Triggers**: Users must choose an activity to resume the video.
- **Activity Tracking**: Tracks the number of completed activities per session.

### 2. Games Module (Offline Support)
- **Downloadable Content**: Games can be downloaded from a remote source.
- **Local Storage**: Games are stored in the device's document directory.
- **Offline Playback**: Uses `react-native-zip-archive` to extract local HTML5 games and a WebView to play them without internet.
- **Robust States**: Handles downloading, unzipping, success, and offline availability states.

## Tech Stack
- **Framework**: React Native (Expo)
- **Video**: `expo-av`
- **Offline Storage**: `expo-file-system` & `@react-native-async-storage/async-storage`
- **WebView**: `react-native-webview`
- **Icons**: `lucide-react-native`
- **Navigation**: `@react-navigation/native` & `@react-navigation/stack`

## Setup Instructions

1.  **Clone the repository** (if you were cloning this for the first time):
    ```bash
    git clone <repo-url>
    cd mobile-app
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    npx expo start
    ```

4.  **Run on Android**:
    - Ensure you have an Android emulator or a physical device connected via USB with "USB Debugging" enabled.
    - Press **a** in the terminal to run on Android.

## Architecture
- **Layered Structure**: Separation of concerns between UI (screens/components) and Logic (services).
- **Service-Oriented**: `FileService.js` handles all file operations centrally.
- **Responsive UI**: Custom styles using Flexbox and Dimensions for a premium look.

## Submission
- **Android APK**: [Download from Google Drive](https://drive.google.com/file/d/1VuE07m6hfLQ2L5ExU3wc3u9MaLY0byon/view?usp=sharing)
- **GitHub Repo**: [https://github.com/shaiksumaiah/mobile-app](https://github.com/shaiksumaiah/mobile-app)
