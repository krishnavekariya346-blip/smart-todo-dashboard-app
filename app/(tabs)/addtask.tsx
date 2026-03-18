import { TaskContext } from "@/context/TaskContext";
import { useTheme } from "@/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useCallback, useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

type TaskFormData = {
  title: string;
  description: string;
  priority: string;
  dueDate: string;
};

export default function AddTask() {
  const { addTask } = useContext(TaskContext);
  const { colors } = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: {
      title: "",
      description: "",
      priority: "Medium",
      dueDate: "",
    },
  });

  useFocusEffect(
    useCallback(() => {
      reset();
      setShowDatePicker(false);
    }, [reset])
  );

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      Haptics.selectionAsync();
      const day = selectedDate.getDate().toString().padStart(2, "0");
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
      const year = selectedDate.getFullYear();
      setValue("dueDate", `${day}-${month}-${year}`, { shouldValidate: true });
    }
  };

  const onSubmit = (data: TaskFormData) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addTask({ ...data, completed: false });
    Toast.show({
      type: "success",
      text1: "Task Created! ",
    });
    router.back();
  };

  const priorities = [
    { label: "Low", color: "#22C55E" },
    { label: "Medium", color: "#F59E0B" },
    { label: "High", color: "#EF4444" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.card }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            New Task
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View
            style={[
              styles.mainCard,
              { backgroundColor: colors.card, shadowColor: "#000" },
            ]}
          >
            {/* --- TITLE FIELD --- */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.subText }]}>
                Task Title
              </Text>
              <Controller
                control={control}
                name="title"
                rules={{ required: "Task title is required" }}
                render={({ field: { onChange, value } }) => (
                  <View
                    style={[
                      styles.innerInputWrapper,
                      {
                        backgroundColor: colors.background,
                        borderColor: errors.title ? "#EF4444" : "transparent",
                        borderWidth: 1.5,
                      },
                    ]}
                  >
                    <TextInput
                      placeholder="Enter Task Title"
                      placeholderTextColor={colors.subText}
                      value={value}
                      onChangeText={onChange}
                      style={[styles.input, { color: colors.text }]}
                    />
                  </View>
                )}
              />
              {errors.title && (
                <Text style={styles.errorText}>{errors.title.message}</Text>
              )}
            </View>

            {/* --- DESCRIPTION FIELD --- */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.subText }]}>
                Description
              </Text>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                  <View
                    style={[
                      styles.innerInputWrapper,
                      { backgroundColor: colors.background, minHeight: 80 },
                    ]}
                  >
                    <TextInput
                      placeholder="Add Task Details (Optional)"
                      placeholderTextColor={colors.subText}
                      value={value}
                      onChangeText={onChange}
                      multiline
                      style={[
                        styles.input,
                        { color: colors.text, height: 80, paddingTop: 12 },
                      ]}
                    />
                  </View>
                )}
              />
            </View>

            {/* --- PRIORITY FIELD --- */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.subText }]}>
                Priority
              </Text>
              <Controller
                control={control}
                name="priority"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.modernPriorityRow}>
                    {priorities.map((p) => (
                      <TouchableOpacity
                        key={p.label}
                        onPress={() => {
                          Haptics.impactAsync(
                            Haptics.ImpactFeedbackStyle.Light
                          );
                          onChange(p.label);
                        }}
                        style={[
                          styles.priorityOption,
                          {
                            backgroundColor:
                              value === p.label
                                ? p.color + "15"
                                : colors.background,
                            borderColor:
                              value === p.label ? p.color : "transparent",
                            borderWidth: 1.5,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.priorityText,
                            {
                              color:
                                value === p.label ? p.color : colors.subText,
                            },
                          ]}
                        >
                          {p.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
            </View>

            {/* --- DUE DATE FIELD --- */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.subText }]}>
                Due Date
              </Text>
              <Controller
                control={control}
                name="dueDate"
                rules={{ required: "Please select a due date" }}
                render={({ field: { value } }) => (
                  <>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[
                        styles.dateBtn,
                        {
                          backgroundColor: colors.background,
                          borderColor: errors.dueDate
                            ? "#EF4444"
                            : "transparent",
                          borderWidth: 1.5,
                        },
                      ]}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setShowDatePicker(true);
                      }}
                    >
                      <View style={styles.dateInfo}>
                        <Ionicons
                          name="calendar-outline"
                          size={20}
                          color={errors.dueDate ? "#EF4444" : colors.primary}
                        />
                        <Text
                          style={[
                            styles.dateText,
                            { color: value ? colors.text : colors.subText },
                          ]}
                        >
                          {value || "Select Date"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {errors.dueDate && (
                      <Text style={styles.errorText}>
                        {errors.dueDate.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.submitBtn, { backgroundColor: colors.primary }]}
              onPress={handleSubmit(onSubmit, () => {
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Error
                );
              })}
            >
              <Text style={styles.submitBtnText}>Add Task</Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
  },
  iconBtn: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 22, fontWeight: "700" },
  scrollContent: { paddingBottom: 30, paddingTop: 10 },
  mainCard: {
    borderRadius: 24,
    padding: 20,
    elevation: 6,
    marginBottom: 20,
  },
  inputGroup: { marginBottom: 20 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  innerInputWrapper: { borderRadius: 14, paddingHorizontal: 16 },
  input: { fontSize: 16, paddingVertical: 12 },
  modernPriorityRow: { flexDirection: "row", gap: 8 },
  priorityOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  priorityText: { fontWeight: "700", fontSize: 13 },
  dateBtn: { flexDirection: "row", padding: 14, borderRadius: 12 },
  dateInfo: { flexDirection: "row", alignItems: "center" },
  dateText: { marginLeft: 10, fontSize: 15, fontWeight: "600" },
  submitBtn: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  submitBtnText: { color: "#FFF", fontSize: 18, fontWeight: "700" },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: "500",
  },
});
