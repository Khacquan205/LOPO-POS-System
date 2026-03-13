import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../../ui/theme';
import { formatCurrencyVND, type OrderItemDisplay } from '../types/order.types';

interface OrderProductRowProps {
  item: OrderItemDisplay;
}

export const OrderProductRow: React.FC<OrderProductRowProps> = ({ item }) => {
  return (
    <View style={styles.container}>
      <View style={styles.qtyBox}>
        <Text style={styles.qty}>{item.quantity}</Text>
      </View>
      <View style={styles.nameCol}>
        <Text style={styles.name} numberOfLines={2}>{item.productName}</Text>
        {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
      </View>
      <Text style={styles.price}>{formatCurrencyVND(item.unitPrice * item.quantity)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
  },
  qtyBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  qty: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  nameCol: {
    flex: 1,
    marginRight: spacing.sm,
  },
  name: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  note: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
