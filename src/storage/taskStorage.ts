import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';
import { createSampleTasks } from '../data/sampleTasks';

const STORAGE_KEY = 'TASKS';

// Đọc danh sách công việc. Lần chạy đầu tiên (chưa có dữ liệu) thì tạo dữ liệu mẫu.
export async function loadTasks(): Promise<Task[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json === null) {
      const samples = createSampleTasks();
      await saveTasks(samples);
      return samples;
    }
    return JSON.parse(json);
  } catch (error) {
    console.log('Lỗi đọc dữ liệu:', error);
    return createSampleTasks();
  }
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.log('Lỗi lưu dữ liệu:', error);
  }
}
