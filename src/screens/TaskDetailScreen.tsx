import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useTasks } from '../context/TaskContext';
import ScreenHeader from '../components/ScreenHeader';
import AppButton from '../components/AppButton';
import { OverdueBadge, PRIORITY_COLORS, PriorityBadge } from '../components/Badges';
import { colors, fonts, radius, shadow, spacing } from '../theme/colors';
import { getDaysLeft, getWeekday, parseDate } from '../utils/date';
import { getCountdownText, isOverdue } from '../utils/task';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

export default function TaskDetailScreen({ navigation, route }: Props) {
  const { tasks, toggleTask, deleteTask } = useTasks();
  const insets = useSafeAreaInsets();

  const task = tasks.find(item => item.id === route.params.taskId);

  // Công việc đã bị xoá thì không hiển thị gì
  if (!task) {
    return <View style={styles.container} />;
  }

  const overdue = isOverdue(task);
  const daysLeft = getDaysLeft(task.dueDate);
  const dueDate = parseDate(task.dueDate);
  const weekday = dueDate ? getWeekday(dueDate) : '';

  function confirmDelete() {
    if (!task) {
      return;
    }
    Alert.alert(
      'Xoá công việc?',
      `Bạn có chắc muốn xoá "${task.title}"? Thao tác này không thể hoàn tác.`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: () => {
            navigation.goBack();
            deleteTask(task.id);
          },
        },
      ],
    );
  }

  const deleteButton = (
    <Pressable
      onPress={confirmDelete}
      hitSlop={8}
      style={({ pressed }) => [styles.deleteButton, pressed && styles.deletePressed]}
    >
      <Text style={styles.deleteText}>Xoá</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScreenHeader
        title="Chi tiết công việc"
        onBack={() => navigation.goBack()}
        rightButton={deleteButton}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Thẻ chính */}
        <View style={styles.heroCard}>
          <View style={styles.badgeRow}>
            <View style={styles.categoryChip}>
              <Text style={styles.categoryChipText}>{task.category}</Text>
            </View>
            <View style={styles.badgeGap}>
              <PriorityBadge priority={task.priority} prefix="Ưu tiên " />
            </View>
            {overdue && <OverdueBadge />}
          </View>

          <Text
            key={task.done ? 'done' : 'todo'}
            style={[styles.heroTitle, task.done && styles.heroTitleDone]}
          >
            {task.title}
          </Text>

          {/* Số ngày còn lại */}
          <View
            style={[
              styles.countdown,
              overdue && styles.countdownDanger,
              task.done && styles.countdownDone,
            ]}
          >
            <View style={styles.flex}>
              <Text style={[styles.countdownText, overdue && styles.dangerText]}>
                {getCountdownText(task)}
              </Text>
              <Text style={styles.countdownSub}>
                Hạn {weekday}, {task.dueDate}
              </Text>
            </View>
            <View style={[styles.countdownIcon, overdue && styles.countdownIconDanger]}>
              <Text style={[styles.countdownIconText, overdue && styles.whiteText]}>
                {task.done ? '✓' : overdue ? '!' : daysLeft === 0 ? '⏰' : '⌛'}
              </Text>
            </View>
          </View>
        </View>

        {/* Lưới thông tin */}
        <View style={styles.grid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Hạn hoàn thành</Text>
            <Text style={[styles.infoValue, overdue && styles.dangerText]}>{task.dueDate}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Trạng thái</Text>
            <Text style={[styles.infoValue, task.done && styles.successText]}>
              {task.done ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Danh mục</Text>
            <Text style={styles.infoValue}>{task.category}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Mức ưu tiên</Text>
            <View style={styles.priorityRow}>
              <View
                style={[styles.dot, { backgroundColor: PRIORITY_COLORS[task.priority].dot }]}
              />
              <Text style={styles.infoValue}>{task.priority}</Text>
            </View>
          </View>
        </View>

        {/* Ghi chú */}
        <View style={styles.noteCard}>
          <Text style={styles.infoLabel}>Ghi chú</Text>
          <Text style={styles.noteText}>{task.note !== '' ? task.note : 'Không có ghi chú.'}</Text>
        </View>
      </ScrollView>

      {/* Thanh nút dưới cùng */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={styles.editButton}>
          <AppButton
            title="Sửa"
            icon="✎"
            variant="outline"
            onPress={() => navigation.navigate('TaskForm', { taskId: task.id })}
          />
        </View>
        <View style={styles.toggleButton}>
          <AppButton
            title={task.done ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
            icon={task.done ? '↺' : '✓'}
            variant="dark"
            onPress={() => toggleTask(task.id)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
  },
  deletePressed: {
    backgroundColor: colors.dangerSoft,
  },
  deleteText: {
    ...fonts.caption,
    fontWeight: '700',
    color: colors.danger,
  },

  // Thẻ chính
  heroCard: {
    backgroundColor: colors.text,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginTop: spacing.sm,
    ...shadow,
    elevation: 6,
    shadowOpacity: 0.15,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  badgeGap: {
    marginRight: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginRight: spacing.sm,
  },
  categoryChipText: {
    ...fonts.caption,
    fontWeight: '700',
    color: colors.white,
  },
  heroTitle: {
    ...fonts.h1,
    color: colors.white,
    marginTop: spacing.md,
  },
  heroTitleDone: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  countdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  countdownDanger: {
    backgroundColor: colors.dangerSoft,
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  countdownDone: {
    backgroundColor: colors.successSoft,
  },
  countdownText: {
    ...fonts.h2,
    color: colors.text,
  },
  countdownSub: {
    ...fonts.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  countdownIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownIconDanger: {
    backgroundColor: colors.danger,
  },
  countdownIconText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.accent,
  },
  dangerText: {
    color: colors.danger,
  },
  successText: {
    color: colors.successText,
  },
  whiteText: {
    color: colors.white,
  },

  // Lưới thông tin
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  infoCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow,
  },
  infoLabel: {
    ...fonts.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  infoValue: {
    ...fonts.title,
    fontWeight: '700',
    color: colors.text,
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 6,
  },
  noteCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.lg,
    ...shadow,
  },
  noteText: {
    ...fonts.body,
    color: colors.text,
    lineHeight: 21,
  },

  // Thanh nút dưới
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  editButton: {
    flex: 1,
    marginRight: spacing.md,
  },
  toggleButton: {
    flex: 2.2,
  },
});
