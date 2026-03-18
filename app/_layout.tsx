import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { AuthProvider } from "../context/AuthContext";
import { TaskProvider } from "../context/TaskContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <TaskProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
      </TaskProvider>
    </AuthProvider>
  );
}
