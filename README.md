# 📱 Smart Todo Dashboard App (React Native + Expo)

A modern mobile-first task management application built using React Native (Expo) with authentication, task tracking, and dynamic UI.

![React Native](https://img.shields.io/badge/React_Native-Expo-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-ES6-blue)
![Context API](https://img.shields.io/badge/Context_API-State-purple)
![Expo Router](https://img.shields.io/badge/Expo_Router-Routing-black)
![AsyncStorage](https://img.shields.io/badge/AsyncStorage-Storage-orange)
![Status](https://img.shields.io/badge/Status-Active-success)

---

## 📱 About The Project

This app allows users to manage daily tasks efficiently with a clean and interactive interface.
It demonstrates:

- Authentication system
- Task CRUD operations
- Local data persistence
- State management using Context API
- Mobile UI/UX best practices
  
---

## 🚀 Features

### 🔐 Authentication System
- User **Register & Login**
- Data stored using **AsyncStorage**
- Persistent login session
- User-specific dashboard (like Instagram)

---

### 🏠 Dashboard
- Dynamic greeting (Good Morning / Afternoon / Evening)
- Displays logged-in **user name**
- **Progress bar** (task completion percentage)
- **3 Interactive Stat Cards**
  - 📊 Total Tasks
  - ⏳ Pending Tasks
  - ✅ Completed Tasks
- Clickable → filters tasks accordingly

---

### 🔍 Task Management
- Add, Edit, Delete tasks
- Swipe gestures:
  - 👉 Swipe right → Complete task
  - 👈 Swipe left → Delete task
- Task details modal with edit option
- Prevents re-completing already completed tasks

---

### 📅 Calendar Integration
- View tasks based on **selected date**
- Shows:
  - 🟢 Completed tasks
  - 🔴 Pending tasks
- Click on date → filter tasks

---

### ➕ Add Task
- Built using **React Hook Form**
- Fields:
  - Title
  - Description
  - Priority (Low / Medium / High)
  - Due Date
- Date Picker integration
- Form validation

---

### 👤 Profile Screen
- Edit user name
- Dark Mode toggle 🌙
- Logout functionality
- Changes reflect instantly on dashboard

---

### 🎨 UI/UX Highlights
- Clean and modern UI
- Dark / Light theme support
- Haptic feedback
- Toast notifications
- Responsive design

---

## 🛠️ Tech Stack

- ⚛️ React Native (Expo)
- 🧭 Expo Router
- 🧠 Context API (Auth + Task Management)
- 💾 AsyncStorage (Local Storage)
- 📝 React Hook Form + Yup (Validation)
- 📅 react-native-calendars
- 🎯 Expo Haptics
- 🔔 react-native-toast-message

---

## 📂 Project Structure
```
app/
  (auth)/
    login.tsx
    register.tsx

  (tabs)/
    dashboard.tsx
    addtask.tsx
    profile.tsx
    _layout.tsx

calendar.tsx
index.tsx
tasks.tsx

context/
  AuthContext.tsx
  TaskContext.tsx

theme/
  colors.ts
  darkTheme.ts
  useTheme.ts

components/
assets/
hooks/
styles/
constants/
```

---

## ⚙️ Getting Started
**Prerequisites**

- Node.js
- npm / yarn
- Expo CLI

---

## ⚙️ Installation & Setup

```bash
# Clone the repo
git clone https://github.com/krishnavekariya346-blip/smart-todo-dashboard-app.git

# Navigate to project
cd smart-todo-dashboard-app

# Install dependencies
npm install

# Start Expo
npx expo start
```
---

📱 Usage

- Register or login
- Add new tasks
- Swipe to complete or delete
- Track progress on dashboard
- Filter tasks using calendar
- Toggle dark/light mode

---

## 📸 Screenshots

### 🔐 Login
<p align="left">
  <img src="screenshots/login1.jpg" width="300"/>&nbsp;&nbsp;
  <img src="screenshots/login2.jpg" width="300"/>&nbsp;&nbsp;
  <img src="screenshots/login3.jpg" width="300"/>
</p>

---

### 📝 Register
<p align="left">
  <img src="screenshots/register1.jpg" width="300"/>&nbsp;&nbsp;
  <img src="screenshots/register2.jpg" width="300"/>&nbsp;&nbsp;
  <img src="screenshots/register3.jpg" width="300"/>
</p>

---

### 🏠 Dashboard
<p align="left">
  <img src="screenshots/dashboard1.jpg" width="300"/>&nbsp;&nbsp;
  <img src="screenshots/dashboard2.jpg" width="300"/>&nbsp;&nbsp;
  <img src="screenshots/dashboard3.jpg" width="300"/>
</p>
<p align="left">
  <img src="screenshots/dashboard4.jpg" width="300"/>&nbsp;&nbsp;
  <img src="screenshots/dashboard5.jpg" width="300"/>&nbsp;&nbsp;
  <img src="screenshots/searchTask.jpg" width="300"/>
</p>

---

### 📅 Calendar
<p align="left">
  <img src="screenshots/calendar1.jpg" width="300"/>&nbsp;&nbsp;
  <img src="screenshots/calendar2.jpg" width="300"/>&nbsp;&nbsp;
  <img src="screenshots/calendar3.jpg" width="300"/>
</p>

---

### ➕ Add Task
<p align="left">
  <img src="screenshots/addTaskHigh.jpg" width="300"/>&nbsp;&nbsp;
  <img src="screenshots/addTaskMedium.jpg" width="300"/>&nbsp;&nbsp;
  <img src="screenshots/addTaskLow.jpg" width="300"/>
</p>

---

### 👤 Profile
<p align="left">
  <img src="screenshots/profile.jpg" width="300"/>&nbsp;&nbsp;
  <img src="screenshots/editProfile.jpg" width="300"/>&nbsp;&nbsp;
  <img src="screenshots/editProfile1.jpg" width="300"/>
</p>

---

### 📋 Tasks
<p align="left">
  <img src="screenshots/tasks1.jpg" width="300"/>&nbsp;&nbsp;
  <img src="screenshots/showCompleted.jpg" width="300"/>&nbsp;&nbsp;
  <img src="screenshots/completedToast.jpg" width="300"/>
</p>
<p align="left">
  <img src="screenshots/disappearCompleted.jpg" width="300"/>&nbsp;&nbsp;
  <img src="screenshots/showDelete.jpg" width="300"/>&nbsp;&nbsp;
  <img src="screenshots/deletedToast.jpg" width="300"/>
</p>
<p align="left">
  <img src="screenshots/tasks2.jpg" width="300"/>&nbsp;&nbsp;
  <img src="screenshots/viewModal.jpg" width="300"/>&nbsp;&nbsp;
  <img src="screenshots/editModel.jpg" width="300"/>
</p>
<p align="left">
  <img src="screenshots/pendingTask.jpg" width="300"/>&nbsp;&nbsp;
  <img src="screenshots/completedTask.jpg" width="300"/>
</p>

---

### 🌙 Dark Theme
<p align="left">
  <img src="screenshots/darkTheme1.jpg" width="300"/>&nbsp;&nbsp;
  <img src="screenshots/darkTheme2.jpg" width="300"/>&nbsp;&nbsp;
  <img src="screenshots/darkTheme3.jpg" width="300"/>
</p>
<p align="left">
  <img src="screenshots/darkTheme4.jpg" width="300"/>
</p>

---

---

## 🔐 Data Handling

- Data stored locally using AsyncStorage
- User-specific storage:
  
    TASKS_userEmail
- Ensures each user sees only their tasks

---

## 🧠 Key Concepts Used

- Context API for global state
- Persistent authentication
- Form validation with Yup
- Swipe gestures for UX
- Dynamic theming system

---

## 🌟 Future Improvements

- 🔄 Cloud sync (Firebase / Supabase)
- 📲 Push notifications
- 🧑‍🤝‍🧑 Multi-user collaboration
- 📊 Task analytics
- 🏷️ Task categories

---

## Contact

Krishna Vekariya

GitHub: https://github.com/krishnavekariya346-blip/smart-todo-dashboard-app

---

## Acknowledgments
- React Native Docs
- Expo Docs
- AsyncStorage
- React Hook Form


---

## 📄 License

This project is licensed under the MIT License.

---

