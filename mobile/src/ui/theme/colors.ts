export const colors = {
  // Primary
  primary: '#4280EF',
  primaryDark: '#3366CC',
  primaryLight: '#6BA3F5',

  // Secondary / Accent
  linkOrange: '#EFA442',
  secondary: '#EFA442',

  // Backgrounds
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceSecondary: '#F5F5F5',

  // Text
  textPrimary: '#111111',
  text: '#111111',
  textSecondary: '#6B7280',
  textDisabled: '#9CA3AF',

  // Borders
  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  // Status
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Base
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof colors;
