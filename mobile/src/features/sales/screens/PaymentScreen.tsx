import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../../ui/components';
import { colors, spacing } from '../../../ui/theme';
import { CommonAlertModal } from '../../../common/shared/components/CommonAlertModal';
import { useCommonAlert } from '../../../common/shared/hooks/useCommonAlert';
import { CustomerBar, OrderStatusChip, SummaryInfoRow } from '../../orders/components';
import { formatCurrencyVND, formatDateTime, type OrderStatusApi } from '../../orders/types/order.types';
import { TransferQrCard } from '../components';
import { usePosStore } from '../store/pos.store';
import { checkoutOrder } from '../services/orders.service';
import { useAuthStore } from '../../../store/auth.store';
import { useProductsStore } from '../../products/store/products.store';
import { useInventoryStore } from '../../products/store/inventory.store';
import { useCategoriesStore } from '../../products/store/categories.store';
import { useFocusEffect } from '@react-navigation/native';
import type { MainStackScreenProps } from '../../../types/navigation';
import type { StockItem } from '../../../lib/stock';
import { useOrdersStore } from '../../orders/store/orders.store';

type Props = MainStackScreenProps<'Payment'>;

type PaymentMethod = 'cash' | 'transfer';
type BackendPaymentMethod = 'cash' | 'bank_transfer';

const METHODS: {
  id: PaymentMethod;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}[] = [
  { id: 'cash', label: 'Tiền mặt', icon: 'cash-outline' },
  { id: 'transfer', label: 'Chuyển khoản', icon: 'swap-horizontal-outline' },
];

const formatAmount = (amount: number) => formatCurrencyVND(amount);
const buildOrderItemKey = (orderKey: string, productId: string) => `${orderKey}:${productId}`;
const buildTransactionCode = (seed?: string) => {
  const base = seed?.trim() ? seed : 'ORDER';
  const suffix = String(Date.now()).slice(-6);
  return `${base}-${suffix}`;
};
const mapPaymentMethodToBackend = (method: PaymentMethod): BackendPaymentMethod => {
  return method === 'transfer' ? 'bank_transfer' : 'cash';
};

