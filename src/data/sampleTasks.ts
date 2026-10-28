import { Task } from '../types';
import { getDateFromToday } from '../utils/date';

// Dữ liệu mẫu cho lần chạy đầu tiên.
// Hạn được tính theo ngày hiện tại để luôn có việc quá hạn, việc hôm nay và việc sắp tới.
export function createSampleTasks(): Task[] {
  return [
    {
      id: '1',
      title: 'Nộp báo cáo sơ đồ BPMN',
      note: 'Nộp file draw.io kèm ảnh PNG qua hệ thống học tập của trường.',
      category: 'Học tập',
      priority: 'Cao',
      dueDate: getDateFromToday(-3),
      done: false,
    },
    {
      id: '2',
      title: 'Đóng tiền ký túc xá',
      note: 'Chuyển khoản và chụp lại biên lai.',
      category: 'Cá nhân',
      priority: 'Cao',
      dueDate: getDateFromToday(-2),
      done: true,
    },
    {
      id: '3',
      title: 'Đọc sách 30 phút',
      note: '',
      category: 'Cá nhân',
      priority: 'Thấp',
      dueDate: getDateFromToday(-1),
      done: true,
    },
    {
      id: '4',
      title: 'Chạy bộ 5 km',
      note: 'Chạy quanh công viên lúc 6h sáng.',
      category: 'Sức khoẻ',
      priority: 'Thấp',
      dueDate: getDateFromToday(0),
      done: false,
    },
    {
      id: '5',
      title: 'Họp nhóm đồ án',
      note: 'Chuẩn bị slide phần thiết kế giao diện, chốt phân công cho tuần sau.',
      category: 'Công việc',
      priority: 'Trung bình',
      dueDate: getDateFromToday(2),
      done: false,
    },
    {
      id: '6',
      title: 'Mua quà sinh nhật mẹ',
      note: '',
      category: 'Cá nhân',
      priority: 'Trung bình',
      dueDate: getDateFromToday(4),
      done: true,
    },
    {
      id: '7',
      title: 'Ôn tập chương 3 Lập trình di động',
      note: 'Xem lại FlatList, Stack Navigation và AsyncStorage.',
      category: 'Học tập',
      priority: 'Cao',
      dueDate: getDateFromToday(5),
      done: false,
    },
    {
      id: '8',
      title: 'Đi khám răng định kỳ',
      note: 'Phòng khám gần trường, nhớ mang thẻ BHYT.',
      category: 'Sức khoẻ',
      priority: 'Trung bình',
      dueDate: getDateFromToday(7),
      done: false,
    },
  ];
}
