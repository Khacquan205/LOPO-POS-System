import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "../../../ui/components";
import { colors, spacing } from "../../../ui/theme";
import {
  CustomerBar,
  OrderStatusChip,
  SummaryInfoRow,
} from "../../orders/components";
import {
  formatCurrencyVND,
  formatDateTime,
  type OrderStatusApi,
} from "../../orders/types/order.types";
import { PaymentSuccessModal, TransferQrCard } from "../components";
import { usePosStore } from "../store/pos.store";
import { checkoutOrder } from "../services/orders.service";
import { useAuthStore } from "../../../store/auth.store";
import type { MainStackScreenProps } from "../../../types/navigation";

type Props = MainStackScreenProps<"Payment">;

type PaymentMethod = "cash" | "transfer";

const METHODS: {
  id: PaymentMethod;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
}[] = [
  { id: "cash", label: "Tiền mặt", icon: "cash-outline" },
  { id: "transfer", label: "Chuyển khoản", icon: "swap-horizontal-outline" },
];

const formatAmount = (amount: number) => formatCurrencyVND(amount);

const TRANSFER_ACCOUNT = {
  accountName: "NGUYEN KHAC QUAN",
  accountNumber: "102873703683",
  bankName: "VietinBank CN NINH THUAN - PGD PHAN RANG",
  qrValue:
    "00020101021138560010A0000007270126000697041501121028737036830208QRIBFTTA53037045802VN6304E447",
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

  const [method, setMethod] = useState<PaymentMethod>("cash");
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

  const displayStatus: OrderStatusApi = status ?? "draft";
  const displayStaff = staffName ?? staffFromAuth ?? "Nhân viên";

  const handleConfirm = useCallback(async () => {
    // No orderId -> legacy display-only path
    if (!orderId) {
      setShowSuccess(true);
      return;
    }
    if (!accessToken) return;

    if (orderId === posOrderId) {
      // Current POS session -> use posStore (handles its own loading state)
      const ok = await checkout(accessToken, {
        payment_method: method,
        payment_status: "paid",
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
          payment_status: "paid",
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
  }, [accessToken, orderId, checkout, method, posOrderId]);

  const handleSuccessOk = useCallback(() => {
    setShowSuccess(false);
    const currentPosOrderId = usePosStore.getState().orderId;
    if (orderId && orderId === currentPosOrderId) {
      resetSession();
    }
    navigation.popToTop();
  }, [navigation, orderId, resetSession]);

  const successTitle =
    method === "transfer"
      ? "Chuyển khoản thành công!"
      : "Thanh toán thành công!";

  const successMessage =
    method === "transfer"
      ? `Đã xác nhận chuyển khoản ${formatAmount(displayTotal)} cho đơn hàng ${orderCode}`
      : `Đã thanh toán thành công ${formatAmount(displayTotal)} cho đơn hàng ${orderCode}`;

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
              <View key={item.id} style={styles.productRow}>
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

        {method === "transfer" && (
          <TransferQrCard
            qrValue={TRANSFER_ACCOUNT.qrValue}
            accountName={TRANSFER_ACCOUNT.accountName}
            accountNumber={TRANSFER_ACCOUNT.accountNumber}
            bankName={TRANSFER_ACCOUNT.bankName}
          />
        )}
      </ScrollView>

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
            <Text style={styles.ctaText}>
              Xác nhận {formatAmount(displayTotal)}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <PaymentSuccessModal
        visible={showSuccess}
        orderCode={orderCode}
        formattedTotal={formatAmount(displayTotal)}
        title={successTitle}
        message={successMessage}
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
