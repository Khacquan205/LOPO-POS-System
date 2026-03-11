import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../../../ui/theme';
import { formatPrice } from '../../products/mock/products.mock';

interface TotalFooterProps {
  total: number;
  onPress: () => void;
  disabled?: boolean;
  label?: string;
}

export const TotalFooter: React.FC<TotalFooterProps> = ({
  total,
  onPress,
  disabled = false,
  label = 'Thanh toán',
}) => {
  const insets = useSafeAreaInsets();
  const btnLabel = total > 0 ? `${label}  ${formatPrice(total)}` : label;

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + spacing.sm }]}>
      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={disabled ? undefined : onPress}
        activeOpacity={disabled ? 1 : 0.8}
      >
        <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
          {btnLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.textDisabled,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  buttonTextDisabled: {
    color: '#FFFFFF',
  },
});
