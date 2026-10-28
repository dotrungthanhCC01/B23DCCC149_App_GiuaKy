import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, shadow, spacing } from '../theme/colors';

interface Props {
  title: string;
  subtitle?: string;
  onBack: () => void;
  rightButton?: React.ReactNode;
}

// Thanh tiêu đề tự làm: nút quay lại - tiêu đề - nút bên phải (nếu có)
export default function ScreenHeader({ title, subtitle, onBack, rightButton }: Props) {
  return (
    <View style={styles.header}>
      <Pressable
        onPress={onBack}
        hitSlop={8}
        style={({ pressed }) => [styles.circleButton, pressed && styles.pressed]}
      >
        <Text style={styles.backIcon}>‹</Text>
      </Pressable>

      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {/* Giữ chỗ để tiêu đề luôn nằm giữa */}
      {rightButton ?? <View style={styles.placeholder} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
  },
  pressed: {
    backgroundColor: colors.border,
  },
  backIcon: {
    fontSize: 28,
    lineHeight: 30,
    color: colors.text,
    marginTop: -3,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  title: {
    ...fonts.title,
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    ...fonts.caption,
    color: colors.textMuted,
  },
  placeholder: {
    width: 40,
  },
});
