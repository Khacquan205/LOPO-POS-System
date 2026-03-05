import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../theme';

type BadgeVariant = 'default' | 'primary' | 'success' | 'error' | 'warning' | 'orange';
type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  label?: string;
  count?: number | string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: colors.border, text: colors.textPrimary },
  primary: { bg: colors.primary, text: colors.white },
  success: { bg: colors.success, text: colors.white },
  error: { bg: colors.error, text: colors.white },
  warning: { bg: colors.warning, text: colors.white },
  orange: { bg: colors.linkOrange, text: colors.white },
};

const sizeStyles: Record<BadgeSize, { paddingH: number; paddingV: number; fontSize: number }> = {
  small: { paddingH: spacing.xs + 2, paddingV: 2, fontSize: 10 },
  medium: { paddingH: spacing.sm, paddingV: spacing.xs, fontSize: 12 },
  large: { paddingH: spacing.md, paddingV: spacing.sm, fontSize: 14 },
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  count,
  variant = 'default',
  size = 'medium',
  style,
}) => {
  const { bg, text } = variantStyles[variant] ?? variantStyles.default;
  const sizeStyle = sizeStyles[size] ?? sizeStyles.medium;
  const displayText = count !== undefined ? String(count) : label;

  const isNotificationBadge = count !== undefined && size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          paddingHorizontal: sizeStyle.paddingH,
          paddingVertical: sizeStyle.paddingV,
          minWidth: isNotificationBadge ? 18 : undefined,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: text, fontSize: sizeStyle.fontSize }]}>
        {displayText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
