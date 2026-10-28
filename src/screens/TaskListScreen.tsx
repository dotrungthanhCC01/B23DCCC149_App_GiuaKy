import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Task } from '../types';
import { useTasks } from '../context/TaskContext';
import TaskItem from '../components/TaskItem';
import { colors, fonts, radius, shadow, spacing } from '../theme/colors';
import { formatDate, getToday, getWeekday } from '../utils/date';
import { getDueTime, isOverdue, PRIORITY_ORDER } from '../utils/task';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskList'>;

type Filter = 'all' | 'pending' | 'done' | 'overdue';
type SortBy = 'date' | 'priority';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chưa xong' },
  { key: 'done', label: 'Đã xong' },
  { key: 'overdue', label: 'Quá hạn' },
];

export default function TaskListScreen({ navigation }: Props) {
  const { tasks, toggleTask, deleteTask, deleteDoneTasks } = useTasks();
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');

  // Thống kê tiến độ
  const doneCount = tasks.filter(task => task.done).length;
  const pendingCount = tasks.length - doneCount;
  const overdueCount = tasks.filter(isOverdue).length;
  const percent = tasks.length === 0 ? 0 : Math.round((doneCount * 100) / tasks.length);

  // Lọc + tìm kiếm + sắp xếp cùng lúc
  const visibleTasks = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const result = tasks.filter(task => {
      if (filter === 'pending' && task.done) {
        return false;
      }
      if (filter === 'done' && !task.done) {
        return false;
      }
      if (filter === 'overdue' && !isOverdue(task)) {
        return false;
      }
      return task.title.toLowerCase().includes(keyword);
    });

    return result.sort((a, b) => {
      const byDate = getDueTime(a) - getDueTime(b);
      const byPriority = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (sortBy === 'date') {
        return byDate !== 0 ? byDate : byPriority;
      }
      return byPriority !== 0 ? byPriority : byDate;
    });
  }, [tasks, search, filter, sortBy]);

  function confirmDelete(task: Task) {
    Alert.alert(
      'Xoá công việc?',
      `Bạn có chắc muốn xoá "${task.title}"? Thao tác này không thể hoàn tác.`,
      [
        { text: 'Huỷ', style: 'cancel' },
        { text: 'Xoá', style: 'destructive', onPress: () => deleteTask(task.id) },
      ],
    );
  }

  function confirmDeleteDone() {
    Alert.alert(
      'Xoá việc đã hoàn thành?',
      `Sẽ xoá ${doneCount} công việc đã hoàn thành khỏi danh sách. Thao tác này không thể hoàn tác.`,
      [
        { text: 'Huỷ', style: 'cancel' },
        { text: `Xoá ${doneCount} việc`, style: 'destructive', onPress: deleteDoneTasks },
      ],
    );
  }

  const today = getToday();

  // Phần đầu danh sách (truyền dạng element để ô tìm kiếm không bị mất focus)
  const listHeader = (
    <View>
      {/* Header: lời chào + tổng số công việc + tiến độ */}
      <View style={styles.headerCard}>
        <View style={styles.topBar}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>SV</Text>
          </View>
          <View style={styles.topBarText}>
            <Text style={styles.dateText}>
              {getWeekday(today)}, {formatDate(today)}
            </Text>
            <Text style={styles.screenTitle}>Công việc của tôi</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {/* Ô tổng số công việc */}
          <View style={styles.totalBox}>
            <Text style={styles.totalNumber}>{tasks.length}</Text>
            <Text style={styles.totalLabel}>Tổng công việc</Text>
          </View>

          {/* Thống kê theo trạng thái */}
          <View style={styles.statList}>
            <View style={styles.statItem}>
              <View style={[styles.statDot, styles.dotPending]} />
              <Text style={styles.statNumber}>{pendingCount}</Text>
              <Text style={styles.statLabel}>chưa xong</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statDot, styles.dotDone]} />
              <Text style={styles.statNumber}>{doneCount}</Text>
              <Text style={styles.statLabel}>đã xong</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statDot, styles.dotOverdue]} />
              <Text style={styles.statNumber}>{overdueCount}</Text>
              <Text style={styles.statLabel}>quá hạn</Text>
            </View>
          </View>
        </View>

        {/* Tiến độ */}
        <View style={styles.progressTop}>
          <Text style={styles.progressTitle}>
            Đã hoàn thành {doneCount}/{tasks.length} công việc
          </Text>
          <Text style={styles.percent}>{percent}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${percent}%` }]} />
        </View>
        {tasks.length === 0 && (
          <Text style={styles.progressHint}>Hãy thêm công việc đầu tiên để bắt đầu theo dõi.</Text>
        )}
      </View>

      {/* Ô tìm kiếm + nút sắp xếp */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <View style={styles.searchIcon}>
            <View style={styles.searchCircle} />
            <View style={styles.searchHandle} />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo tên công việc..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search !== '' && (
            <Pressable onPress={() => setSearch('')} hitSlop={10}>
              <Text style={styles.clearText}>✕</Text>
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={() => setSortBy(sortBy === 'date' ? 'priority' : 'date')}
          style={({ pressed }) => [styles.sortButton, pressed && styles.sortButtonPressed]}
        >
          <Text style={styles.sortIcon}>⇅</Text>
        </Pressable>
      </View>

      {/* Hàng nút lọc */}
      <View style={styles.filterRow}>
        {FILTERS.map(item => {
          const active = filter === item.key;
          return (
            <Pressable
              key={item.key}
              onPress={() => setFilter(item.key)}
              style={({ pressed }) => [
                styles.filterButton,
                active && styles.filterActive,
                pressed && !active && styles.filterPressed,
              ]}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Kiểu sắp xếp + nút xoá việc đã xong */}
      <View style={styles.actionRow}>
        <Text style={styles.sortLabel} numberOfLines={1}>
          Sắp xếp:{' '}
          <Text style={styles.sortValue}>
            {sortBy === 'date' ? 'Hạn gần nhất' : 'Ưu tiên cao → thấp'}
          </Text>
        </Text>
        {/* Chỉ hiện ở tab có việc đã xong (Tất cả / Đã xong) */}
        {(filter === 'all' || filter === 'done') && (
          <Pressable
            onPress={confirmDeleteDone}
            disabled={doneCount === 0}
            style={({ pressed }) => [
              styles.clearDoneButton,
              pressed && styles.clearDonePressed,
              doneCount === 0 && styles.clearDoneDisabled,
            ]}
          >
            <Text style={[styles.clearDoneText, doneCount === 0 && styles.clearDoneTextDisabled]}>
              Xoá việc đã hoàn thành ({doneCount})
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  // Trạng thái danh sách rỗng
  const emptyView = (
    <View style={styles.emptyCard}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyIconText}>✓</Text>
      </View>
      <Text style={styles.emptyTitle}>
        {tasks.length === 0 ? 'Chưa có công việc nào' : 'Không tìm thấy công việc'}
      </Text>
      <Text style={styles.emptyText}>
        {tasks.length === 0
          ? 'Nhấn "Thêm việc" để lập kế hoạch cho ngày hôm nay. Danh sách sẽ được lưu lại trên máy.'
          : 'Thử đổi bộ lọc hoặc từ khoá tìm kiếm khác.'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <FlatList
        data={visibleTasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
            onLongPress={() => confirmDelete(item)}
            onToggle={() => toggleTask(item.id)}
          />
        )}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={emptyView}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />

      {/* Nút thêm việc nổi */}
      <Pressable
        onPress={() => navigation.navigate('TaskForm')}
        style={({ pressed }) => [
          styles.fab,
          { bottom: insets.bottom + spacing.lg },
          pressed && styles.fabPressed,
        ]}
      >
        <View style={styles.fabIcon}>
          <Text style={styles.fabPlus}>+</Text>
        </View>
        <Text style={styles.fabText}>Thêm việc</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },

  // Thẻ header
  headerCard: {
    backgroundColor: colors.text,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadow,
    elevation: 6,
    shadowOpacity: 0.15,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...fonts.title,
    fontWeight: '700',
    color: colors.text,
  },
  topBarText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  dateText: {
    ...fonts.caption,
    color: '#AEB8B5',
  },
  screenTitle: {
    ...fonts.h1,
    fontSize: 24,
    color: colors.white,
  },

  // Tổng số + thống kê
  statsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: spacing.xl,
  },
  totalBox: {
    width: 120,
    backgroundColor: colors.accent,
    borderRadius: radius.card,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalNumber: {
    fontSize: 48,
    lineHeight: 54,
    fontWeight: '800',
    color: colors.text,
  },
  totalLabel: {
    ...fonts.caption,
    fontWeight: '700',
    color: colors.text,
  },
  statList: {
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: spacing.lg,
    paddingVertical: spacing.xs,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  dotPending: {
    backgroundColor: colors.warning,
  },
  dotDone: {
    backgroundColor: colors.success,
  },
  dotOverdue: {
    backgroundColor: colors.danger,
  },
  statNumber: {
    ...fonts.title,
    fontWeight: '700',
    color: colors.white,
    marginRight: 6,
  },
  statLabel: {
    ...fonts.caption,
    color: '#AEB8B5',
  },

  // Tiến độ
  progressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
  },
  progressTitle: {
    ...fonts.body,
    fontWeight: '600',
    color: colors.white,
    flex: 1,
  },
  percent: {
    ...fonts.h2,
    color: colors.accent,
    marginLeft: spacing.sm,
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
  progressHint: {
    ...fonts.caption,
    color: '#AEB8B5',
    marginTop: spacing.md,
  },

  // Tìm kiếm + sắp xếp
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    marginRight: spacing.md,
    ...shadow,
  },
  searchIcon: {
    width: 16,
    height: 16,
    marginRight: spacing.sm,
  },
  searchCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.textMuted,
  },
  searchHandle: {
    position: 'absolute',
    right: 1,
    bottom: 0,
    width: 2,
    height: 6,
    borderRadius: 1,
    backgroundColor: colors.textMuted,
    transform: [{ rotate: '-45deg' }],
  },
  searchInput: {
    flex: 1,
    ...fonts.body,
    color: colors.text,
    paddingVertical: 0,
  },
  clearText: {
    fontSize: 14,
    color: colors.textMuted,
    paddingLeft: spacing.sm,
  },
  sortButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortButtonPressed: {
    backgroundColor: colors.primary,
  },
  sortIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.accent,
  },

  // Bộ lọc
  filterRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xs,
    marginBottom: spacing.md,
    ...shadow,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.xl,
    alignItems: 'center',
  },
  filterActive: {
    backgroundColor: colors.text,
  },
  filterPressed: {
    backgroundColor: colors.background,
  },
  filterText: {
    ...fonts.caption,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  filterTextActive: {
    color: colors.white,
    fontWeight: '700',
  },

  // Sắp xếp + xoá việc đã xong
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sortLabel: {
    ...fonts.caption,
    color: colors.textMuted,
    flex: 1,
    marginRight: spacing.sm,
  },
  sortValue: {
    fontWeight: '700',
    color: colors.text,
  },
  clearDoneButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.md,
    backgroundColor: colors.dangerSoft,
  },
  clearDonePressed: {
    backgroundColor: '#F9D3D0',
  },
  clearDoneDisabled: {
    backgroundColor: colors.disabled,
  },
  clearDoneText: {
    ...fonts.caption,
    fontWeight: '700',
    color: colors.danger,
  },
  clearDoneTextDisabled: {
    color: colors.disabledText,
  },

  // Danh sách rỗng
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingVertical: 32,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
    marginTop: spacing.sm,
    ...shadow,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyIconText: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.primary,
  },
  emptyTitle: {
    ...fonts.title,
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...fonts.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Nút thêm việc
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.text,
    borderRadius: radius.pill,
    paddingLeft: spacing.md,
    paddingRight: spacing.xxl,
    height: 56,
    ...shadow,
    elevation: 8,
    shadowOpacity: 0.2,
  },
  fabPressed: {
    transform: [{ scale: 0.96 }],
    backgroundColor: '#2E3936',
  },
  fabIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  fabPlus: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginTop: -2,
  },
  fabText: {
    ...fonts.title,
    fontWeight: '700',
    color: colors.white,
  },
});
