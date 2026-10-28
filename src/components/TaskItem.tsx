import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Task } from '../types';
import { colors, fonts, radius, shadow, spacing } from '../theme/colors';
import { isOverdue } from '../utils/task';
import Checkbox from './Checkbox';
import { OverdueBadge, PriorityBadge } from './Badges';

interface Props {
  task: Task;
  onPress: () => void;
  onLongPress: () => void;
  onToggle: () => void;
}

// Một dòng trong danh sách, trình bày dạng thẻ (card)
export default function TaskItem({ task, onPress, onLongPress, onToggle }: Props) {
  const overdue = isOverdue(task);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={400}
      style={({ pressed }) => [styles.card, task.done && styles.cardDone, pressed && styles.pressed]}
    >
      <Checkbox checked={task.done} onPress={onToggle} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          {/* key đổi theo done để Android vẽ lại gạch ngang ngay khi tick */}
          <Text
            key={task.done ? 'done' : 'todo'}
            style={[styles.title, task.done && styles.titleDone]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          <View style={task.done && styles.faded}>
            <PriorityBadge priority={task.priority} />
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.meta}>{task.category}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={[styles.meta, overdue && styles.metaDanger]}>Hạn {task.dueDate}</Text>
          {overdue && (
            <View style={styles.overdueBadge}>
              <OverdueBadge />
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: 10,
    ...shadow,
  },
  cardDone: {
    backgroundColor: '#F6F8F7',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.85,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    ...fonts.title,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
    opacity: 0.6,
  },
  faded: {
    opacity: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  meta: {
    ...fonts.caption,
    color: colors.textMuted,
  },
  metaDanger: {
    color: colors.danger,
    fontWeight: '600',
  },
  dot: {
    ...fonts.caption,
    color: colors.textMuted,
    marginHorizontal: 6,
  },
  overdueBadge: {
    marginLeft: spacing.sm,
  },
});
