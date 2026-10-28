// Bảng màu, cỡ chữ, khoảng cách dùng chung cho toàn bộ ứng dụng

export const colors = {
  background: '#EEF1EF',
  surface: '#FFFFFF',
  text: '#17201E',
  textMuted: '#5F6B68',
  border: '#E1E6E4',
  primary: '#4F7C76',
  primaryPressed: '#3D635E',
  accent: '#D6F45B',
  danger: '#D92D20',
  warning: '#F5B700',
  success: '#22A04B',
  disabled: '#E4E8E6',
  disabledText: '#9AA4A1',
  white: '#FFFFFF',

  // Nền nhạt cho các nhãn
  dangerSoft: '#FDECEC',
  warningSoft: '#FEF4CC',
  successSoft: '#E1F5E7',
  primarySoft: '#E6EEEC',
  warningText: '#9A6700',
  successText: '#15803D',
};

// Font và cỡ chữ: h1 27/700, h2 20/700, title 15/600, body 14/400, caption 12/400
export const fonts = {
  h1: { fontSize: 27, fontWeight: '700' as const },
  h2: { fontSize: 20, fontWeight: '700' as const },
  title: { fontSize: 15, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const radius = {
  sm: 9,
  md: 16,
  card: 20,
  xl: 26,
  pill: 999,
};

export const shadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.07,
  shadowRadius: 8,
  elevation: 3,
};
