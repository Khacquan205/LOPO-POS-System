import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../../ui/theme';

interface SummaryInfoRowProps {
  label: string;
  value: string;
  valueColor?: string;
  bold?: boolean;
  topBorderThick?: boolean;
}

export const SummaryInfoRow: React.FC<SummaryInfoRowProps> = ({
  label,
  value,
  valueColor,
  bold,
  topBorderThick,
}) => {
  return (
    <View style={[styles.row, topBorderThick && styles.thickBorder]}>
      <Text style={[styles.label, bold && styles.labelBold]}>{label}</Text>
      <Text
        style={[
          styles.value,
          bold && styles.valueBold,
          valueColor ? { color: valueColor } : null,
        ]}
      >
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  thickBorder: {
    borderTopWidth: 2,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  labelBold: {
    fontWeight: '700',
    color: colors.textPrimary,
    fontSize: 15,
  },
  value: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  valueBold: {
    fontWeight: '700',
    fontSize: 16,
  },
});
