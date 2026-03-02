import { TextStyle } from 'react-native';

// Font family: Jura (primary font for LOPO)
export const fontFamily = {
  regular: 'Jura_400Regular',
  medium: 'Jura_500Medium',
  semiBold: 'Jura_600SemiBold',
  bold: 'Jura_700Bold',
} as const;

export const typography: Record<string, TextStyle> = {
  screenTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  h1: {
    fontSize: 32,
    fontWeight: '700',
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500',
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    fontSize: 14,
    fontWeight: '500',
  },
};
