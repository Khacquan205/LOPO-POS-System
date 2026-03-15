<<<<<<< Updated upstream
import React, { useState, useCallback, useMemo } from 'react';
=======
import React, { useState, useCallback } from "react";
>>>>>>> Stashed changes
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
<<<<<<< Updated upstream
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../../ui/components';
import { colors, spacing } from '../../../ui/theme';
import { CustomerBar, OrderStatusChip, SummaryInfoRow } from '../../orders/components';
import { formatCurrencyVND, formatDateTime, type OrderStatusApi } from '../../orders/types/order.types';
import {
  PaymentSuccessModal,
} from '../components';
import { usePosStore } from '../store/pos.store';
import { checkoutOrder } from '../services/orders.service';
import { useAuthStore } from '../../../store/auth.store';
import type { MainStackScreenProps } from '../../../types/navigation';
=======
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "../../../ui/components";
import { colors, spacing } from "../../../ui/theme";
import { PaymentSuccessModal } from "../components";
import { usePosStore } from "../store/pos.store";
import { checkoutOrder } from "../services/orders.service";
import { useAuthStore } from "../../../store/auth.store";
import type { MainStackScreenProps } from "../../../types/navigation";
>>>>>>> Stashed changes

type Props = MainStackScreenProps<"Payment">;

<<<<<<< Updated upstream
type PaymentMethod = 'cash' | 'transfer';
=======
type PaymentMethod = "cash" | "transfer";
type PaymentStatus = "paid" | "unpaid";
>>>>>>> Stashed changes

const METHODS: {
  id: PaymentMethod;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
}[] = [
<<<<<<< Updated upstream
  { id: 'cash', label: 'Tiền mặt', icon: 'cash-outline' },
  { id: 'transfer', label: 'Chuyển khoản', icon: 'swap-horizontal-outline' },
];

const formatAmount = (amount: number) => formatCurrencyVND(amount);
=======
  { id: "cash", label: "Tiền mặt", icon: "cash-outline" },
  { id: "transfer", label: "Chuyển khoản", icon: "phone-portrait-outline" },
];

const formatAmount = (amount: number) => amount.toLocaleString("vi-VN") + "₫";
>>>>>>> Stashed changes

export const PaymentScreen: React.FC<Props> = ({ navigation, route }) => {
  const { orderCode, orderId, total, status, createdAt, staffName, items, customer } = route.params;
  const insets = useSafeAreaInsets();

  const accessToken = useAuthStore((s) => s.accessToken);
  const staffFromAuth = useAuthStore((s) => s.user?.name);
  const checkout = usePosStore((s) => s.checkout);
  const isCheckingOut = usePosStore((s) => s.isCheckingOut);
  const resetSession = usePosStore((s) => s.resetSession);
  const posOrderId = usePosStore((s) => s.orderId);
  const posItems = usePosStore((s) => s.items);
  const posTotal = usePosStore((s) => s.grandTotal);

<<<<<<< Updated upstream
  const [method, setMethod] = useState<PaymentMethod>('cash');
=======
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("paid");
>>>>>>> Stashed changes
  const [showSuccess, setShowSuccess] = useState(false);
  const [isCheckingOutDirect, setIsCheckingOutDirect] = useState(false);

  const isBusy = isCheckingOut || isCheckingOutDirect;

  const summaryItems = useMemo(() => {
    if (items && items.length > 0) return items;
    if (orderId && orderId === posOrderId) {
      return posItems.map((it) => ({
        id: it.itemId,
        productName: it.productName,
        unitPrice: it.unitPrice,
        quantity: it.quantity,
      }));
    }
    return [];
  }, [items, orderId, posOrderId, posItems]);

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

  const handleConfirm = useCallback(async () => {
    // No orderId → legacy display-only path
    if (!orderId) {
      setShowSuccess(true);
      return;
    }
    if (!accessToken) return;

    if (orderId === posOrderId) {
      // Current POS session → use posStore (handles its own loading state)
      const ok = await checkout(accessToken, {
        payment_method: method,
<<<<<<< Updated upstream
        payment_status: 'paid',
=======
        payment_status: paymentStatus,
>>>>>>> Stashed changes
      });
      if (ok) {
        setShowSuccess(true);
      } else {
        const err = usePosStore.getState().error;
        if (err) {
          Alert.alert("Thanh toán thất bại", err, [
            { text: "OK", onPress: () => usePosStore.getState().clearError() },
          ]);
        }
      }
    } else {
      // Order from DraftOrderDetail (different from posStore session)
      setIsCheckingOutDirect(true);
      try {
        await checkoutOrder(accessToken, orderId, {
          payment_method: method,
<<<<<<< Updated upstream
          payment_status: 'paid',
=======
          payment_status: paymentStatus,
>>>>>>> Stashed changes
        });
        setShowSuccess(true);
      } catch (err) {
        Alert.alert(
          "Thanh toán thất bại",
          err instanceof Error ? err.message : "Có lỗi xảy ra",
        );
      } finally {
        setIsCheckingOutDirect(false);
      }
    }
<<<<<<< Updated upstream
  }, [accessToken, orderId, checkout, method, posOrderId]);
=======
  }, [accessToken, orderId, checkout, method, paymentStatus]);
