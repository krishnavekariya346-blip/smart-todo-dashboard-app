import { AuthContext } from "@/context/AuthContext";
import { useTheme } from "@/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, darkMode, toggleTheme, logout, updateProfile } =
    useContext(AuthContext);
  const { colors } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");

  const handleSave = async () => {
    // 1. Validation logic
    if (newName.trim().length < 3) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Name must be at least 3 characters");
      return;
    }

    try {
      // 2. Perform the update
      await updateProfile(newName);

      // 3. Success Haptic
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsEditing(false);

      // 4. Success Notification
      if (Platform.OS === "android") {
        ToastAndroid.show("Profile updated successfully! ", ToastAndroid.SHORT);
      } else {
        Alert.alert("Success", "Profile updated successfully!");
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Update Failed", "Please try again.");
    }
  };

  const handleToggleTheme = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleTheme();
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out of your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            logout();
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* TOP NAV BAR */}
        <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
          <View style={styles.headerLeftGroup}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }}
              style={styles.backBtn}
            >
              <Ionicons name="chevron-back" size={26} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Profile
            </Text>
          </View>
          {isEditing ? (
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.saveBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                Haptics.selectionAsync();
                setIsEditing(true);
              }}
              style={styles.editBtn}
            >
              <Text style={{ color: colors.primary, fontWeight: "700" }}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ACCOUNT SECTION */}
        <Text style={[styles.sectionLabel, { color: colors.subText }]}>
          ACCOUNT
        </Text>
        <View
          style={[
            styles.groupCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.listItem}>
            <View style={styles.listItemLeft}>
              <Ionicons
                name="person-outline"
                size={20}
                color={colors.subText}
              />
              <Text style={[styles.listItemText, { color: colors.text }]}>
                Name
              </Text>
            </View>
            {isEditing ? (
              <TextInput
                style={[styles.input, { color: colors.primary }]}
                value={newName}
                onChangeText={setNewName}
                autoFocus
                placeholderTextColor={colors.subText}
              />
            ) : (
              <Text style={[styles.listItemValue, { color: colors.subText }]}>
                {user?.name}
              </Text>
            )}
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.listItem}>
            <View style={styles.listItemLeft}>
              <Ionicons name="mail-outline" size={20} color={colors.subText} />
              <Text style={[styles.listItemText, { color: colors.text }]}>
                Email
              </Text>
            </View>
            <Text style={[styles.listItemValue, { color: colors.subText }]}>
              {user?.email}
            </Text>
          </View>
        </View>

        {/* PREFERENCES SECTION */}
        <Text style={[styles.sectionLabel, { color: colors.subText }]}>
          PREFERENCES
        </Text>
        <View
          style={[
            styles.groupCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <TouchableOpacity
            style={styles.listItem}
            onPress={handleToggleTheme}
            activeOpacity={0.6}
          >
            <View style={styles.listItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: "#6366F115" }]}>
                <Ionicons name="moon" size={18} color="#6366F1" />
              </View>
              <Text style={[styles.listItemText, { color: colors.text }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={handleToggleTheme}
              trackColor={{ false: "#767577", true: colors.primary }}
              thumbColor={Platform.OS === "ios" ? undefined : "#f4f3f4"}
            />
          </TouchableOpacity>
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            {
              backgroundColor: colors.danger + "10",
              borderColor: colors.danger + "20",
            },
          ]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={[styles.logoutButtonText, { color: colors.danger }]}>
            Log Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  headerLeftGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  backBtn: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 22, fontWeight: "700" },
  editBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  saveBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  saveBtnText: { color: "#FFF", fontWeight: "700" },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 1,
  },
  groupCard: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 25,
    overflow: "hidden",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    minHeight: 60,
  },
  listItemLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  listItemText: { fontSize: 16, fontWeight: "600" },
  listItemValue: { fontSize: 15, fontWeight: "500" },
  iconBox: { padding: 6, borderRadius: 8 },
  divider: { height: 1, width: "90%", alignSelf: "flex-end" },
  input: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "right",
    flex: 1,
    marginLeft: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 40,
    borderWidth: 1,
    gap: 10,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "800",
  },
});
