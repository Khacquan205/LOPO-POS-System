import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';

type GridButtonVariant = 'pill' | 'card';

interface GridButtonProps {
  title: string;
  icon?: React.ReactNode;
  iconName?: React.ComponentProps<typeof Ionicons>['name'];
  iconColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: GridButtonVariant;
}

export const GridButton: React.FC<GridButtonProps> = ({
  title,
  icon,
  iconName,
  iconColor = colors.primary,
  onPress,
  style,
  variant = 'pill',
}) => {
  const isPill = variant === 'pill';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isPill ? styles.pillContainer : styles.cardContainer,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconWrapper}>
        {icon ?? (iconName && <Ionicons name={iconName} size={24} color={iconColor} />)}
      </View>
      <Text style={[styles.title, isPill && styles.pillTitle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillContainer: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 80,
  },
  cardContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.md,
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrapper: {
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  pillTitle: {
    fontWeight: '500',
  },
});
