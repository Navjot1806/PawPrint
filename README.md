<div align="center">

# 🐾 PawPrint

### Your Dog's Health & Happiness Companion

[![React Native](https://img.shields.io/badge/React_Native-0.83-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-55-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-lightgrey?style=for-the-badge)]()

<br/>

*Track health records, log daily activities, capture precious memories — all in one beautifully designed app built for dog parents who care.*

<br/>

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **🏠 Home Dashboard** | At-a-glance overview with snapshot cards and up-next reminders |
| **💊 Health Tracker** | Log vet visits, vaccinations, medications & health milestones |
| **🏃 Activity Log** | Track walks, playtime, meals, and daily routines |
| **📸 Memories** | Photo journal to capture and cherish your dog's best moments |
| **👤 Profile** | Manage your dog's profile, notifications & app preferences |
| **🔐 Authentication** | Secure email sign-up/login with email verification flow |

---

## 🛠 Tech Stack

```
Frontend        React Native 0.83 + Expo 55
Navigation      React Navigation (Stack + Bottom Tabs)
Backend         Firebase (Auth, Firestore, Storage)
State           React Context API
Animations      React Native Reanimated
Maps            React Native Maps
Media           Expo Image Picker
Location        Expo Location
```

---

## 📂 Project Structure

```
PawPrint/
├── App.js                    # Root navigator & auth flow
├── firebase.js               # Firebase configuration
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── TabBar.js         # Custom bottom tab bar
│   │   ├── ProgressRing.js   # Circular progress indicator
│   │   ├── SnapshotCard.js   # Dashboard snapshot cards
│   │   ├── UpNextItem.js     # Upcoming tasks widget
│   │   ├── MemoryCard.js     # Photo memory card
│   │   ├── FAB.js            # Floating action button
│   │   └── AccordionSection.js
│   ├── contexts/
│   │   ├── AuthContext.js    # Authentication state
│   │   └── DataContext.js    # App data management
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── HealthScreen.js
│   │   ├── ActivityScreen.js
│   │   ├── MemoriesScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── SplashScreen.js
│   │   └── auth/             # Login, SignUp, ForgotPassword, VerifyEmail
│   ├── services/             # API & business logic
│   ├── theme/
│   │   └── colors.js         # App color palette
│   └── utils/                # Helper functions
└── assets/                   # Icons, splash screen, images
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- A [Firebase](https://console.firebase.google.com/) project with Auth, Firestore & Storage enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/Navjot1806/PawPrint.git
cd PawPrint

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Email/Password Authentication**
3. Create a **Firestore Database**
4. Enable **Firebase Storage**
5. Add your config to `firebase.js`

---

## 🎨 Design

PawPrint uses a warm, friendly color palette designed to feel welcoming and pet-friendly:

| Color | Hex | Usage |
|-------|-----|-------|
| 🟠 Primary | `#FFB347` | Buttons, highlights, brand identity |
| 🟢 Secondary | `#87B9A0` | Success states, health indicators |
| ⚪ Background | `#F2F2F7` | App background |
| 🔴 Warning | `#E74C3C` | Alerts, critical health reminders |

---

## 📱 Screens

| Auth Flow | Main App |
|-----------|----------|
| Splash Screen | Home Dashboard |
| Login / Sign Up | Health Tracker |
| Email Verification | Activity Log |
| Welcome Screen | Memories Gallery |
| Forgot Password | Profile & Settings |

---

## 📄 License

This project is proprietary software. All rights reserved.

---

<div align="center">

**Built with ❤️ for dog parents everywhere**

*By [Navjot Singh](https://github.com/Navjot1806)*

</div>
