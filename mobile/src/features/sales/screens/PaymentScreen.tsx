import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../../ui/components';
import { colors, spacing } from '../../../ui/theme';
import {
  PaymentSuccessModal,
} from '../components';
import { usePosStore } from '../store/pos.store';
import { checkoutOrder } from '../services/orders.service';
import { useAuthStore } from '../../../store/auth.store';
import type { MainStackScreenProps } from '../../../types/navigation';

type Props = MainStackScreenProps<'Payment'>;

type PaymentMethod = 'cash' | 'transfer';
type PaymentStatus = 'paid' | 'unpaid';

const METHODS: {
  id: PaymentMethod;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}[] = [
  { id: 'cash', label: 'Tiền mặt', icon: 'cash-outline' },
  { id: 'transfer', label: 'Chuyển khoản', icon: 'phone-portrait-outline' },
];

const formatAmount = (amount: number) => amount.toLocaleString('vi-VN') + '₫';

export const PaymentScreen: React.FC<Props> = ({ navigation, route }) => {
  const { orderCode, orderId, total } = route.params;
  const insets = useSafeAreaInsets();

  const accessToken = useAuthStore((s) => s.accessToken);
  const checkout = usePosStore((s) => s.checkout);
  const isCheckingOut = usePosStore((s) => s.isCheckingOut);
  const resetSession = usePosStore((s) => s.resetSession);

  const [method, setMethod] = useState<PaymentMethod>('cash');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('paid');
  const [note, setNote] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isCheckingOutDirect, setIsCheckingOutDirect] = useState(false);

  const isBusy = isCheckingOut || isCheckingOutDirect;

  const handleConfirm = useCallback(async () => {
    // No orderId → legacy display-only path
    if (!orderId) {
      setShowSuccess(true);
      return;
    }
    if (!accessToken) return;

    const posOrderId = usePosStore.getState().orderId;

    if (orderId === posOrderId) {
      // Current POS session → use posStore (handles its own loading state)
      const ok = await checkout(accessToken, {
        payment_method: method,
        payment_status: paymentStatus,
        note: note.trim() || undefined,
      });
      if (ok) {
        setShowSuccess(true);
      } else {
        const err = usePosStore.getState().error;
        if (err) {
          Alert.alert('Thanh toán thất bại', err, [
            { text: 'OK', onPress: () => usePosStore.getState().clearError() },
          ]);
        }
      }
    } else {
      // Order from DraftOrderDetail (different from posStore session)
      setIsCheckingOutDirect(true);
      try {
        await checkoutOrder(accessToken, orderId, {
          payment_method: method,
          payment_status: paymentStatus,
          note: note.trim() || undefined,
        });
        setShowSuccess(true);
      } catch (err) {
        Alert.alert('Thanh toán thất bại', err instanceof Error ? err.message : 'Có lỗi xảy ra');
      } finally {
        setIsCheckingOutDirect(false);
      }
    }
  }, [accessToken, orderId, checkout, method, paymentStatus, note]);

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
      <ScreenHeader title={orderCode} showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Total card ── */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Tổng thanh toán</Text>
          <Text style={styles.totalAmount}>{formatAmount(total)}</Text>
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
                {method === m.id && (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                  </View>
                )}
                <Ionicons
                  name={m.icon}
                  size={28}
                  color={method === m.id ? colors.primary : colors.textSecondary}
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

        {/* ── Payment status ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trạng thái thanh toán</Text>
          <View style={styles.methodRow}>
            {(['paid', 'unpaid'] as PaymentStatus[]).map((s) => (
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
                    <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                  </View>
                )}
                <Text
                  style={[
                    styles.methodLabel,
                    paymentStatus === s && styles.methodLabelActive,
                  ]}
                >
                  {s === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Note ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ghi chú (tuỳ chọn)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Ví dụ: Khách mang về..."
            placeholderTextColor={colors.textSecondary}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
          />
        </View>
      </ScrollView>

      {/* ── Confirm CTA ── */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <TouchableOpacity
          style={[styles.ctaBtn, isBusy && styles.ctaBtnDisabled]}
          onPress={isBusy ? undefined : handleConfirm}
          activeOpacity={isBusy ? 1 : 0.8}
        >
          {isBusy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.ctaText}>Hoàn tất thanh toán</Text>
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
  /* Total card */
  totalCard: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  totalAmount: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.linkOrange,
    letterSpacing: 0.5,
  },
  /* Section */
  section: {
    backgroundColor: colors.background,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  methodRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  methodCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    gap: spacing.xs,
    position: 'relative',
  },
  methodCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#EBF2FF',
  },
  methodLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  methodLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  statusCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    position: 'relative',
  },
  /* Note input */
  noteInput: {
    marginHorizontal: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 14,
    color: colors.textPrimary,
    minHeight: 72,
    textAlignVertical: 'top',
  },
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
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  ctaBtnDisabled: {
    backgroundColor: colors.textDisabled,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
