# College Bus Tracker - Project Guide

## Overview
This is a **College Bus Tracking Application** built with **React Native (Expo)** and **Firebase**. It solves the problem of students waiting for buses without knowing their real-time location.

The app has two distinct roles:
1.  **Drivers**: Broadcast their real-time location while driving a specific bus.
2.  **Users (Students/Staff)**: Search for buses by route/location and view them on a live map.

## 🏗 Architecture
- **Frontend**: React Native with Expo.
- **Backend (BaaS)**: Firebase
    - **Authentication**: Email/Password login with role management.
    - **Realtime Database**: Stores bus routes, user roles, and live GPS coordinates.
- **Maps**: `react-native-maps` for visualization.
- **Location**: `expo-location` for tracking driver position.

## 🚀 How to Demo

To properly demo this project, you ideally need **two devices** (or one simulator and one phone) to show the real-time interaction, but you can do it with one by logging out and back in.

### Step 1: Data Setup (Pre-requisite)
Ensure your Firebase Realtime Database has some bus data. The app expects a structure like this at the root `/`:

```json
[
  {
    "BusNo": 1,
    "Bus Route": ["Avadi", "Ambattur", "Anna Nagar"]
  },
  {
    "BusNo": 2,
    "Bus Route": ["Tambaram", "Guindy", "Saidapet"]
  }
]
```

### Step 2: Driver Flow (The Broadcaster)
1.  Open the app on **Device A** (or simulator).
2.  **Sign Up / Login**:
    - Enter email/password.
    - **Important**: Select **"Driver"** in the role toggle.
    - Click **Sign Up** (or Login if already created).
3.  **Driver Dashboard**:
    - You will be taken to the Driver Dashboard.
    - Select a Bus Number from the dropdown (e.g., "Bus 1").
    - Click **"Start Tracking"**.
    - *Status will change to "Tracking Live..."*.
    - The app is now sending your GPS coordinates to Firebase every few seconds.

### Step 3: User Flow (The Viewer)
1.  Open the app on **Device B** (or logout on Device A).
2.  **Sign Up / Login**:
    - Enter email/password.
    - Select **"User"** (default).
    - Click **Sign Up** / **Login**.
3.  **Home Screen**:
    - You will see a search bar "Select your destination".
    - Type a location from the bus routes (e.g., "Avadi").
    - Select the location from the dropdown.
4.  **Bus List**:
    - You will see a list of buses that go to that location (e.g., "Bus 1").
    - Click on the bus card.
5.  **Route Map**:
    - A map will open showing the static route (stops).
    - **Live Feature**: Check for a **Bus Icon** on the map. This represents the real-time location of the driver from Step 2.
    - If the driver moves, this icon will move on the user's screen!

## 📂 Key Files
- `App.js`: Main entry point.
- `AppWrapper.js`: Handles navigation and checks user Role (User vs Driver) to route to the correct screens.
- `screens/LoginScreen.js`: Authentication logic.
- `screens/DriverDashboard.js`: Driver logic for selecting bus and broadcasting location.
- `screens/SetHome.js` & `BusList.js`: User logic for finding buses.
- `screens/RouteMap.js`: The core visual component showing the map + live bus marker.
