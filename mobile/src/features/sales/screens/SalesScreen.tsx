import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { ScreenHeader } from "../../../ui/components";
import { colors, spacing } from "../../../ui/theme";
import {
  SalesActionButton,
  SelectedProductRow,
  TotalFooter,
} from "../components";
import type { SalesOrderItem } from "../components";
import { CustomerBar } from "../../orders/components";
import { CustomerPickerBottomSheet } from "../../customers/components";
import type { Customer } from "../../customers/mock/customers.mock";
import { usePosStore } from "../store/pos.store";
import { useProductsStore } from "../../products/store/products.store";
import { useAuthStore } from "../../../store/auth.store";
import type { MainStackScreenProps } from "../../../types/navigation";

type Props = MainStackScreenProps<"Sales">;

export const SalesScreen: React.FC<Props> = ({ navigation, route }) => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const allProducts = useProductsStore((s) => s.products);

  // ── POS Store ─────────────────────────────────────────────────
  const posItems = usePosStore((s) => s.items);
  const orderId = usePosStore((s) => s.orderId);
  const orderCode = usePosStore((s) => s.orderCode);
  const grandTotal = usePosStore((s) => s.grandTotal);
  const isCreatingOrder = usePosStore((s) => s.isCreatingOrder);
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

  const [customer, setCustomer] = React.useState<Customer | undefined>(
    undefined,
  );
  const [showPicker, setShowPicker] = React.useState(false);

  // ── Show backend error alerts ─────────────────────────────────
  useEffect(() => {
    if (!posError) return;
    Alert.alert("Lỗi", posError, [{ text: "OK", onPress: clearError }]);
  }, [posError]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Load selected draft order from Orders screen ──────────────
  useEffect(() => {
    const draftOrderId = route.params?.draftOrderId;
    if (!draftOrderId || !accessToken) return;

    loadDraftOrder(accessToken, draftOrderId).finally(() => {
      navigation.setParams({ draftOrderId: undefined });
    });
  }, [route.params?.draftOrderId, accessToken]); // eslint-disable-line react-hooks/exhaustive-deps

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
        trackInventory: p?.trackInventory ?? false,
        onHand: p?.onHand ?? 0,
      };
    });

    addPickedItems(accessToken, enriched);
    navigation.setParams({ pickedItems: undefined });
  }, [route.params?.pickedItems]); // eslint-disable-line react-hooks/exhaustive-deps

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
        product?.trackInventory ?? false,
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

  const handleItemAdd = useCallback(
    (item: SalesOrderItem) => {
      if (!accessToken) return;
      const product = allProducts.find((p) => p.id === item.productId);
      incrementItem(
        accessToken,
        item.productId,
        product?.onHand ?? 0,
        product?.trackInventory ?? false,
      );
    },
    [accessToken, allProducts, incrementItem],
  );

  const handleItemRemove = useCallback(
    (item: SalesOrderItem) => {
      if (!accessToken) return;
      decrementItem(accessToken, item.productId);
    },
    [accessToken, decrementItem],
  );

  const handlePayment = useCallback(() => {
    if (!orderId || !orderCode || posItems.length === 0) return;
    navigation.navigate("Payment", {
      orderCode,
      orderId,
      total: grandTotal,
    });
  }, [navigation, orderId, orderCode, posItems.length, grandTotal]);

  const handleCancelOrder = useCallback(() => {
    if (!orderId || !accessToken) return;
    Alert.alert(
      "Hủy đơn hàng",
      "Bạn có chắc chắn muốn hủy đơn nháp này không?",
      [
        { text: "Không", style: "cancel" },
        {
          text: "Hủy đơn",
          style: "destructive",
          onPress: async () => {
            const ok = await cancelOrder(accessToken);
            if (ok) {
              resetSession();
            }
          },
        },
      ],
    );
  }, [orderId, accessToken, cancelOrder, resetSession]);

  // Convert POS items to SalesOrderItem shape for SelectedProductRow
  const salesItems: SalesOrderItem[] = posItems.map((it) => ({
    itemId: it.itemId,
    productId: it.productId,
    productName: it.productName,
    unitPrice: it.unitPrice,
    quantity: it.quantity,
  }));

  const isBusy = isCreatingOrder || isUpdatingItems || isCancelling;

  const renderItem = ({ item }: { item: SalesOrderItem }) => (
    <SelectedProductRow
      item={item}
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
        rightIcon="add-outline"
        onRightPress={openProductPicker}
        rightSecondaryIcon="trash-outline"
        onRightSecondaryPress={handleCancelOrder}
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

      {/* Product list or empty state */}
      {salesItems.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>(Chưa có sản phẩm nào)</Text>
        </View>
      ) : (
        <FlatList
          data={salesItems}
          keyExtractor={(it) => it.itemId}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
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
        disabled={salesItems.length === 0 || isBusy}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  actions: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionSpacer: {
    width: spacing.sm,
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
});
