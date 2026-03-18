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

### Login
![Login](screenshots/login.png)

### Register
![Signup](screenshots/signup.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Calendar
![Products](screenshots/products.png)

### AddTask
![Cart](screenshots/carts.png)

### Profile
![Post](screenshots/posts.png)

### Todo Page
![todo](screenshots/todos.png)
![todoDetails](screenshots/todosDetail.png)
![Login](screenshots/login1.jpg)
![Login](screenshots/login2.jpg)
![Login](screenshots/login3.jpg)

### Register
![Register](screenshots/register1.jpg)
![Register](screenshots/register2.jpg)
![Register](screenshots/register3.jpg)

### Dashboard
![Dashboard](screenshots/dashboard1.jpg)
![Dashboard](screenshots/dashboard2.jpg)
![Dashboard](screenshots/dashboard3.jpg)
![Dashboard](screenshots/dashboard4.jpg)
![Dashboard](screenshots/dashboard5.jpg)
![Search](screenshots/searchTask.jpg)


### Calendar
![Calendar](screenshots/calendar1.jpg)
![Calendar](screenshots/calendar2.jpg)
![Calendar](screenshots/calendar3.jpg)

### AddTask
![AddTask](screenshots/addTaskHigh.jpg)
![AddTask](screenshots/addTaskMedium.jpg)
![AddTask](screenshots/addTaskLow.jpg)

### Profile
![Profile](screenshots/profile.jpg)
![EditedProfile](screenshots/editProfile.jpg)
![EditedProfile](screenshots/editProfile1.jpg)

### Tasks
![tasks](screenshots/tasks1.jpg)
![task-complete](screenshots/showCompleted.jpg)
![completedToast](screenshots/completedToast.jpg)
![disAppearComplete](screenshots/disappearCompleted.jpg)
![task-delete](screenshots/showDelete.jpg)
![deletedToast](screenshots/deletedToast.jpg)
![AfterDeletedTasks](screenshots/tasks2.jpg)
![ViewTask](screenshots/viewModal.jpg)
![EditTask](screenshots/editModel.jpg)
![PendingTasks](screenshots/pendingTask.jpg)
![CompletedTasks](screenshots/completedTask.jpg)

### DarkTheme
![DarkTheme](screenshots/darkTheme1.jpg)
![DarkTheme](screenshots/darkTheme2.jpg)
![DarkTheme](screenshots/darkTheme3.jpg)
![DarkTheme](screenshots/darkTheme4.jpg)


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
















=======
>>>>>>> 121a5ab (Added screenshots and updated README)

---

## 📄 License

This project is licensed under the MIT License.