import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius } from '../theme/colors';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'dark' | 'outline';
  icon?: string;
  disabled?: boolean;
}

// Nút dùng chung: có hiệu ứng khi nhấn và trạng thái vô hiệu hoá
export default function AppButton({ title, onPress, variant = 'primary', icon, disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && styles[`${variant}Pressed`],
        disabled && styles.disabled,
      ]}
    >
      {icon ? (
        <View style={[styles.iconCircle, variant === 'outline' && styles.iconCircleOutline]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
      ) : null}
      <Text
        style={[
          styles.text,
          variant === 'outline' && styles.textOutline,
          disabled && styles.textDisabled,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: radius.xl,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  primaryPressed: {
    backgroundColor: colors.primaryPressed,
  },
  dark: {
    backgroundColor: colors.text,
  },
  darkPressed: {
    backgroundColor: '#2E3936',
  },
  outline: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  outlinePressed: {
    backgroundColor: colors.background,
  },
  disabled: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
  },
  text: {
    ...fonts.title,
    fontWeight: '700',
    color: colors.white,
  },
  textOutline: {
    color: colors.text,
  },
  textDisabled: {
    color: colors.disabledText,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  iconCircleOutline: {
    width: 'auto',
    backgroundColor: 'transparent',
    marginRight: 6,
  },
  icon: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
});
