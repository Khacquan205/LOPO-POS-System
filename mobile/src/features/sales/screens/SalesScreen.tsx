import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../ui/components';
import { colors, spacing } from '../../../ui/theme';
import {
  SalesActionButton,
  SelectedProductRow,
  TotalFooter,
} from '../components';
import type { SalesOrderItem } from '../components';
import { CustomerBar } from '../../orders/components';
import { CustomerPickerBottomSheet } from '../../customers/components';
import type { Customer } from '../../customers/mock/customers.mock';
import { generateNewOrderCode, generateNewOrderId } from '../mock/sales.mock';
import type { MainStackScreenProps } from '../../../types/navigation';
import type { PickedItem } from '../../products/mock/products.mock';

type Props = MainStackScreenProps<'Sales'>;

export const SalesScreen: React.FC<Props> = ({ navigation, route }) => {
  const orderCode = useRef(generateNewOrderCode()).current;
  const orderId = useRef(generateNewOrderId()).current;
  const itemCounter = useRef(0);

  const [items, setItems] = React.useState<SalesOrderItem[]>([]);
  const [customer, setCustomer] = React.useState<Customer | undefined>(undefined);
  const [showPicker, setShowPicker] = React.useState(false);

  const total = items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);

  // ── Receive items back from ProductPicker ───────────────────
  useEffect(() => {
    const picked = route.params?.pickedItems;
    if (!picked) return;
    mergePickedItems(picked);
    navigation.setParams({ pickedItems: undefined });
  }, [route.params?.pickedItems]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Receive updated qty back from QuantityEditor ─────────────
  useEffect(() => {
    const upd = route.params?.updatedItem;
    if (!upd) return;
    setItems((prev) =>
      prev
        .map((it) =>
          it.itemId === upd.itemId ? { ...it, quantity: upd.qty } : it,
        )
        .filter((it) => it.quantity > 0),
    );
    navigation.setParams({ updatedItem: undefined });
  }, [route.params?.updatedItem]); // eslint-disable-line react-hooks/exhaustive-deps

  const mergePickedItems = useCallback((picked: PickedItem[]) => {
    setItems((prev) => {
      const next = [...prev];
      picked.forEach((pi) => {
        const existing = next.find((it) => it.productId === pi.productId);
        if (existing) {
          existing.quantity += pi.quantity;
        } else {
          itemCounter.current += 1;
          next.push({
            itemId: `si_${itemCounter.current}_${pi.productId}`,
            ...pi,
          });
        }
      });
      return next;
    });
  }, []);

  const openProductPicker = useCallback(() => {
    navigation.navigate('ProductPicker', { orderId, returnScreen: 'Sales' });
  }, [navigation, orderId]);

  const openQuantityEditor = useCallback(
    (item: SalesOrderItem) => {
      navigation.navigate('QuantityEditor', {
        orderId,
        itemId: item.itemId,
        productName: item.productName,
        unitPrice: item.unitPrice,
        currentQty: item.quantity,
        returnScreen: 'Sales',
      });
    },
    [navigation, orderId],
  );

  const handleItemAdd = useCallback((itemId: string) => {
    setItems((prev) =>
      prev.map((it) => it.itemId === itemId ? { ...it, quantity: it.quantity + 1 } : it),
    );
  }, []);

  const handleItemRemove = useCallback((itemId: string) => {
    setItems((prev) =>
      prev
        .map((it) => it.itemId === itemId ? { ...it, quantity: it.quantity - 1 } : it)
        .filter((it) => it.quantity > 0),
    );
  }, []);

  const handlePayment = useCallback(() => {
    navigation.navigate('OrderSummary', {
      liveOrder: {
        code: orderCode,
        items: items.map((it) => ({
          id: it.itemId,
          productName: it.productName,
          unitPrice: it.unitPrice,
          quantity: it.quantity,
        })),
        customer: customer
          ? { name: customer.name, phone: customer.phone }
          : undefined,
        total,
      },
    });
  }, [navigation, orderCode, items, customer, total]);

  const renderItem = ({ item }: { item: SalesOrderItem }) => (
    <SelectedProductRow
      item={item}
      onQtyPress={() => openQuantityEditor(item)}
      onAdd={() => handleItemAdd(item.itemId)}
      onRemove={() => handleItemRemove(item.itemId)}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <ScreenHeader
        title={orderCode}
        showBack
        rightIcon="add-outline"
        onRightPress={openProductPicker}
      />

      {/* Action buttons */}
      <View style={styles.actions}>
        <SalesActionButton
          title="Thêm sản phẩm"
          iconName="add-circle-outline"
          onPress={openProductPicker}
        />
        <View style={styles.actionSpacer} />
        <SalesActionButton
          title="Quét sản phẩm"
          iconName="scan-outline"
          onPress={openProductPicker}
        />
      </View>

      {/* Product list or empty state */}
      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>(Chưa có sản phẩm nào)</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => it.itemId}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Customer bar */}
      <CustomerBar customer={customer} isEditable onPress={() => setShowPicker(true)} />

      {/* Total footer / CTA */}
      <TotalFooter
        total={total}
        onPress={handlePayment}
        disabled={items.length === 0}
        label="Thanh toán"
      />

      {/* Customer picker bottom sheet */}
      <CustomerPickerBottomSheet
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(c) => { setCustomer(c); setShowPicker(false); }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionSpacer: {
    width: spacing.sm,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.md,
  },
});
