import React, { createContext, useContext, useEffect, useState } from 'react';
import { Task } from '../types';
import { loadTasks, saveTasks } from '../storage/taskStorage';
import { createId } from '../utils/task';

// Dữ liệu dùng để tạo / sửa (không có id và done)
export type TaskInput = Omit<Task, 'id' | 'done'>;

interface TaskContextValue {
  tasks: Task[];
  loading: boolean;
  addTask: (input: TaskInput) => void;
  updateTask: (id: string, input: TaskInput) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  deleteDoneTasks: () => void;
}

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Đọc dữ liệu khi mở ứng dụng
  useEffect(() => {
    loadTasks().then(list => {
      setTasks(list);
      setLoading(false);
    });
  }, []);

  // Mỗi khi danh sách thay đổi thì lưu lại vào AsyncStorage
  useEffect(() => {
    if (!loading) {
      saveTasks(tasks);
    }
  }, [tasks, loading]);

  function addTask(input: TaskInput) {
    const newTask: Task = { ...input, id: createId(), done: false };
    setTasks(prev => [newTask, ...prev]);
  }

  function updateTask(id: string, input: TaskInput) {
    setTasks(prev => prev.map(task => (task.id === id ? { ...task, ...input } : task)));
  }

  function toggleTask(id: string) {
    setTasks(prev => prev.map(task => (task.id === id ? { ...task, done: !task.done } : task)));
  }

  function deleteTask(id: string) {
    setTasks(prev => prev.filter(task => task.id !== id));
  }

  function deleteDoneTasks() {
    setTasks(prev => prev.filter(task => !task.done));
  }

  return (
    <TaskContext.Provider
      value={{ tasks, loading, addTask, updateTask, toggleTask, deleteTask, deleteDoneTasks }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks(): TaskContextValue {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks phải được dùng bên trong TaskProvider');
  }
  return context;
}
