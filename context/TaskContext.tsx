import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

type Task = {
  id: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  completed: boolean;
};

type TaskContextType = {
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  editTask: (id: string, updatedTask: Partial<Task>) => void;
};

export const TaskContext = createContext<TaskContextType>({
  tasks: [],
  addTask: () => {},
  deleteTask: () => {},
  completeTask: () => {},
  editTask: () => {},
});

export const TaskProvider = ({ children }: any) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const { user } = useContext(AuthContext);

  const STORAGE_KEY = `TASKS_${user?.email}`;

  /* -------- LOAD TASKS -------- */
  useEffect(() => {
    if (user) {
      loadTasks();
    } else {
      setTasks([]);
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem(STORAGE_KEY);

      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.log("Error loading tasks", error);
    }
  };

  /* -------- SAVE TASKS -------- */
  const saveTasks = async (updatedTasks: Task[]) => {
    try {
      setTasks(updatedTasks);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.log("Error saving tasks", error);
    }
  };

  /* -------- ADD TASK -------- */
  const addTask = (task: Omit<Task, "id">) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...task,
    };
    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
  };

  /* -------- DELETE TASK -------- */
  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    saveTasks(updatedTasks);
  };

  /* -------- COMPLETE TASK -------- */
  const completeTask = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: true } : task
    );
    saveTasks(updatedTasks);
  };

  /* -------- EDIT TASK -------- */
  const editTask = (id: string, updatedTask: Partial<Task>) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, ...updatedTask } : task
    );
    saveTasks(updatedTasks);
  };

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, deleteTask, completeTask, editTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};
