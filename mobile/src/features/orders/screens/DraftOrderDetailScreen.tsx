import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader, Button } from '../../../ui/components';
import { colors, spacing } from '../../../ui/theme';
import { OrderStatusChip, OrderProductRow, CustomerBar } from '../components';
import { CustomerPickerBottomSheet } from '../../customers/components';
import { getOrderById, formatCurrencyVND, type OrderItem } from '../mock/orders.mock';
import type { MainStackScreenProps, PickedItem } from '../../../types/navigation';

type Props = MainStackScreenProps<'DraftOrderDetail'>;

export const DraftOrderDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { orderId } = route.params;
  const insets = useSafeAreaInsets();
  const order = getOrderById(orderId);
  const itemCounter = useRef(0);

  const [localItems, setLocalItems] = useState<OrderItem[]>(order?.items ?? []);
  const [localCustomer, setLocalCustomer] = useState<{ name: string; phone?: string } | undefined>(order?.customer);
  const [showPicker, setShowPicker] = useState(false);

  const total = localItems.reduce((s, it) => s + it.unitPrice * it.quantity, 0);

  // ── Receive items back from ProductPicker ────────────────────
  useEffect(() => {
    const picked = route.params?.pickedItems;
    if (!picked) return;
    setLocalItems((prev) => mergeItems(prev, picked));
    navigation.setParams({ pickedItems: undefined });
  }, [route.params?.pickedItems]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Receive updated qty back from QuantityEditor ─────────────
  useEffect(() => {
    const upd = route.params?.updatedItem;
    if (!upd) return;
    setLocalItems((prev) =>
      prev
        .map((it) => (it.id === upd.itemId ? { ...it, quantity: upd.qty } : it))
        .filter((it) => it.quantity > 0),
    );
    navigation.setParams({ updatedItem: undefined });
  }, [route.params?.updatedItem]); // eslint-disable-line react-hooks/exhaustive-deps

  const mergeItems = (prev: OrderItem[], picked: PickedItem[]): OrderItem[] => {
    const next = [...prev];
    picked.forEach((pi) => {
      const existing = next.find((it) => it.productId === pi.productId);
      if (existing) {
        existing.quantity += pi.quantity;
      } else {
        itemCounter.current += 1;
        next.push({
          id: `draft_${orderId}_${itemCounter.current}`,
          productId: pi.productId,
          productName: pi.productName,
          unitPrice: pi.unitPrice,
          quantity: pi.quantity,
        });
      }
    });
    return next;
  };

  const handleAddProduct = useCallback(() => {
    navigation.navigate('ProductPicker', { orderId, returnScreen: 'DraftOrderDetail' });
  }, [navigation, orderId]);

  const handlePayment = useCallback(() => {
    navigation.navigate('OrderSummary', { orderId, fromDraft: true });
  }, [navigation, orderId]);

  if (!order) {
    return (
      <View style={styles.notFound}>
        <ScreenHeader title="Đơn hàng" showBack />
        <Text style={styles.notFoundText}>Không tìm thấy đơn hàng</Text>
      </View>
    );
  }

  const totalItems = localItems.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <View style={styles.container}>
      <ScreenHeader title={order.code} showBack />

      {/* Status + action row */}
      <View style={styles.statusRow}>
        <OrderStatusChip status={order.status} />
        <TouchableOpacity style={styles.addBtn} onPress={handleAddProduct} activeOpacity={0.7}>
          <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
          <Text style={styles.addBtnText}>Thêm sản phẩm</Text>
        </TouchableOpacity>
      </View>

      {/* Product list */}
      <FlatList
        data={localItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderProductRow item={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>Sản phẩm ({totalItems} món)</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>(Chưa có sản phẩm nào)</Text>
          </View>
        }
      />

      {/* Customer bar */}
      <CustomerBar customer={localCustomer} isEditable onPress={() => setShowPicker(true)} />

      {/* Payment footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalValue}>{formatCurrencyVND(total)}</Text>
        </View>
        <Button title="Thanh toán" onPress={handlePayment} disabled={localItems.length === 0} />
      </View>

      {/* Customer picker bottom sheet */}
      <CustomerPickerBottomSheet
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(c) => { setLocalCustomer({ name: c.name, phone: c.phone }); setShowPicker(false); }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  notFound: {
    flex: 1,
    backgroundColor: colors.background,
  },
  notFoundText: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.textSecondary,
    fontSize: 15,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addBtnText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: spacing.sm,
  },
  listHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  listHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.md,
  },
  empty: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  footer: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.linkOrange,
  },
});
