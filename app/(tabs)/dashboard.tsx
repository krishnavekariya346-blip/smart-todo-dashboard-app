import { AuthContext } from "@/context/AuthContext";
import { TaskContext } from "@/context/TaskContext";
import { useTheme } from "@/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Dashboard() {
  const { colors } = useTheme();
  const { tasks } = useContext(TaskContext);
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.length - completed;
  const progress =
    tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case "High":
        return { color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)" };
      case "Medium":
        return { color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" };
      default:
        return { color: "#22C55E", bg: "rgba(34, 197, 94, 0.1)" };
    }
  };

  const handleNav = (path: any, params?: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: path, params });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top", "left", "right"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={Keyboard.dismiss}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.greeting, { color: colors.subText }]}>
                {getGreeting()},
              </Text>
              <Text style={[styles.username, { color: colors.text }]}>
                {user?.name || "User"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleNav("/calendar")}
              style={[
                styles.calendarBtn,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Ionicons
                name="calendar-outline"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          {/* HERO CARD */}
          <Animated.View
            style={[
              styles.mainProgressCard,
              { backgroundColor: colors.primary, opacity: fadeAnim },
            ]}
          >
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressTitle}>Productivity</Text>
              <Text style={styles.progressSub}>
                {progress < 100
                  ? `Keep going! You're ${progress}% through your day.`
                  : "Excellent! You've cleared your schedule."}
              </Text>
            </View>
            <View style={styles.progressCircle}>
              <Text style={styles.progressPercentText}>{progress}%</Text>
            </View>
          </Animated.View>

          {/* STATS ROW */}
          <View style={styles.statsRow}>
            <StatItem
              label="Total"
              value={tasks.length}
              icon="layers"
              color="#6366F1"
              bgColor={colors.card}
              onPress={() => handleNav("/tasks", { filter: "all" })}
            />
            <StatItem
              label="Pending"
              value={pending}
              icon="time"
              color="#F59E0B"
              bgColor={colors.card}
              onPress={() => handleNav("/tasks", { filter: "pending" })}
            />
            <StatItem
              label="Done"
              value={completed}
              icon="checkmark-done"
              color="#22C55E"
              bgColor={colors.card}
              onPress={() => handleNav("/tasks", { filter: "completed" })}
            />
          </View>

          {/* SEARCH */}
          <View
            style={[
              styles.searchWrapper,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Ionicons name="search" size={20} color={colors.subText} />
            <TextInput
              placeholder="Quick search..."
              placeholderTextColor={colors.subText + "80"}
              value={search}
              onChangeText={setSearch}
              style={[styles.searchInput, { color: colors.text }]}
            />
          </View>

          {/* SECTION HEADER */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recent Tasks
            </Text>
            <TouchableOpacity onPress={() => handleNav("/tasks")}>
              <Text style={{ color: colors.primary, fontWeight: "700" }}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          {/* TASK LIST OR EMPTY STATE */}
          {filteredTasks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View
                style={[
                  styles.emptyIconCircle,
                  { backgroundColor: colors.card },
                ]}
              >
                <Ionicons
                  name="document-text-outline"
                  size={40}
                  color={colors.subText + "60"}
                />
              </View>
              <Text style={[styles.emptyText, { color: colors.text }]}>
                {search ? "No matches found" : "No tasks yet"}
              </Text>
              <Text style={[styles.emptySubText, { color: colors.subText }]}>
                {search
                  ? "We couldn't find what you're looking for."
                  : "Tap the Add Task button to add your tasks!"}
              </Text>
            </View>
          ) : (
            filteredTasks.slice(0, 9).map((task) => {
              const pInfo = getPriorityInfo(task.priority);
              return (
                <TouchableOpacity
                  key={task.id}
                  style={[
                    styles.taskCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => handleNav("/tasks")}
                >
                  <View
                    style={[
                      styles.priorityLine,
                      { backgroundColor: pInfo.color },
                    ]}
                  />
                  <View style={styles.taskContent}>
                    <View style={styles.taskTopRow}>
                      <Text
                        style={[styles.taskTitle, { color: colors.text }]}
                        numberOfLines={1}
                      >
                        {task.title}
                      </Text>
                      <View
                        style={[styles.pBadge, { backgroundColor: pInfo.bg }]}
                      >
                        <Text
                          style={[styles.pBadgeText, { color: pInfo.color }]}
                        >
                          {task.priority}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.taskBottomRow}>
                      <Text
                        style={[styles.metaText, { color: colors.subText }]}
                      >
                        📅 {task.dueDate}
                      </Text>
                      <Text
                        style={[
                          styles.statusText,
                          { color: task.completed ? "#22C55E" : "#F59E0B" },
                        ]}
                      >
                        {task.completed ? "Completed" : "Active"}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const StatItem = ({ label, value, icon, color, bgColor, onPress }: any) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={[styles.statBox, { backgroundColor: bgColor }]}
    >
      <View style={[styles.iconCircle, { backgroundColor: color + "15" }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.subText }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  greeting: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  username: { fontSize: 26, fontWeight: "900", letterSpacing: -0.5 },
  calendarBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  mainProgressCard: {
    borderRadius: 28,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  progressTextContainer: { flex: 1 },
  progressTitle: { color: "#FFF", fontSize: 20, fontWeight: "900" },
  progressSub: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    marginTop: 6,
    fontWeight: "500",
  },
  progressCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
  },
  progressPercentText: { color: "#FFF", fontWeight: "900", fontSize: 15 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 30 },
  statBox: {
    flex: 1,
    padding: 18,
    borderRadius: 24,
    alignItems: "center",
    elevation: 2,
    shadowOpacity: 0.05,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statValue: { fontSize: 20, fontWeight: "900" },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    marginBottom: 35,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  sectionTitle: { fontSize: 19, fontWeight: "600", letterSpacing: -0.5 },
  taskCard: {
    flexDirection: "row",
    borderRadius: 20,
    marginBottom: 14,
    overflow: "hidden",
    borderWidth: 1,
    elevation: 1,
  },
  priorityLine: { width: 6 },
  taskContent: { flex: 1, padding: 18 },
  taskTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  taskTitle: { fontSize: 16, fontWeight: "700", flex: 1, marginRight: 10 },
  pBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  pBadgeText: { fontSize: 10, fontWeight: "800", textTransform: "uppercase" },
  taskBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaText: { fontSize: 12, fontWeight: "600" },
  statusText: { fontSize: 12, fontWeight: "800" },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 40,
  },
});
