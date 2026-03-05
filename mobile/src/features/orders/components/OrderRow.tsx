import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../ui/theme';
import {
  Order,
  STATUS_LABELS,
  formatCurrencyVND,
  formatDateTime,
} from '../mock/orders.mock';

interface OrderRowProps {
  order: Order;
  onPress?: () => void;
}

export const OrderRow: React.FC<OrderRowProps> = ({ order, onPress }) => {
  const statusLabel = STATUS_LABELS[order.status];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.7}
    >
      {/* Left side */}
      <View style={styles.leftSection}>
        <Text style={styles.statusLabel}>{statusLabel}</Text>
        <Text style={styles.orderCode}>{order.code}</Text>
      </View>

      {/* Right side */}
      <View style={styles.rightSection}>
        <Text style={styles.dateTime}>{formatDateTime(order.createdAt)}</Text>
        <Text style={styles.total}>{formatCurrencyVND(order.total)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  statusLabel: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  orderCode: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  dateTime: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  total: {
    ...typography.body,
    color: colors.linkOrange,
    fontWeight: '700',
  },
});
