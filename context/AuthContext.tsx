import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { ReactNode, createContext, useEffect, useState } from "react";

type User = {
  name: string;
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string) => Promise<void>;
  darkMode: boolean;
  toggleTheme: () => void;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  updateProfile: async () => {},
  darkMode: false,
  toggleTheme: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const USERS_KEY = "REGISTERED_USERS";
  const CURRENT_USER_KEY = "CURRENT_USER";

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const savedUser = await AsyncStorage.getItem(CURRENT_USER_KEY);
    const allUsers = await AsyncStorage.getItem(USERS_KEY);

    console.log("---  APP START: STORAGE CHECK ---");
    console.log(
      "CURRENT SESSION:",
      savedUser ? JSON.parse(savedUser) : "None (Logged Out)"
    );
    console.log(
      "ALL REGISTERED USERS:",
      allUsers ? JSON.parse(allUsers) : "Empty Database"
    );
    console.log("-----------------------------------");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  /* -------- UPDATE PROFILE -------- */
  const updateProfile = async (newName: string) => {
    if (!user) return;

    // 1. Create the updated user object
    const updatedUser = { ...user, name: newName };

    // 2. Update the Current User session
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

    // 3. Update the user in the Registered Users list (so changes persist after re-login)
    const usersData = await AsyncStorage.getItem(USERS_KEY);
    if (usersData) {
      const users: User[] = JSON.parse(usersData);
      const updatedUsers = users.map((u) =>
        u.email === user.email ? updatedUser : u
      );
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    }

    // 4. Update the state so the UI refreshes
    setUser(updatedUser);
  };

  /* -------- REGISTER -------- */
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    const usersData = await AsyncStorage.getItem(USERS_KEY);
    const users: User[] = usersData ? JSON.parse(usersData) : [];

    const userExists = users.find((u) => u.email === email);
    if (userExists) return false;

    const newUser = { name, email, password };
    const updatedUsers = [...users, newUser];

    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

    // LOG THE NEW DATABASE STATE
    console.log("NEW USER REGISTERED!");
    console.log("DATA:", newUser);
    console.log("TOTAL USERS NOW:", updatedUsers.length);
    setUser(newUser);
    return true;
  };

  /* -------- LOGIN -------- */
  const login = async (email: string, password: string): Promise<boolean> => {
    const usersData = await AsyncStorage.getItem(USERS_KEY);
    if (!usersData) return false;

    const users: User[] = JSON.parse(usersData);
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) return false;

    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));
    setUser(foundUser);
    return true;
  };

  /* -------- LOGOUT -------- */
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        darkMode,
        toggleTheme,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
