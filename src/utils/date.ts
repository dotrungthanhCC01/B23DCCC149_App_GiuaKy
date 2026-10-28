// Các hàm xử lý ngày tháng dạng dd/mm/yyyy

const WEEKDAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const ONE_DAY = 24 * 60 * 60 * 1000;

// Ngày hôm nay lúc 00:00
export function getToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// Date -> "dd/mm/yyyy"
export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
}

// Ngày cách hôm nay n ngày, dạng "dd/mm/yyyy"
export function getDateFromToday(days: number): string {
  const date = getToday();
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

// Số ngày trong một tháng (month: 1 - 12)
export function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

// "dd/mm/yyyy" -> Date, trả về null nếu sai định dạng hoặc ngày không có thật
export function parseDate(text: string): Date | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  if (!match) {
    return null;
  }
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > getDaysInMonth(month, year)) {
    return null;
  }
  return new Date(year, month - 1, day);
}

// Kiểm tra ô hạn hoàn thành, trả về thông báo lỗi ('' nếu hợp lệ)
export function validateDueDate(text: string, checkPast: boolean): string {
  if (text.trim() === '') {
    return 'Vui lòng nhập hạn hoàn thành';
  }
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  if (!match) {
    return 'Hạn phải đúng định dạng dd/mm/yyyy';
  }
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (month < 1 || month > 12) {
    return 'Tháng không hợp lệ (chỉ từ 01 đến 12)';
  }
  const maxDay = getDaysInMonth(month, year);
  if (day < 1 || day > maxDay) {
    return `Ngày không tồn tại (tháng ${month}/${year} chỉ có ${maxDay} ngày)`;
  }
  const date = new Date(year, month - 1, day);
  if (checkPast && date < getToday()) {
    return `Hạn không được trước hôm nay (${formatDate(getToday())})`;
  }
  return '';
}

// Tự chèn dấu "/" khi gõ: "30102026" -> "30/10/2026"
export function formatDateInput(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length > 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  }
  if (digits.length > 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

// Số ngày còn lại tới hạn (âm nghĩa là đã quá hạn)
export function getDaysLeft(dueDate: string): number {
  const date = parseDate(dueDate);
  if (!date) {
    return 0;
  }
  return Math.round((date.getTime() - getToday().getTime()) / ONE_DAY);
}

export function getWeekday(date: Date): string {
  return WEEKDAYS[date.getDay()];
}
