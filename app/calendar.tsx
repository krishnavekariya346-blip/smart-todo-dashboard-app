import { TaskContext } from "@/context/TaskContext";
import { useTheme } from "@/theme/useTheme";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useContext, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

//Formates date for display
const getReadableDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
};

//convert date format bcz task stores date like 17-03-2026 but calendar needs like 2026-03-17
const formatToCalendarDate = (dateStr: string) => {
  if (!dateStr || !dateStr.includes("-")) return "";
  const [day, month, year] = dateStr.split("-");
  return `${year}-${month}-${day}`;
};

export default function CalendarScreen() {
  const { tasks } = useContext(TaskContext);
  const { colors, darkMode } = useTheme();

  // IsoString => 2026-03-18T09:45:30.000Z
  // after using T seperator => ["2026-03-18", "09:45:30.000Z"]
  //[0] means it gives the first item - date from that array
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Priority Color Helper
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "#EF4444";
      case "Medium":
        return "#F59E0B";
      default:
        return "#22C55E";
    }
  };

  //useMemo used because it only recalculates this list if the tasks or selected date change
  const markedDates = useMemo(() => {
    const marks: any = {};
    tasks.forEach((task) => {
      if (!task.dueDate) return;
      const formatted = formatToCalendarDate(task.dueDate);
      if (!formatted) return;

      marks[formatted] = {
        marked: true,
        dotColor: task.completed ? "#22C55E" : "#EF4444",
      };
    });

    marks[selectedDate] = {
      ...marks[selectedDate],
      selected: true,
      selectedColor: colors.primary,
      selectedTextColor: "#FFFFFF",
    };
    return marks;
  }, [tasks, selectedDate, colors.primary]);

  const tasksForSelectedDate = tasks.filter(
    (task) => formatToCalendarDate(task.dueDate) === selectedDate
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.card }]}
            onPress={() => {
              Haptics.selectionAsync();
              router.back();
            }}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Schedule
          </Text>
          <View style={{ width: 45 }} />
        </View>

        {/* CALENDAR SECTION */}
        <View style={[styles.calendarCard, { backgroundColor: colors.card }]}>
          <Calendar
            current={selectedDate}
            onDayPress={(day) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedDate(day.dateString);
            }}
            markedDates={markedDates}
            enableSwipeMonths={true}
            theme={{
              calendarBackground: "transparent",
              textSectionTitleColor: colors.subText,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: "#ffffff",
              todayTextColor: colors.primary,
              dayTextColor: colors.text,
              textDisabledColor: darkMode ? "#444" : "#D1D5DB",
              dotColor: colors.primary,
              monthTextColor: colors.text,
              textDayFontWeight: "500",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "600",
              arrowColor: colors.primary,
            }}
          />
        </View>

        {/* TASK LIST SECTION */}
        <View style={styles.taskSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {getReadableDate(selectedDate)}
            </Text>
            <View
              style={[
                styles.countBadge,
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <Text style={[styles.countText, { color: colors.primary }]}>
                {tasksForSelectedDate.length}{" "}
                {tasksForSelectedDate.length === 1 ? "Task" : "Tasks"}
              </Text>
            </View>
          </View>

          <FlatList
            data={tasksForSelectedDate}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <MaterialIcons
                  name="task"
                  size={50}
                  color={colors.subText + "60"}
                />
                <Text style={[styles.emptyText, { color: colors.subText }]}>
                  No Tasks Scheduled
                </Text>
              </View>
            )}
            renderItem={({ item }) => {
              const pColor = getPriorityColor(item.priority);
              return (
                <View
                  style={[styles.taskCard, { backgroundColor: colors.card }]}
                >
                  <View
                    style={[
                      styles.priorityLine,
                      { backgroundColor: item.completed ? "#22C55E" : pColor },
                    ]}
                  />

                  <View style={styles.taskContent}>
                    <Text
                      style={[
                        styles.taskTitle,
                        {
                          color: colors.text,
                          textDecorationLine: item.completed
                            ? "line-through"
                            : "none",
                          opacity: item.completed ? 0.5 : 1,
                        },
                      ]}
                    >
                      {item.title}
                    </Text>

                    <View style={styles.metaRow}>
                      {/* Priority Badge */}
                      <View
                        style={[
                          styles.priorityBadge,
                          { backgroundColor: pColor + "15" },
                        ]}
                      >
                        <Text
                          style={[styles.priorityBadgeText, { color: pColor }]}
                        >
                          {item.priority}
                        </Text>
                      </View>

                      {/* Status Text */}
                      <Text
                        style={[
                          styles.statusText,
                          { color: item.completed ? "#22C55E" : "#EF4444" },
                        ]}
                      >
                        • {item.completed ? "Completed" : "Pending"}
                      </Text>
                    </View>
                  </View>

                  <Ionicons
                    name={
                      item.completed ? "checkmark-circle" : "ellipse-outline"
                    }
                    size={26}
                    color={item.completed ? "#22C55E" : colors.border}
                  />
                </View>
              );
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  iconBtn: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 24, fontWeight: "800" },
  calendarCard: {
    borderRadius: 24,
    padding: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  taskSection: { flex: 1 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  countBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  countText: { fontSize: 12, fontWeight: "700" },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
  },
  priorityLine: { width: 4, height: "80%", borderRadius: 2, marginRight: 15 },
  taskContent: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  priorityBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  statusText: { fontSize: 12, fontWeight: "600" },
  emptyState: { alignItems: "center", marginTop: 40 },
  emptyText: { fontSize: 15, fontWeight: "500", marginTop: 15 },
});
