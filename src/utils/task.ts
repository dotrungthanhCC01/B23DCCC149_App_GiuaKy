import { Priority, Task } from '../types';
import { getDaysLeft, parseDate } from './date';

// Thứ tự ưu tiên khi sắp xếp: Cao -> Trung bình -> Thấp
export const PRIORITY_ORDER: Record<Priority, number> = {
  Cao: 0,
  'Trung bình': 1,
  Thấp: 2,
};

// Việc chưa xong mà đã qua hạn
export function isOverdue(task: Task): boolean {
  return !task.done && getDaysLeft(task.dueDate) < 0;
}

export function getDueTime(task: Task): number {
  const date = parseDate(task.dueDate);
  return date ? date.getTime() : 0;
}

// Chuỗi hiển thị số ngày còn lại trên màn hình chi tiết
export function getCountdownText(task: Task): string {
  if (task.done) {
    return 'Đã hoàn thành';
  }
  const days = getDaysLeft(task.dueDate);
  if (days > 0) {
    return `Còn ${days} ngày`;
  }
  if (days === 0) {
    return 'Hạn hôm nay';
  }
  return `Quá hạn ${-days} ngày`;
}

export function createId(): string {
  return Date.now().toString() + Math.random().toString(36).slice(2, 7);
}
