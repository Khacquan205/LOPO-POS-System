import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../ui/theme';
import { Order, formatCurrencyVND, formatDateTime } from '../mock/orders.mock';
import { OrderStatusChip } from './OrderStatusChip';

interface OrderRowProps {
  order: Order;
  onPress?: () => void;
}

export const OrderRow: React.FC<OrderRowProps> = ({ order, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.7}
    >
      {/* Left side */}
      <View style={styles.leftSection}>
        <OrderStatusChip status={order.status} />
        <Text style={styles.orderCode}>{order.code}</Text>
        {order.customer && (
          <Text style={styles.customerName} numberOfLines={1}>
            {order.customer.name}
          </Text>
        )}
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
    gap: 4,
  },
  rightSection: {
    alignItems: 'flex-end',
    marginLeft: spacing.sm,
  },
  orderCode: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  customerName: {
    ...typography.caption,
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
