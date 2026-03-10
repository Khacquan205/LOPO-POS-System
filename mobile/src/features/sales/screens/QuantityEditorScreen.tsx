import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../../ui/components';
import { colors, spacing } from '../../../ui/theme';
import { QuantityKeypad } from '../components';
import { formatPrice } from '../../products/mock/products.mock';
import type { MainStackScreenProps } from '../../../types/navigation';

type Props = MainStackScreenProps<'QuantityEditor'>;

export const QuantityEditorScreen: React.FC<Props> = ({ navigation, route }) => {
  const { orderId, itemId, productName, unitPrice, currentQty, returnScreen } = route.params;
  const insets = useSafeAreaInsets();
  const [qtyStr, setQtyStr] = useState(String(currentQty));

  const qty = Math.max(0, parseInt(qtyStr, 10) || 0);
  const lineTotal = qty * unitPrice;

  const handleDone = useCallback(() => {
    if (returnScreen === 'Sales') {
      navigation.navigate('Sales', { updatedItem: { itemId, qty } });
    } else {
      navigation.navigate('DraftOrderDetail', { orderId, updatedItem: { itemId, qty } });
    }
  }, [qty, itemId, orderId, returnScreen, navigation]);

  return (
    <View style={styles.container}>
      <ScreenHeader title={`Đơn ${orderId}`} showBack />

      {/* Product info strip */}
      <View style={styles.productStrip}>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>{productName}</Text>
          <Text style={styles.unitPrice}>{formatPrice(unitPrice)} / cái</Text>
        </View>
        <Text style={styles.lineTotal}>{formatPrice(lineTotal)}</Text>
      </View>

      {/* Current qty display */}
      <View style={styles.displayRow}>
        <Text style={styles.displayLabel}>Số lượng</Text>
        <Text style={styles.displayValue}>{qtyStr}</Text>
      </View>

      {/* Keypad */}
      <QuantityKeypad value={qtyStr} onChange={setQtyStr} />

      {/* Done button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={handleDone}
          activeOpacity={0.8}
        >
          <Text style={styles.doneText}>Xong</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  productStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  productInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  unitPrice: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  lineTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.linkOrange,
  },
  displayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  displayLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  displayValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    minWidth: 80,
    textAlign: 'right',
  },
  footer: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  doneButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  doneText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