export const PaymentScreen: React.FC<Props> = ({ navigation, route }) => {
  const {
    orderCode,
    orderId,
    total,
    status,
    createdAt,
    staffName,
    items,
    customer,
  } = route.params;
  const insets = useSafeAreaInsets();

  const accessToken = useAuthStore((s) => s.accessToken);
  const staffFromAuth = useAuthStore((s) => s.user?.name);
  const checkout = usePosStore((s) => s.checkout);
  const isCheckingOut = usePosStore((s) => s.isCheckingOut);
  const resetSession = usePosStore((s) => s.resetSession);
  const posOrderId = usePosStore((s) => s.orderId);
  const posItems = usePosStore((s) => s.items);
  const posTotal = usePosStore((s) => s.grandTotal);
  const products = useProductsStore((s) => s.products);
  const fetchProducts = useProductsStore((s) => s.fetchProducts);
  const fetchCategories = useCategoriesStore((s) => s.fetchCategories);
  const fetchOrders = useOrdersStore((s) => s.fetchOrders);
  const stockByProductId = useInventoryStore((s) => s.stockByProductId);

  const [method, setMethod] = useState<PaymentMethod>('cash');
  const [isCheckingOutDirect, setIsCheckingOutDirect] = useState(false);
  const [transactionCode, setTransactionCode] = useState<string>(() => buildTransactionCode(orderCode));
  const { alertProps, showAlert } = useCommonAlert();

  const isBusy = isCheckingOut || isCheckingOutDirect;

  const summaryItems = useMemo(() => {
    if (items && items.length > 0) return items;
    if (orderId && orderId === posOrderId) {
      return posItems.map((it) => ({
        id: it.productId,
        productName: it.productName,
        unitPrice: it.unitPrice,
        quantity: it.quantity,
      }));
    }
    return [];
  }, [items, orderId, posOrderId, posItems]);

  useFocusEffect(
    useCallback(() => {
      if (!accessToken) return;
      (async () => {
        await fetchCategories(accessToken);
        const cats = useCategoriesStore.getState().categories;
        await fetchProducts(accessToken, cats);
      })();
    }, [accessToken, fetchCategories, fetchProducts]),
  );

  const stockItems: StockItem[] = useMemo(
    () => summaryItems.map((it) => ({ productId: it.id, quantity: it.quantity })),
    [summaryItems],
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

  const hasInvalidItems = useMemo(() => {
    return stockItems.some((item) => {
      const { onHand, trackInventory } = resolveStockInfo(item.productId);
      if (!trackInventory || onHand <= 0) return true;
      return item.quantity > onHand;
    });
  }, [stockItems, resolveStockInfo]);

  const subtotal = useMemo(
    () => summaryItems.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0),
    [summaryItems],
  );

  const totalItems = useMemo(
    () => summaryItems.reduce((sum, it) => sum + it.quantity, 0),
    [summaryItems],
  );

  const displayTotal = useMemo(() => {
    if (orderId && orderId === posOrderId) {
      return posTotal || total;
    }
    return total;
  }, [orderId, posOrderId, posTotal, total]);

  const createdAtText = useMemo(
    () => formatDateTime(createdAt ?? new Date().toISOString()),
    [createdAt],
  );

  const displayStatus: OrderStatusApi = status ?? 'draft';
  const displayStaff = staffName ?? staffFromAuth ?? 'Nhân viên';

  useEffect(() => {
    if (method === 'transfer') {
      setTransactionCode(buildTransactionCode(orderCode));
    }
  }, [method, orderCode]);

  const handleSuccessOk = useCallback(() => {
    const posOrderId = usePosStore.getState().orderId;
    if (orderId && orderId === posOrderId) {
      resetSession();
      navigation.navigate('Sales', { source: 'sales', resetToNew: true });
      return;
    }
    if (accessToken) {
      (async () => {
        await fetchCategories(accessToken);
        const cats = useCategoriesStore.getState().categories;
        await fetchProducts(accessToken, cats);
        await fetchOrders(accessToken);
      })();
    }
    navigation.popToTop();
  }, [navigation, orderId, resetSession, accessToken, fetchCategories, fetchProducts, fetchOrders]);

  const handleConfirm = useCallback(async () => {
    if (!accessToken) return;
    await fetchCategories(accessToken);
    const cats = useCategoriesStore.getState().categories;
    await fetchProducts(accessToken, cats);
    const latestProducts = useProductsStore.getState().products;
    const latestStocks = useInventoryStore.getState().stockByProductId;
    const invalid = stockItems.some((item) => {
      const product = latestProducts.find((p) => p.id === item.productId);
      if (product) {
        if (!product.trackInventory || product.onHand <= 0) return true;
        return item.quantity > product.onHand;
      }
      const fallback = latestStocks[item.productId];
      if (typeof fallback !== 'number') return true;
      return item.quantity > fallback;
    });

    if (invalid) {
      showAlert({
        variant: 'warning',
        title: 'Không thể thanh toán',
        message: 'Đơn hàng có sản phẩm không đủ tồn kho',
      });
      return;
    }

    const backendPaymentMethod = mapPaymentMethodToBackend(method);

    // No orderId → legacy display-only path
    if (!orderId) {
      showAlert({
        variant: 'success',
        title: 'Thanh toán thành công!',
        message: `Đã thanh toán thành công ${formatAmount(displayTotal)} cho đơn hàng ${orderCode}`,
        confirmText: 'OK',
        onConfirm: handleSuccessOk,
      });
      return;
    }

    if (orderId === posOrderId) {
      // Current POS session -> use posStore (handles its own loading state)
      const ok = await checkout(accessToken, {
        payment_method: backendPaymentMethod,
        payment_status: 'paid',
      });
      if (ok) {
        showAlert({
          variant: 'success',
          title: 'Thanh toán thành công!',
          message: `Đã thanh toán thành công ${formatAmount(displayTotal)} cho đơn hàng ${orderCode}`,
          confirmText: 'OK',
          onConfirm: handleSuccessOk,
        });
      } else {
        const err = usePosStore.getState().error;
        if (err) {
          showAlert({
            variant: 'danger',
            title: 'Thanh toán thất bại',
            message: err,
            confirmText: 'OK',
            showCancel: false,
            onConfirm: () => usePosStore.getState().clearError(),
          });
        }
      }
    } else {
      // Order from DraftOrderDetail (different from posStore session)
      setIsCheckingOutDirect(true);
      try {
        await checkoutOrder(accessToken, orderId, {
          payment_method: backendPaymentMethod,
          payment_status: 'paid',
        });
        showAlert({
          variant: 'success',
          title: 'Thanh toán thành công!',
          message: `Đã thanh toán thành công ${formatAmount(displayTotal)} cho đơn hàng ${orderCode}`,
          confirmText: 'OK',
          onConfirm: handleSuccessOk,
        });
      } catch (err) {
        showAlert({
          variant: 'danger',
          title: 'Thanh toán thất bại',
          message: err instanceof Error ? err.message : 'Có lỗi xảy ra',
          confirmText: 'OK',
          showCancel: false,
        });
      } finally {
        setIsCheckingOutDirect(false);
      }
    }
  }, [accessToken, orderId, checkout, method, posOrderId, fetchCategories, fetchProducts, stockItems, showAlert, displayTotal, orderCode, handleSuccessOk]);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Tổng kết đơn" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 120 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.orderInfo}>
          <View style={styles.orderInfoTop}>
            <Text style={styles.orderCode}>{orderCode}</Text>
            <OrderStatusChip status={displayStatus} />
          </View>
          <Text style={styles.orderMeta}>{createdAtText}</Text>
          <View style={styles.staffRow}>
            <Ionicons
              name="person-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={styles.staffText}> {displayStaff}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sản phẩm ({totalItems} món)</Text>
          {summaryItems.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có sản phẩm</Text>
          ) : (
            summaryItems.map((item) => (
              <View
                key={buildOrderItemKey(orderId ?? posOrderId ?? 'pos', item.id)}
                style={styles.productRow}
              >
                <Text style={styles.productQty}>{item.quantity}x</Text>
                <Text style={styles.productName} numberOfLines={1}>
                  {item.productName}
                </Text>
                <Text style={styles.productPrice}>
                  {formatAmount(item.unitPrice * item.quantity)}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.totalsSection}>
          <SummaryInfoRow label="Tạm tính" value={formatAmount(subtotal)} />
          <SummaryInfoRow
            label="Tổng thanh toán"
            value={formatAmount(displayTotal)}
            valueColor={colors.linkOrange}
            bold
            topBorderThick
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Khách hàng</Text>
          <CustomerBar customer={customer} isEditable={false} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          <View style={styles.methodRow}>
            {METHODS.map((m) => (
              <TouchableOpacity
                key={m.id}
                style={[
                  styles.methodCard,
                  method === m.id && styles.methodCardActive,
                ]}
                onPress={() => setMethod(m.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={m.icon}
                  size={28}
                  color={
                    method === m.id ? colors.primary : colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.methodLabel,
                    method === m.id && styles.methodLabelActive,
                  ]}
                >
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {method === 'transfer' && (
          <TransferQrCard
            qrValue={transactionCode}
            accountName="LOPO POS"
            accountNumber="0123 456 789"
            bankName="Demo Bank"
          />
        )}
      </ScrollView>

      <View
        style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}
      >
        <TouchableOpacity
          style={[styles.ctaBtn, (isBusy || hasInvalidItems) && styles.ctaBtnDisabled]}
          onPress={isBusy || hasInvalidItems ? undefined : handleConfirm}
          activeOpacity={isBusy || hasInvalidItems ? 1 : 0.8}
        >
          {isBusy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.ctaText}>
              Xác nhận {formatAmount(displayTotal)}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <CommonAlertModal {...alertProps} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },
  scroll: {
    paddingBottom: spacing.xl,
  },
  orderInfo: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  orderInfoTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderCode: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  orderMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  staffRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  staffText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  section: {
    backgroundColor: colors.background,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  productQty: {
    width: 30,
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  productName: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  totalsSection: {
    backgroundColor: colors.background,
    marginTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  methodRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  methodCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.sm + 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    gap: spacing.xs,
  },
  methodCardActive: {
    borderColor: colors.primary,
    backgroundColor: "#EBF2FF",
  },
  methodLabel: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  methodLabelActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  footer: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  ctaBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: spacing.md + 2,
    alignItems: "center",
  },
  ctaBtnDisabled: {
    backgroundColor: colors.textDisabled,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
});