>>>>>>> Stashed changes

  const handleSuccessOk = useCallback(() => {
    setShowSuccess(false);
    const posOrderId = usePosStore.getState().orderId;
    if (orderId && orderId === posOrderId) {
      resetSession();
    }
    navigation.popToTop();
  }, [navigation, orderId, resetSession]);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Tổng kết đơn" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Order info ── */}
        <View style={styles.orderInfo}>
          <View style={styles.orderInfoTop}>
            <Text style={styles.orderCode}>{orderCode}</Text>
            <OrderStatusChip status={displayStatus} />
          </View>
          <Text style={styles.orderMeta}>{createdAtText}</Text>
          <View style={styles.staffRow}>
            <Ionicons name="person-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.staffText}> {displayStaff}</Text>
          </View>
        </View>

        {/* ── Products ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sản phẩm ({totalItems} món)</Text>
          {summaryItems.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có sản phẩm</Text>
          ) : (
            summaryItems.map((item) => (
              <View key={item.id} style={styles.productRow}>
                <Text style={styles.productQty}>{item.quantity}x</Text>
                <Text style={styles.productName} numberOfLines={1}>{item.productName}</Text>
                <Text style={styles.productPrice}>{formatAmount(item.unitPrice * item.quantity)}</Text>
              </View>
            ))
          )}
        </View>

        {/* ── Totals ── */}
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

        {/* ── Customer ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Khách hàng</Text>
          <CustomerBar customer={customer} isEditable={false} />
        </View>

        {/* ── Payment method selector ── */}
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
<<<<<<< Updated upstream
=======
                {method === m.id && (
                  <View style={styles.checkBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={colors.primary}
                    />
                  </View>
                )}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======

        {/* ── Payment status ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trạng thái thanh toán</Text>
          <View style={styles.methodRow}>
            {(["paid", "unpaid"] as PaymentStatus[]).map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.statusCard,
                  paymentStatus === s && styles.methodCardActive,
                ]}
                onPress={() => setPaymentStatus(s)}
                activeOpacity={0.7}
              >
                {paymentStatus === s && (
                  <View style={styles.checkBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={colors.primary}
                    />
                  </View>
                )}
                <Text
                  style={[
                    styles.methodLabel,
                    paymentStatus === s && styles.methodLabelActive,
                  ]}
                >
                  {s === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
>>>>>>> Stashed changes
      </ScrollView>

      {/* ── Confirm CTA ── */}
      <View
        style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}
      >
        <TouchableOpacity
          style={[styles.ctaBtn, isBusy && styles.ctaBtnDisabled]}
          onPress={isBusy ? undefined : handleConfirm}
          activeOpacity={isBusy ? 1 : 0.8}
        >
          {isBusy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.ctaText}>Xác nhận {formatAmount(displayTotal)}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Success Modal ── */}
      <PaymentSuccessModal
        visible={showSuccess}
        orderCode={orderCode}
        formattedTotal={formatAmount(total)}
        onOk={handleSuccessOk}
      />
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
  /* Order info */
  orderInfo: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
<<<<<<< Updated upstream
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  orderInfoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderCode: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  orderMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  staffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  staffText: {
    fontSize: 12,
    color: colors.textSecondary,
=======
    paddingVertical: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  totalAmount: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.linkOrange,
    letterSpacing: 0.5,
>>>>>>> Stashed changes
  },
  /* Section */
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  productQty: {
    width: 30,
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  productName: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
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
<<<<<<< Updated upstream
    alignItems: 'center',
    paddingVertical: spacing.sm + 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    gap: spacing.xs,
=======
    alignItems: "center",
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    gap: spacing.xs,
    position: "relative",
>>>>>>> Stashed changes
  },
  methodCardActive: {
    borderColor: colors.primary,
    backgroundColor: "#EBF2FF",
  },
  methodLabel: {
    fontSize: 13,
<<<<<<< Updated upstream
    color: colors.textPrimary,
    fontWeight: '500',
=======
    color: colors.textSecondary,
    fontWeight: "500",
>>>>>>> Stashed changes
  },
  methodLabelActive: {
    color: colors.primary,
    fontWeight: "700",
  },
<<<<<<< Updated upstream
=======
  checkBadge: {
    position: "absolute",
    top: 6,
    right: 6,
  },
  statusCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    position: "relative",
  },
>>>>>>> Stashed changes
  /* Footer */
  footer: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  ctaBtn: {
    backgroundColor: colors.primary,
<<<<<<< Updated upstream
    borderRadius: 14,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
=======
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: "center",
>>>>>>> Stashed changes
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
