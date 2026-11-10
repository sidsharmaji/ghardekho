// GharDekho Mobile Theme Tokens (React Native / Expo)
// Direction: Mix A + C (Warm Saffron Energy on Deep Dark Slate)
import { Platform } from 'react-native';

export const palette = {
  bg: '#0B0F17',
  surface: '#151D2A',
  surfaceRaised: '#1E293B',
  border: '#27354A',
  borderFocus: '#FF6B00',

  // Saffron Orange Brand Energy
  primary: '#FF6B00',
  primaryHover: '#E05D00',
  onPrimary: '#FFFFFF',

  // Trust & Utility Accents
  accentTrust: '#10B981',    // Emerald Green (Verified Owner, Available Bed)
  accentStudent: '#8B5CF6',  // Purple (Student friendly / Split deals)
  accentWarning: '#F59E0B',  // Amber (Jal timing alert)

  // Typography
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
};

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40
} as const;

export const radius = {
  sm: 6,
  md: 12,
  lg: 18,
  xl: 26,
  full: 9999
} as const;

export const fonts = {
  display: Platform.select({ ios: 'Poppins-Bold', android: 'Poppins-Bold', default: 'sans-serif' }),
  body: Platform.select({ ios: 'NotoSans-Regular', android: 'NotoSans-Regular', default: 'sans-serif' }),
  mono: Platform.select({ ios: 'JetBrainsMono-Bold', android: 'JetBrainsMono-Bold', default: 'monospace' }),
};

export const typeScale = {
  largeTitle: { fontSize: 32, lineHeight: 38, fontWeight: '700' as const },
  title1: { fontSize: 24, lineHeight: 30, fontWeight: '700' as const },
  title2: { fontSize: 20, lineHeight: 26, fontWeight: '600' as const },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: '600' as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '500' as const },
  badge: { fontSize: 11, lineHeight: 14, fontWeight: '700' as const },
};

export const touch = {
  minTarget: 48,
  minGap: 8
};

export const motion = {
  fast: 150,
  base: 250,
  spring: { damping: 18, stiffness: 180 }
};

export function useTheme() {
  return { colors: palette, spacing, radius, fonts, typeScale, touch, motion, isDark: true };
}

