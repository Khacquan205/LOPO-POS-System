import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing } from '../../../ui/theme';
import type { PickedItem } from '../../products/mock/products.mock';
import { formatPrice } from '../../products/mock/products.mock';

export interface SalesOrderItem extends PickedItem {
  itemId: string; // unique id within the order
}

interface SelectedProductRowProps {
  item: SalesOrderItem;
  onQtyPress: () => void;
  onAdd: () => void;
  onRemove: () => void;
}

export const SelectedProductRow: React.FC<SelectedProductRowProps> = ({ item, onQtyPress, onAdd, onRemove }) => {
  return (
    <View style={styles.container}>
      {/* Stepper: − qty + */}
      <View style={styles.stepper}>
        <TouchableOpacity style={styles.stepBtn} onPress={onRemove} activeOpacity={0.7}>
          <Text style={styles.stepIcon}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.qtyBox} onPress={onQtyPress} activeOpacity={0.7}>
          <Text style={styles.qty}>{item.quantity}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stepBtn} onPress={onAdd} activeOpacity={0.7}>
          <Text style={styles.stepIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Name */}
      <Text style={styles.name} numberOfLines={2}>{item.productName}</Text>

      {/* Total */}
      <Text style={styles.total}>
        {formatPrice(item.unitPrice * item.quantity)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepIcon: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.primary,
  },
  qtyBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  qty: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  total: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.linkOrange,
  },
});
