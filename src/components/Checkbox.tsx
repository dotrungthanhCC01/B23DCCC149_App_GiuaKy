import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius } from '../theme/colors';

interface Props {
  checked: boolean;
  onPress: () => void;
}

// Ô đánh dấu tự làm bằng Pressable
export default function Checkbox({ checked, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => [styles.box, checked && styles.boxChecked, pressed && styles.pressed]}
    >
      {checked && <Text style={styles.tick}>✓</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 26,
    height: 26,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: '#B9C2BF',
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pressed: {
    transform: [{ scale: 0.9 }],
  },
  tick: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
