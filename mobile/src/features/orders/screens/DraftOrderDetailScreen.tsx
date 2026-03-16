import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenHeader, Button } from '../../../ui/components';
import { colors, spacing } from '../../../ui/theme';
import { CommonAlertModal } from '../../../common/shared/components/CommonAlertModal';
import { useCommonAlert } from '../../../common/shared/hooks/useCommonAlert';
import { OrderStatusChip, OrderProductRow, CustomerBar } from '../components';
import { CustomerPickerBottomSheet } from '../../customers/components';
import { getOrderDetail, updateOrderItems, type ApiOrderItem } from '../../sales/services/orders.service';
import { formatCurrencyVND, type OrderItemDisplay, type OrderStatusApi } from '../types/order.types';
import { useAuthStore } from '../../../store/auth.store';
import { useProductsStore } from '../../products/store/products.store';
import { useCategoriesStore } from '../../products/store/categories.store';
import { useInventoryStore } from '../../products/store/inventory.store';
import type { MainStackScreenProps, PickedItem } from '../../../types/navigation';
import type { StockItem } from '../../../lib/stock';

type Props = MainStackScreenProps<'DraftOrderDetail'>;

interface DraftItem extends OrderItemDisplay {
  // productId is already in OrderItemDisplay; kept for clarity
}

function mapApiItem(item: ApiOrderItem): DraftItem {
  return {
    id: item.product_id,
    productId: item.product_id,
    productName: item.product_name_snapshot,
    unitPrice: item.unit_price,
    quantity: item.quantity,
  };
}

