import React, { useEffect, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { ScreenHeader } from '../../../ui/components';
import { colors, spacing } from '../../../ui/theme';
import { CommonAlertModal } from '../../../common/shared/components/CommonAlertModal';
import { useCommonAlert } from '../../../common/shared/hooks/useCommonAlert';
import {
  SalesActionButton,
  SelectedProductRow,
  TotalFooter,
} from '../components';
import type { SalesOrderItem } from '../components';
import { CustomerBar } from '../../orders/components';
import { CustomerPickerBottomSheet } from '../../customers/components';
import type { Customer } from '../../customers/mock/customers.mock';
import { usePosStore } from '../store/pos.store';
import { useProductsStore } from '../../products/store/products.store';
import { useInventoryStore } from '../../products/store/inventory.store';
import { useCategoriesStore } from '../../products/store/categories.store';
import { useOrdersStore } from '../../orders/store/orders.store';
import { useAuthStore } from '../../../store/auth.store';
import type { MainStackScreenProps } from '../../../types/navigation';
import type { StockItem } from '../../../lib/stock';

type Props = MainStackScreenProps<"Sales">;

export const SalesScreen: React.FC<Props> = ({ navigation, route }) => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const allProducts = useProductsStore((s) => s.products);
  const fetchProducts = useProductsStore((s) => s.fetchProducts);
  const fetchCategories = useCategoriesStore((s) => s.fetchCategories);
  const stockByProductId = useInventoryStore((s) => s.stockByProductId);

  // ── POS Store ─────────────────────────────────────────────────
  const posItems = usePosStore((s) => s.items);
  const orderId = usePosStore((s) => s.orderId);
  const orderCode = usePosStore((s) => s.orderCode);
  const grandTotal = usePosStore((s) => s.grandTotal);
  const isCreatingOrder = usePosStore((s) => s.isCreatingOrder);
  const isLoadingDraft = usePosStore((s) => s.isLoadingDraft);
  const isUpdatingItems = usePosStore((s) => s.isUpdatingItems);
  const isCancelling = usePosStore((s) => s.isCancelling);
  const posError = usePosStore((s) => s.error);
  const clearError = usePosStore((s) => s.clearError);
  const loadDraftOrder = usePosStore((s) => s.loadDraftOrder);
  const addPickedItems = usePosStore((s) => s.addPickedItems);
  const incrementItem = usePosStore((s) => s.incrementItem);
  const decrementItem = usePosStore((s) => s.decrementItem);
  const setItemQty = usePosStore((s) => s.setItemQty);
  const cancelOrder = usePosStore((s) => s.cancel);
  const resetSession = usePosStore((s) => s.resetSession);
  const validateDraftOrder = usePosStore((s) => s.validateDraftOrder);
  const fetchOrders = useOrdersStore((s) => s.fetchOrders);

  const [customer, setCustomer] = React.useState<Customer | undefined>(
    undefined,
  );
  const [showPicker, setShowPicker] = React.useState(false);
  const [isEditingDraft, setIsEditingDraft] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuAnim = useRef(new Animated.Value(0)).current;
  const { alertProps, showAlert } = useCommonAlert();

  const handleDismissError = useCallback(() => {
    clearError();
  }, [clearError]);

  // ── Receive pickedItems from ProductPicker ────────────────────
  useEffect(() => {
    const picked = route.params?.pickedItems;
    if (!picked || picked.length === 0 || !accessToken) return;

    // Enrich with trackInventory / onHand from real product store
    const enriched = picked.map((pi) => {
      const p = allProducts.find((ap) => ap.id === pi.productId);
      return {
        productId: pi.productId,
        productName: pi.productName,
        unitPrice: pi.unitPrice,
        quantity: pi.quantity,
        trackInventory: p?.trackInventory ?? true,
        onHand: p?.onHand ?? 0,
      };
    });

    addPickedItems(accessToken, enriched);
    navigation.setParams({ pickedItems: undefined });
  }, [route.params?.pickedItems]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Load draft order from Orders list ────────────────────────
  useEffect(() => {
    const draftOrderId = route.params?.draftOrderId;
    if (!draftOrderId || !accessToken) return;
    if (draftOrderId === orderId) {
      navigation.setParams({ draftOrderId: undefined });
      return;
    }

    (async () => {
      setIsEditingDraft(true);
      const ok = await loadDraftOrder(accessToken, draftOrderId);
      if (ok) setCustomer(undefined);
      navigation.setParams({ draftOrderId: undefined });
    })();
  }, [route.params?.draftOrderId, accessToken]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const source = route.params?.source;
    if (source === 'orders') {
      setIsEditingDraft(true);
      return;
    }
    if (!route.params?.draftOrderId) {
      setIsEditingDraft(false);
    }
  }, [route.params?.source, route.params?.draftOrderId]);

  useEffect(() => {
    if (!route.params?.resetToNew) return;
    setCustomer(undefined);
    setIsEditingDraft(false);
    resetSession();
    navigation.setParams({ resetToNew: undefined });
  }, [route.params?.resetToNew, navigation, resetSession]);

  useEffect(() => {
    Animated.timing(menuAnim, {
      toValue: isMenuOpen ? 1 : 0,
      duration: isMenuOpen ? 220 : 180,
      easing: isMenuOpen ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [isMenuOpen, menuAnim]);

  useFocusEffect(
    useCallback(() => {
      if (!accessToken) return;
      validateDraftOrder(accessToken);
      (async () => {
        await fetchCategories(accessToken);
        const cats = useCategoriesStore.getState().categories;
        await fetchProducts(accessToken, cats);
      })();
    }, [accessToken, validateDraftOrder, fetchCategories, fetchProducts]),
  );

  // ── Receive updatedItem from QuantityEditor ───────────────────
  useEffect(() => {
    const upd = route.params?.updatedItem;
    if (!upd || !accessToken) return;

    const product = allProducts.find((p) => {
      const cartItem = posItems.find((it) => it.itemId === upd.itemId);
      return cartItem ? p.id === cartItem.productId : false;
    });
    const cartItem = posItems.find((it) => it.itemId === upd.itemId);
    if (cartItem && accessToken) {
      setItemQty(
        accessToken,
        cartItem.productId,
        upd.qty,
        product?.onHand ?? 0,
        product?.trackInventory ?? true,
      );
    }
    navigation.setParams({ updatedItem: undefined });
  }, [route.params?.updatedItem]); // eslint-disable-line react-hooks/exhaustive-deps

  const openProductPicker = useCallback(() => {
    // Use orderId if exists, otherwise pass a placeholder (draft will be created on first add)
    navigation.navigate("ProductPicker", {
      orderId: orderId ?? "new",
      returnScreen: "Sales",
    });
  }, [navigation, orderId]);

  const openBarcodeScanner = useCallback(() => {
    navigation.navigate("ScanProduct", {
      orderId: orderId ?? undefined,
      returnScreen: "Sales",
    });
  }, [navigation, orderId]);

  const openQuantityEditor = useCallback(
    (item: SalesOrderItem) => {
      navigation.navigate("QuantityEditor", {
        orderId: orderId ?? "new",
        itemId: item.itemId,
        productName: item.productName,
        unitPrice: item.unitPrice,
        currentQty: item.quantity,
        returnScreen: "Sales",
      });
    },
    [navigation, orderId],
  );

  const resolveStockInfo = useCallback((productId: string) => {
    const product = allProducts.find((p) => p.id === productId);
    if (product) {
      return { onHand: product.onHand, trackInventory: product.trackInventory };
    }
    const fallback = stockByProductId[productId];
    if (typeof fallback === 'number') {
      return { onHand: fallback, trackInventory: true };
    }
    return { onHand: 0, trackInventory: false };
  }, [allProducts, stockByProductId]);

  const handleItemAdd = useCallback(
    (item: SalesOrderItem) => {
      if (!accessToken) return;
      const { onHand, trackInventory } = resolveStockInfo(item.productId);
      incrementItem(accessToken, item.productId, onHand, trackInventory);
    },
    [accessToken, incrementItem, resolveStockInfo],
  );

  const handleItemRemove = useCallback(
    (item: SalesOrderItem) => {
      if (!accessToken) return;
      decrementItem(accessToken, item.productId);
    },
    [accessToken, decrementItem],
  );

  const handlePayment = useCallback(async () => {
    if (!accessToken) return;
    await fetchCategories(accessToken);
    const cats = useCategoriesStore.getState().categories;
    await fetchProducts(accessToken, cats);
    const latestProducts = useProductsStore.getState().products;
    const latestStocks = useInventoryStore.getState().stockByProductId;

    const stockItems: StockItem[] = posItems.map((it) => ({
      productId: it.productId,
      quantity: it.quantity,
    }));

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

    if (!orderId || !orderCode || posItems.length === 0) return;
    navigation.navigate("Payment", {
      orderCode,
      orderId,
      total: grandTotal,
    });
  }, [accessToken, fetchCategories, fetchProducts, navigation, orderId, orderCode, posItems, grandTotal, showAlert]);

  const handleCancelOrder = useCallback(() => {
    if (!orderId || !accessToken) return;
    showAlert({
      variant: 'danger',
      title: 'Hủy đơn hàng',
      message: 'Bạn có chắc chắn muốn hủy đơn nháp này không?',
      confirmText: 'Hủy đơn',
      cancelText: 'Không',
      showCancel: true,
      onConfirm: async () => {
        const ok = await cancelOrder(accessToken);
        if (ok) {
          resetSession();
        }
      },
    });
  }, [orderId, accessToken, cancelOrder, resetSession, showAlert]);

  const handleMenuDelete = useCallback(() => {
    setIsMenuOpen(false);
    handleCancelOrder();
  }, [handleCancelOrder]);

  const handleNewOrder = useCallback(async () => {
    if (!accessToken) return;
    if (isUpdatingItems) {
      showAlert({
        variant: 'warning',
        title: 'Đang đồng bộ',
        message: 'Vui lòng chờ đồng bộ xong trước khi tạo đơn mới.',
      });
      return;
    }

    const hasDraft = !!orderId && posItems.length > 0;
    if (!hasDraft) {
      setCustomer(undefined);
      setIsEditingDraft(false);
      resetSession();
      return;
    }

    showAlert({
      variant: 'warning',
      title: 'Tạo đơn mới',
      message: 'Nhấn xác nhận để tạo đơn mới.',
      subMessage: 'Đơn hàng hiện tại sẽ được lưu lại dưới dạng nháp.',
      confirmText: 'Xác nhận',
      cancelText: 'Hủy',
      showCancel: true,
      onConfirm: async () => {
        setCustomer(undefined);
        setIsEditingDraft(false);
        resetSession();
        await fetchOrders(accessToken);
      },
    });
  }, [accessToken, isUpdatingItems, orderId, posItems.length, showAlert, resetSession, fetchOrders]);

  const handleMenuNewOrder = useCallback(() => {
    setIsMenuOpen(false);
    handleNewOrder();
  }, [handleNewOrder]);

  const handleBack = useCallback(() => {
    if (posItems.length === 0) {
      showAlert({
        variant: 'danger',
        title: 'Hủy đơn',
        message: 'Bạn có muốn hủy đơn này không?',
        confirmText: 'Xác nhận',
        cancelText: 'Hủy',
        showCancel: true,
        onConfirm: async () => {
          if (orderId && accessToken) {
            const ok = await cancelOrder(accessToken);
            if (ok) resetSession();
          } else {
            resetSession();
          }

          if (isEditingDraft) {
            if (navigation.canGoBack()) {
              navigation.goBack();
              return;
            }
            navigation.navigate('Orders');
            return;
          }

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'MainTabs' }],
            }),
          );
        },
      });
      return;
    }

    if (isEditingDraft) {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return;
      }
      navigation.navigate('Orders');
      return;
    }

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      }),
    );
  }, [posItems.length, orderId, accessToken, cancelOrder, resetSession, isEditingDraft, navigation, showAlert]);

  // Convert POS items to SalesOrderItem shape for SelectedProductRow
  const salesItems: SalesOrderItem[] = posItems.map((it) => ({
    itemId: it.itemId,
    productId: it.productId,
    productName: it.productName,
    unitPrice: it.unitPrice,
    quantity: it.quantity,
  }));

  const isBusy = isCreatingOrder || isLoadingDraft || isUpdatingItems || isCancelling;

  const stockItems: StockItem[] = useMemo(
    () => posItems.map((it) => ({ productId: it.productId, quantity: it.quantity })),
    [posItems],
  );

  const stockWarnings = useMemo(() => {
    const warnings: Record<string, string> = {};
    stockItems.forEach((item) => {
      const { onHand, trackInventory } = resolveStockInfo(item.productId);
      if (!trackInventory || onHand <= 0) {
        warnings[item.productId] = 'Sản phẩm tạm hết hàng';
        return;
      }
      if (item.quantity > onHand) {
        warnings[item.productId] = `Chỉ còn ${onHand} sản phẩm trong kho`;
      }
    });
    return warnings;
  }, [stockItems, resolveStockInfo]);

  const hasInvalidItems = useMemo(() => {
    return stockItems.some((item) => {
      const { onHand, trackInventory } = resolveStockInfo(item.productId);
      if (!trackInventory || onHand <= 0) return true;
      return item.quantity > onHand;
    });
  }, [stockItems, resolveStockInfo]);

  const renderItem = ({ item }: { item: SalesOrderItem }) => (
    <SelectedProductRow
      item={item}
      note={stockWarnings[item.productId]}
      onQtyPress={() => openQuantityEditor(item)}
      onAdd={() => handleItemAdd(item)}
      onRemove={() => handleItemRemove(item)}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <ScreenHeader
        title="Đơn mới"
        subtitle={orderCode ?? undefined}
        showBack
        onBackPress={handleBack}
        rightSecondaryIcon="ellipsis-vertical"
        onRightSecondaryPress={() => setIsMenuOpen(true)}
      />

      {/* Action buttons */}
      <View style={styles.actions}>
        <SalesActionButton
          title="Thêm sản phẩm"
          iconName="add-circle-outline"
          onPress={openProductPicker}
        />
        <SalesActionButton
          title="Quét sản phẩm"
          iconName="scan-outline"
          onPress={openBarcodeScanner}
        />
      </View>

      {/* Sync indicator */}
      {isBusy && (
        <View style={styles.syncRow}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.syncText}>Đang đồng bộ...</Text>
        </View>
      )}

      {posError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{posError}</Text>
          <TouchableOpacity onPress={handleDismissError} activeOpacity={0.7}>
            <Text style={styles.errorDismiss}>Đóng</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Product list or empty state */}
      {salesItems.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Chưa có sản phẩm trong giỏ hàng</Text>
        </View>
      ) : (
        <FlatList
          data={salesItems}
          keyExtractor={(it) => `${orderId ?? 'new'}:${it.productId}`}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      )}

      {hasInvalidItems && (
        <Text style={styles.paymentWarning}>
          Vui lòng cập nhật số lượng các sản phẩm không đủ tồn kho trước khi thanh toán.
        </Text>
      )}

      {/* Customer bar */}
      <CustomerBar
        customer={customer}
        isEditable
        onPress={() => setShowPicker(true)}
      />

      {/* Total footer / CTA */}
      <TotalFooter
        total={grandTotal}
        onPress={handlePayment}
        disabled={salesItems.length === 0 || isBusy || hasInvalidItems}
        label="Thanh toán"
      />

      {/* Customer picker bottom sheet */}
      <CustomerPickerBottomSheet
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(c) => {
          setCustomer(c);
          setShowPicker(false);
        }}
      />

      <Modal
        transparent
        visible={isMenuOpen}
        animationType="slide"
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <View style={styles.menuBackdrop}>
          <Animated.View
            style={[
              styles.menuOverlay,
              {
                opacity: menuAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.45],
                }),
              },
            ]}
          />
          <Pressable style={styles.menuBackdropPressable} onPress={() => setIsMenuOpen(false)} />
          <Animated.View
            style={[
              styles.menuSheet,
              {
                transform: [
                  {
                    translateY: menuAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [220, 0],
                    }),
                  },
                ],
                opacity: menuAnim,
              },
            ]}
          >
            <View style={styles.menuHandle} />
            <Text style={styles.menuTitle}>TÙY CHỌN</Text>
            <TouchableOpacity style={styles.menuItem} onPress={handleMenuNewOrder}>
              <Text style={styles.menuText}>Tạo đơn mới</Text>
            </TouchableOpacity>
            <View style={styles.menuDividerStrong} />
            <TouchableOpacity style={[styles.menuItem, styles.menuItemDanger]} onPress={handleMenuDelete}>
              <Text style={[styles.menuText, styles.menuTextDanger]}>Xóa đơn</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      <CommonAlertModal {...alertProps} />
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
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  menuBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  menuOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.black,
  },
  menuBackdropPressable: {
    flex: 1,
  },
  menuSheet: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 12,
  },
  menuHandle: {
    alignSelf: 'center',
    width: 48,
    height: 5,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  menuTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  menuItem: {
    paddingVertical: spacing.sm + 2,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  menuItemDanger: {
    backgroundColor: '#FFF5F5',
    borderColor: colors.error,
  },
  menuDivider: {
    height: spacing.sm,
  },
  menuDividerStrong: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  menuTextDanger: {
    color: colors.error,
  },
  syncRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xs,
    backgroundColor: colors.surfaceSecondary,
    gap: spacing.xs,
  },
  syncText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  errorBanner: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error,
    backgroundColor: '#FFF1F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: colors.error,
  },
  errorDismiss: {
    fontSize: 12,
    color: colors.error,
    fontWeight: '700',
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: "italic",
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
  paymentWarning: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.error,
    marginTop: spacing.sm,
  },
});
