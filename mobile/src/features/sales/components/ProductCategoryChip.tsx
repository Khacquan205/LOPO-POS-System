import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../../ui/theme';

interface ProductCategoryChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export const ProductCategoryChip: React.FC<ProductCategoryChipProps> = ({
  label,
  isSelected,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.chip, isSelected && styles.chipSelected]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[styles.label, isSelected && styles.labelSelected]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    marginRight: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  labelSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
