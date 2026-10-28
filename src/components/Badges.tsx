import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Priority } from '../types';
import { colors, fonts, radius } from '../theme/colors';

// Màu cho từng mức ưu tiên: đỏ (Cao), vàng (Trung bình), xanh (Thấp)
export const PRIORITY_COLORS: Record<Priority, { background: string; text: string; dot: string }> = {
  Cao: { background: colors.dangerSoft, text: colors.danger, dot: colors.danger },
  'Trung bình': { background: colors.warningSoft, text: colors.warningText, dot: colors.warning },
  Thấp: { background: colors.successSoft, text: colors.successText, dot: colors.success },
};

export function PriorityBadge({ priority, prefix = '' }: { priority: Priority; prefix?: string }) {
  const color = PRIORITY_COLORS[priority];
  return (
    <View style={[styles.badge, { backgroundColor: color.background }]}>
      <Text style={[styles.text, { color: color.text }]}>
        {prefix}
        {priority}
      </Text>
    </View>
  );
}

export function OverdueBadge() {
  return (
    <View style={[styles.badge, styles.overdue]}>
      <Text style={[styles.text, styles.overdueText]}>Quá hạn</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    ...fonts.caption,
    fontWeight: '700',
  },
  overdue: {
    backgroundColor: colors.danger,
  },
  overdueText: {
    color: colors.white,
  },
});
