import { useTheme } from "@/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useContext, useRef, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SwipeListView } from "react-native-swipe-list-view";
import Toast from "react-native-toast-message";
import * as yup from "yup";
import { TaskContext } from "../context/TaskContext";

// Validation Schema yup
const schema = yup.object({
  title: yup.string().required("Task title is required").min(3, "Too short"),
  description: yup.string().ensure(),
  priority: yup.string().required(),
  dueDate: yup.string().required("Due date is required"),
});

interface FormData extends FieldValues {
  title: string;
  description: string;
  priority: string;
  dueDate: string;
}

export default function TaskListScreen() {
  const { tasks, deleteTask, completeTask, editTask } = useContext(TaskContext);
  const { colors } = useTheme();
  const { filter } = useLocalSearchParams();
  const swipeRef = useRef<any>(null);

  const [viewVisible, setViewVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  // React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      title: "",
      description: "",
      priority: "Low",
      dueDate: "",
    },
  });

  const currentPriority = watch("priority");

  //Based on rout params filtering logic for completed and pending tasks
  let filteredTasks = tasks;
  if (filter === "completed") {
    filteredTasks = tasks.filter((t) => t.completed);
  } else if (filter === "pending") {
    filteredTasks = tasks.filter((t) => !t.completed);
  }

  //Progress Calculation
  const completedCount = tasks.filter((t) => t.completed).length;
  const progress =
    tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  //Priority color logic
  const getPriorityColor = (priority: string) => {
    if (priority === "High") return "#EF4444";
    if (priority === "Medium") return "#F59E0B";
    return "#22C55E";
  };

  // shows task details modal
  const openView = (task: any) => {
    Haptics.selectionAsync();
    swipeRef.current?.closeAllOpenRows();
    setSelectedTask(task);
    setViewVisible(true);
  };

  // loads task into form for editing
  const openEditFromView = () => {
    if (!selectedTask) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    reset({
      title: selectedTask.title,
      description: selectedTask.description || "",
      priority: selectedTask.priority,
      dueDate: selectedTask.dueDate,
    });

    setViewVisible(false);
    setEditVisible(true);
  };

  // updates task
  const onSaveEdit = (data: FormData) => {
    if (!selectedTask) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    editTask(selectedTask.id, data as any);

    setEditVisible(false);
    Toast.show({ type: "success", text1: "Task Updated" });
  };

  //deletes task
  const handleDelete = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    deleteTask(id);
    Toast.show({ type: "error", text1: "Task Deleted" });
  };

  //mark task completed
  const handleComplete = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task?.completed) {
      swipeRef.current?.safeCloseOpenRow?.();
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeTask(id);
    Toast.show({ type: "success", text1: "Task Completed " });
    swipeRef.current?.safeCloseOpenRow?.();
  };

  //returns screen title based on filter
  const getTitle = () => {
    if (filter === "completed") return "Completed Tasks";
    if (filter === "pending") return "Pending Tasks";
    return "All Tasks";
  };

  //shows msg for No task found
  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="clipboard-outline"
        size={60}
        color={colors.subText + "40"}
      />
      <Text style={[styles.emptyText, { color: colors.text }]}>
        No tasks found
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
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
            {getTitle()}
          </Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={[styles.progressTitle, { color: colors.text }]}>
          Task Progress
        </Text>
        <View
          style={[styles.progressContainer, { backgroundColor: colors.border }]}
        >
          <View
            style={[
              styles.progressBar,
              { width: `${progress}%`, backgroundColor: colors.primary },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: colors.subText }]}>
          {completedCount} of {tasks.length} tasks completed
        </Text>
        <SwipeListView
          ref={swipeRef}
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          rightOpenValue={-0.1}
          leftOpenValue={0.1}
          ListEmptyComponent={EmptyListComponent}
          contentContainerStyle={
            filteredTasks.length === 0 ? { flex: 1 } : { paddingBottom: 20 }
          }
          onSwipeValueChange={(swipeData) => {
            const { key, value } = swipeData;
            if (value > 150) {
              const task = tasks.find((t) => t.id === key);
              if (task && !task.completed) handleComplete(key);
            }
            if (value < -150) handleDelete(key);
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={1}
              style={[styles.card, { backgroundColor: colors.card }]}
              onPress={() => openView(item)}
            >
              <View style={styles.taskHeader}>
                <Text style={[styles.taskTitle, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Ionicons
                  name={item.completed ? "checkmark-circle" : "time-outline"}
                  size={20}
                  color={item.completed ? "#22C55E" : "#F59E0B"}
                />
              </View>
              {item.description ? (
                <Text style={[styles.description, { color: colors.subText }]}>
                  {item.description}
                </Text>
              ) : null}
              <View style={styles.metaRow}>
                <View
                  style={[
                    styles.priorityBadge,
                    { backgroundColor: getPriorityColor(item.priority) + "20" },
                  ]}
                >
                  <Text
                    style={{
                      color: getPriorityColor(item.priority),
                      fontWeight: "600",
                      fontSize: 12,
                    }}
                  >
                    {item.priority}
                  </Text>
                </View>
                <Text style={[styles.date, { color: colors.subText }]}>
                  📅 {item.dueDate}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          renderHiddenItem={({ item }) => (
            <View style={styles.hiddenRow}>
              <View
                style={[
                  styles.completeBtn,
                  {
                    backgroundColor: !item.completed
                      ? "#22C55E20"
                      : "transparent",
                  },
                ]}
              >
                {!item.completed && (
                  <Ionicons name="checkmark-circle" size={28} color="#22C55E" />
                )}
              </View>
              <View
                style={[styles.deleteBtn, { backgroundColor: "#EF444420" }]}
              >
                <Ionicons name="trash-outline" size={28} color="#EF4444" />
              </View>
            </View>
          )}
        />
        {/* modal to open task description */}
        <Modal visible={viewVisible} transparent animationType="fade">
          <View style={styles.modal}>
            <View style={[styles.viewBox, { backgroundColor: colors.card }]}>
              <View style={styles.viewHeader}>
                <Text style={[styles.viewTitle, { color: colors.text }]}>
                  Task Details
                </Text>
                <View style={{ flexDirection: "row", gap: 15 }}>
                  <TouchableOpacity onPress={openEditFromView}>
                    <Ionicons
                      name="create-outline"
                      size={24}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setViewVisible(false)}>
                    <Ionicons name="close" size={24} color={colors.text} />
                  </TouchableOpacity>
                </View>
              </View>
              {selectedTask && (
                <>
                  <Text style={[styles.viewTaskTitle, { color: colors.text }]}>
                    {selectedTask.title}
                  </Text>
                  <Text style={[styles.viewDesc, { color: colors.subText }]}>
                    {selectedTask.description || "No description"}
                  </Text>
                  <View style={styles.viewMeta}>
                    <View
                      style={[
                        styles.priorityBadge,
                        {
                          backgroundColor:
                            getPriorityColor(selectedTask.priority) + "20",
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: getPriorityColor(selectedTask.priority),
                          fontWeight: "600",
                        }}
                      >
                        {selectedTask.priority}
                      </Text>
                    </View>
                    <Text style={{ color: colors.subText }}>
                      📅 {selectedTask.dueDate}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
        {/* model for task editTask */}
        <Modal visible={editVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View
              style={[styles.modalContent, { backgroundColor: colors.card }]}
            >
              <View style={styles.editHeader}>
                <TouchableOpacity
                  onPress={() => setEditVisible(false)}
                  style={styles.backbtn}
                >
                  <Ionicons name="chevron-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.modalTitleText, { color: colors.text }]}>
                  Edit Task
                </Text>
                <View style={{ width: 24 }} />
              </View>
              <View style={styles.modalHandle} />

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.subText }]}>
                    Task Title
                  </Text>
                  <Controller
                    control={control}
                    name="title"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        style={[
                          styles.polishedInput,
                          {
                            color: colors.text,
                            backgroundColor: colors.background,
                            borderColor: errors.title
                              ? "#EF4444"
                              : "transparent",
                            borderWidth: errors.title ? 1 : 0,
                          },
                        ]}
                      />
                    )}
                  />
                  {errors.title && (
                    <Text style={styles.errorText}>{errors.title.message}</Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.subText }]}>
                    Description
                  </Text>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        multiline
                        style={[
                          styles.polishedInput,
                          {
                            height: 80,
                            color: colors.text,
                            backgroundColor: colors.background,
                          },
                        ]}
                      />
                    )}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.subText }]}>
                    Due Date
                  </Text>
                  <Controller
                    control={control}
                    name="dueDate"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        style={[
                          styles.polishedInput,
                          {
                            color: colors.text,
                            backgroundColor: colors.background,
                            borderColor: errors.dueDate
                              ? "#EF4444"
                              : "transparent",
                            borderWidth: errors.dueDate ? 1 : 0,
                          },
                        ]}
                      />
                    )}
                  />
                  {errors.dueDate && (
                    <Text style={styles.errorText}>
                      {errors.dueDate.message}
                    </Text>
                  )}
                </View>

                <View style={styles.modernPriorityRow}>
                  {["Low", "Medium", "High"].map((p) => (
                    <TouchableOpacity
                      key={p}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setValue("priority", p);
                      }}
                      style={[
                        styles.modernPriorityOption,
                        {
                          borderColor:
                            currentPriority === p
                              ? getPriorityColor(p)
                              : "transparent",
                          backgroundColor:
                            currentPriority === p
                              ? getPriorityColor(p) + "15"
                              : colors.background,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.priorityText,
                          {
                            color:
                              currentPriority === p
                                ? getPriorityColor(p)
                                : colors.subText,
                          },
                        ]}
                      >
                        {p}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[
                      styles.secondaryBtn,
                      { borderColor: colors.border },
                    ]}
                    onPress={() => setEditVisible(false)}
                  >
                    <Text style={{ color: colors.text }}>Discard</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.primaryBtn,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={handleSubmit(onSaveEdit)}
                  >
                    <Text style={styles.primaryBtnText}>Update Task</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
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
  backbtn: { padding: 8 },
  headerTitle: { fontSize: 22, fontWeight: "700" },
  progressTitle: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  progressContainer: { height: 8, borderRadius: 10, overflow: "hidden" },
  progressBar: { height: "100%" },
  progressText: { fontSize: 12, marginTop: 5, marginBottom: 15 },
  card: { padding: 18, borderRadius: 12, marginBottom: 12 },
  taskHeader: { flexDirection: "row", justifyContent: "space-between" },
  taskTitle: { fontSize: 16, fontWeight: "bold" },
  description: { marginTop: 4 },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  priorityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  date: { fontSize: 12 },
  hiddenRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  completeBtn: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    paddingLeft: 20,
    borderRadius: 12,
  },
  deleteBtn: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 20,
    borderRadius: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyText: { fontSize: 18, fontWeight: "800", marginTop: 15 },
  emptySubText: { fontSize: 14, marginTop: 5, textAlign: "center" },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  viewBox: { padding: 22, borderRadius: 14, width: "90%" },
  viewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  viewTitle: { fontSize: 18, fontWeight: "bold" },
  viewTaskTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  viewDesc: { marginBottom: 15 },
  viewMeta: { flexDirection: "row", justifyContent: "space-between" },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "90%",
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 15,
  },
  editHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  modalTitleText: { fontSize: 18, fontWeight: "700" },
  label: { fontSize: 13, marginBottom: 6, fontWeight: "600" },
  inputGroup: { marginBottom: 18 },
  polishedInput: { borderRadius: 12, padding: 14, fontSize: 16 },
  modernPriorityRow: { flexDirection: "row", gap: 10, marginBottom: 25 },
  modernPriorityOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  priorityText: { fontWeight: "700", fontSize: 14 },
  buttonRow: { flexDirection: "row", gap: 12 },
  primaryBtn: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: "#FFF", fontWeight: "700" },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: "500",
  },
});