export const DraftOrderDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { orderId } = route.params;
  const insets = useSafeAreaInsets();
  const token = useAuthStore((s) => s.accessToken);
  const products = useProductsStore((s) => s.products);
  const fetchProducts = useProductsStore((s) => s.fetchProducts);
  const fetchCategories = useCategoriesStore((s) => s.fetchCategories);
  const stockByProductId = useInventoryStore((s) => s.stockByProductId);

  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderCode, setOrderCode] = useState('');
  const [orderStatus, setOrderStatus] = useState<OrderStatusApi>('draft');
  const [localItems, setLocalItems] = useState<DraftItem[]>([]);
  const [localCustomer, setLocalCustomer] = useState<{ name: string; phone?: string } | undefined>();
  const [showPicker, setShowPicker] = useState(false);
  const isMounted = useRef(true);
  const { alertProps, showAlert } = useCommonAlert();

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // ── Initial load from API ──────────────────────────────────
  useEffect(() => {
    if (!token) return;
    setIsLoading(true);
    getOrderDetail(token, orderId)
      .then(({ order, items }) => {
        if (!isMounted.current) return;
        setOrderCode(order.order_code);
        setOrderStatus(order.status);
        setLocalItems(items.map(mapApiItem));
      })
      .catch((err: unknown) => {
        if (!isMounted.current) return;
        setErrorMessage(err instanceof Error ? err.message : 'Không thể tải đơn hàng');
      })
      .finally(() => { if (isMounted.current) setIsLoading(false); });
  }, [token, orderId]);

  useFocusEffect(
    useCallback(() => {
      if (!token) return;
      (async () => {
        await fetchCategories(token);
        const cats = useCategoriesStore.getState().categories;
        await fetchProducts(token, cats);
      })();
    }, [token, fetchCategories, fetchProducts]),
  );

  // ── Sync items to backend ──────────────────────────────────
  const syncItems = useCallback(async (items: DraftItem[]) => {
    if (!token) return;
    setIsSyncing(true);
    setErrorMessage(null);
    try {
      const payload = items.map((it) => ({ product_id: it.productId, quantity: it.quantity }));
      await updateOrderItems(token, orderId, payload);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Không thể lưu thay đổi');
    } finally {
      if (isMounted.current) setIsSyncing(false);
    }
  }, [token, orderId]);

  // ── Receive items back from ProductPicker ──────────────────
  useEffect(() => {
    const picked = route.params?.pickedItems;
    if (!picked) return;
    setLocalItems((prev) => {
      const next = mergeItems(prev, picked);
      syncItems(next);
      return next;
    });
    navigation.setParams({ pickedItems: undefined });
  }, [route.params?.pickedItems]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Receive updated qty back from QuantityEditor ───────────
  useEffect(() => {
    const upd = route.params?.updatedItem;
    if (!upd) return;
    setLocalItems((prev) => {
      const next = prev
        .map((it) => (it.id === upd.itemId ? { ...it, quantity: upd.qty } : it))
        .filter((it) => it.quantity > 0);
      syncItems(next);
      return next;
    });
    navigation.setParams({ updatedItem: undefined });
  }, [route.params?.updatedItem]); // eslint-disable-line react-hooks/exhaustive-deps

  const mergeItems = (prev: DraftItem[], picked: PickedItem[]): DraftItem[] => {
    const next = [...prev];
    picked.forEach((pi) => {
      const existing = next.find((it) => it.productId === pi.productId);
      if (existing) {
        existing.quantity += pi.quantity;
      } else {
        next.push({
          id: pi.productId,
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

  const total = localItems.reduce((s, it) => s + it.unitPrice * it.quantity, 0);

  const stockItems: StockItem[] = useMemo(
    () => localItems.map((it) => ({ productId: it.productId, quantity: it.quantity })),
    [localItems],
  );

  const resolveStockInfo = useCallback((productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      return { onHand: product.onHand, trackInventory: product.trackInventory };
    }
    const fallback = stockByProductId[productId];
    if (typeof fallback === 'number') {
      return { onHand: fallback, trackInventory: true };
    }
    return { onHand: 0, trackInventory: false };
  }, [products, stockByProductId]);

  const warnings = useMemo(() => {
    const nextWarnings: Record<string, string> = {};
    stockItems.forEach((item) => {
      const { onHand, trackInventory } = resolveStockInfo(item.productId);
      if (!trackInventory || onHand <= 0) {
        nextWarnings[item.productId] = 'Sản phẩm tạm hết hàng';
        return;
      }
      if (item.quantity > onHand) {
        nextWarnings[item.productId] = `Chỉ còn ${onHand} sản phẩm trong kho`;
      }
    });
    return nextWarnings;
  }, [stockItems, resolveStockInfo]);

  const displayItems = useMemo(
    () => localItems.map((it) => ({ ...it, note: warnings[it.productId] })),
    [localItems, warnings],
  );

  const hasInvalidItems = Object.keys(warnings).length > 0;

  const handlePayment = useCallback(async () => {
    if (!token) return;
    await fetchCategories(token);
    const cats = useCategoriesStore.getState().categories;
    await fetchProducts(token, cats);

    const latest = useProductsStore.getState().products;
    const latestStocks = useInventoryStore.getState().stockByProductId;
    const invalid = stockItems.some((item) => {
      const product = latest.find((p) => p.id === item.productId);
      if (product) {
        if (!product.trackInventory || product.onHand <= 0) return true;
        return item.quantity > product.onHand;
      }
      const fallback = latestStocks[item.productId];
      if (typeof fallback !== 'number') return true;
      return item.quantity > fallback;
    });
    if (invalid || hasInvalidItems) {
      showAlert({
        variant: 'warning',
        title: 'Không thể thanh toán',
        message: 'Đơn hàng có sản phẩm vượt quá số lượng trong kho',
      });
      return;
    }
    navigation.navigate('OrderSummary', {
      orderId,
      fromDraft: true,
      liveOrder: {
        code: orderCode,
        status: orderStatus,
        items: localItems.map((it) => ({
          id: it.id,
          productName: it.productName,
          unitPrice: it.unitPrice,
          quantity: it.quantity,
        })),
        customer: localCustomer,
        total,
      },
    });
  }, [token, fetchCategories, fetchProducts, localItems, hasInvalidItems, navigation, orderId, orderCode, orderStatus, localCustomer, total, showAlert]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ScreenHeader title="Đơn hàng" showBack />
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      </View>
    );
  }

  const totalItems = localItems.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <View style={styles.container}>
      <ScreenHeader title={orderCode || 'Đơn hàng'} showBack />

      {/* Status + action row */}
      <View style={styles.statusRow}>
        <View style={styles.statusLeft}>
          <OrderStatusChip status={orderStatus} />
          {isSyncing && <ActivityIndicator size="small" color={colors.primary} style={{ marginLeft: 8 }} />}
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddProduct} activeOpacity={0.7}>
          <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
          <Text style={styles.addBtnText}>Thêm sản phẩm</Text>
        </TouchableOpacity>
      </View>

      {/* Product list */}
      <FlatList
        data={displayItems}
        keyExtractor={(item) => `${orderId}:${item.productId}`}
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

      {hasInvalidItems && (
        <Text style={styles.paymentWarning}>
          Vui lòng cập nhật số lượng các sản phẩm không đủ tồn kho trước khi thanh toán.
        </Text>
      )}

      {errorMessage && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      {/* Customer bar */}
      <CustomerBar customer={localCustomer} isEditable onPress={() => setShowPicker(true)} />

      {/* Payment footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalValue}>{formatCurrencyVND(total)}</Text>
        </View>
        
        <Button
          title="Thanh toán"
          onPress={handlePayment}
          disabled={localItems.length === 0 || hasInvalidItems}
        />
      </View>

      {/* Customer picker bottom sheet */}
      <CustomerPickerBottomSheet
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(c) => { setLocalCustomer({ name: c.name, phone: c.phone }); setShowPicker(false); }}
      />

      <CommonAlertModal {...alertProps} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.background,
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
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  paymentWarning: {
    marginTop: spacing.sm,
    fontSize: 12,
    color: colors.error,
    textAlign: 'center',
  },
  errorBanner: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error,
    backgroundColor: '#FFF1F2',
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    textAlign: 'center',
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
