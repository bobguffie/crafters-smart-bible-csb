# 📖 Crafters Smart Bible (CSB)

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC.svg)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![Tauri](https://img.shields.io/badge/Desktop-Tauri_v1-24C8DB.svg)](https://tauri.app/)
[![Capacitor](https://img.shields.io/badge/Mobile-Capacitor_v8-119EFF.svg)](https://capacitorjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Crafters Smart Bible (CSB)** is an interactive, retro Rolodex-style craft settings database and concurrent workshop timer suite designed for makers, laser engravers, 3D printing enthusiasts, and sublimation crafters.

---

## ✨ Features

### 🗂️ Retro Rolodex Craft Material Cards
- **Mechanical Flip Navigation**: Flip through materials using keyboard arrows, swipe gestures, or the intuitive Rolodex index wheel.
- **Craft Categories**:
  - 🔥 **Sublimation**: Temperature (°F/°C), press time (seconds), pressure level (Light, Medium, Firm), pre-press notes.
  - 🖨️ **3D Printing**: Printhead temperature, bed temperature, slicer profiles (PLA, PETG, TPU, ABS, Resin), layer heights.
  - ⚡ **Laser Cutting & Engraving**: Speed (mm/s), power percentage, pass count, air assist toggle, engraving DPI.
  - 🛠️ **Miscellaneous / Other**: Custom craft disciplines (leatherwork, resin casting, heat transfer vinyl, ceramics) with custom duration and temperature/pressure metrics.
- **Instant Search & Filtering**: Filter by category, favorite cards with a star, or filter across tags and titles in real time.

### ⏱️ Concurrent Workshop Timers
- **Multi-Timer Engine**: Run simultaneous countdown timers for multiple presses, prints, and laser jobs at once.
- **Custom Sound Alert Selector**: Choose your preferred alert tone (**Digital Alarm**, **Beep**, **Chime**, or **Bell**) on each individual timer or globally.
- **Quick Presets**: 30s, 60s, 90s, 120s, 15m, 30m, and custom duration inputs.

### 🤖 Gemini AI Craft Assistant & Natural Language Updates
- **Smart Material Generator**: Enter any material name (e.g. *"Tumbler 20oz Stainless"*, *"Acrylic 3mm Clear"*), and Gemini AI generates optimal parameters for all craft disciplines.
- **Natural Language Command Parser**: Update settings using quick plain-text commands (e.g. `tab = laser, speed = 25 mm/s, power = 85%, material = 3mm Basswood`).
- **Offline / Quota-Resilient Fallback**: Built-in on-device fallback rule system ensures you can create and tweak parameters even without an internet connection or if API limits are reached.

### 📱 Progressive Web App (PWA)
- **Install Anywhere**: Install on Windows, macOS, Android, and iOS.
- **iPhone / iPad Support**: Tap the in-app **Install App** button to view guided *"Add to Home Screen"* steps for full-screen iOS experience without browser URL bars.
- **Offline Caching**: All assets and styles are cached locally via modern service workers.

### 💾 Private Local-First Storage & Data Portability
- **Zero Cloud Tracking**: All cards, timers, and personal notes stay in your private browser storage.
- **Backup & Restore**: Export your entire craft database as a `.json` file anytime and restore it on any device via the **Settings** gear modal.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) (version 20 or higher recommended)
- `npm` (bundled with Node.js)

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open your browser at `http://localhost:3000` to interact with Crafters Smart Bible.

### Production Web Build
```bash
npm run build
npm start
```

---

## 🔑 Configuring Your Gemini API Key

Your Gemini API key is stored **only in your private browser `localStorage`** and is never shared, exposed, or committed to GitHub.

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Launch the Crafters Smart Bible app.
3. Click the **⚙️ Settings Gear** icon in the header.
4. Paste your API key into the **Gemini API Key** field and click **Save Settings**.

---

## 🛠️ Automated Cross-Platform Builds (GitHub Actions)

Crafters Smart Bible comes with a preconfigured CI/CD workflow located at `.github/workflows/build.yml`. It builds native desktop executables and mobile packages across 5 platforms:

| Platform | Output Format | Build Engine |
| :--- | :--- | :--- |
| **Windows** | `.exe` / `.msi` | Tauri (Rust + WebView2) |
| **macOS** | `.dmg` / `.app` | Tauri (Rust + WebKit) |
| **Linux** | `.AppImage` / `.deb` | Tauri (Rust + WebKitGTK) |
| **Android** | `.apk` (Debug) | Capacitor + Gradle SDK |
| **iOS** | Xcode Project (Unsigned) | Capacitor iOS |

### ⚠️ Why GitHub Actions May Not Run Automatically After Pushing

If your builds didn't start automatically after your first push, check these three common GitHub repository settings:

1. **Verify Default Branch Name**:
   - The workflow triggers on pushes to `main` and `master`.
   - If your git repository pushed to a branch with a different name, either rename the branch to `main` or merge it into `main`.
2. **Enable Actions in GitHub Settings**:
   - In your GitHub repo, go to **Settings** > **Actions** > **General**.
   - Under **Actions permissions**, select **"Allow all actions and reusable workflows"** and click **Save**.
3. **Enable Workflow Write Permissions**:
   - On the same page (**Settings** > **Actions** > **General**), scroll down to **Workflow permissions**.
   - Select **"Read and write permissions"** and check **"Allow GitHub Actions to create and approve pull requests"**. Click **Save**.
4. **Manual Run (`workflow_dispatch`)**:
   - Go to your repository on GitHub.
   - Click the **Actions** tab at the top.
   - Select **"Build Cross-Platform Apps (Desktop & Mobile)"** from the left sidebar.
   - Click the **Run workflow** dropdown button, select branch `main`, and click **Run workflow**.

### 📥 Downloading Built Files
Once the workflow finishes running:
1. Click on the completed workflow run under the **Actions** tab.
2. Scroll to the bottom of the page to the **Artifacts** section.
3. Download the zipped artifacts for your platform:
   - `CSB-Windows-Desktop`
   - `CSB-macOS-Desktop`
   - `CSB-Linux-Desktop`
   - `CSB-Android-APK`
   - `CSB-iOS-Unsigned-Xcode-Project`

---

## 📂 Project Architecture

```
crafters-smart-bible/
├── .github/
│   └── workflows/
│       └── build.yml            # Cross-platform GitHub Actions CI/CD
├── public/
│   ├── csb_logo.jpg             # Cybernetic craft logo
│   ├── pwa-192x192.png          # PWA icons
│   └── pwa-512x512.png
├── src/
│   ├── assets/                  # App images and artwork
│   ├── components/
│   │   ├── ApiKeyWelcomeModal.tsx # Welcome guide for entering Gemini API key
│   │   ├── CardModal.tsx        # Add / Edit material parameters modal
│   │   ├── ExportModal.tsx      # JSON backup & restore manager
│   │   ├── Header.tsx           # Search, filters, timer trigger & settings cog
│   │   ├── PWAInstallButton.tsx # One-tap PWA installer & iOS helper
│   │   ├── RolodexCard.tsx      # Mechanical flip card with craft tabs
│   │   ├── SettingsModal.tsx    # Sound selector, API key & import/export
│   │   └── TimerDrawer.tsx      # Multi-timer concurrent workshop drawer
│   ├── data/
│   │   └── defaultCards.ts      # Pre-seeded popular craft settings
│   ├── hooks/
│   │   └── usePWAInstall.ts     # Standalone mode & PWA prompt detection
│   ├── types.ts                 # TypeScript types for cards, crafts & timers
│   ├── App.tsx                  # Main state container & carousel logic
│   └── main.tsx                 # React entry point
├── src-tauri/                   # Rust desktop application config (Windows, Mac, Linux)
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── src/main.rs
├── capacitor.config.ts          # Mobile application config (Android, iOS)
├── vite.config.ts               # Vite configuration with Tailwind & VitePWA
├── server.ts                    # Backend proxy for Gemini AI with offline fallback
└── package.json
```

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
Feel free to customize, modify, and distribute for your workshop or studio!
