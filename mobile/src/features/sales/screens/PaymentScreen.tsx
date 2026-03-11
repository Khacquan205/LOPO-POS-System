import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../../ui/components';
import { colors, spacing } from '../../../ui/theme';
import {
  CashConfirmModal,
  PaymentSuccessModal,
  TransferQrCard,
} from '../components';
import type { MainStackScreenProps } from '../../../types/navigation';

type Props = MainStackScreenProps<'Payment'>;

type PaymentMethod = 'CASH' | 'TRANSFER';

const METHODS: { id: PaymentMethod; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { id: 'CASH',     label: 'Tiền mặt',      icon: 'cash-outline' },
  { id: 'TRANSFER', label: 'Chuyển khoản',  icon: 'phone-portrait-outline' },
];

const formatAmount = (amount: number) =>
  amount.toLocaleString('vi-VN') + '₫';

const generateTxCode = () =>
  Math.random().toString(36).slice(2, 12).toUpperCase();

export const PaymentScreen: React.FC<Props> = ({ navigation, route }) => {
  const { orderCode, total } = route.params;
  const insets = useSafeAreaInsets();

  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [showCashConfirm, setShowCashConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  // Key changes on each refresh → forces TransferQrCard to remount + reset countdown
  const [txCode, setTxCode] = useState<string>(generateTxCode);

  const handleCashCTA = useCallback(() => {
    setShowCashConfirm(true);
  }, []);

  const handleCashOk = useCallback(() => {
    setShowCashConfirm(false);
    setShowSuccess(true);
  }, []);

  const handleTransferConfirm = useCallback(() => {
    setShowSuccess(true);
  }, []);

  const handleRefreshQr = useCallback(() => {
    setTxCode(generateTxCode());
  }, []);

  const handleSuccessOk = useCallback(() => {
    setShowSuccess(false);
    navigation.popToTop();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScreenHeader title={orderCode} showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
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
                {/* Check badge top-right */}
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

        {/* ── Transfer QR card (visible when TRANSFER selected) ── */}
        {method === 'TRANSFER' && (
          <TransferQrCard
            key={txCode}
            transactionCode={txCode}
            onConfirm={handleTransferConfirm}
            onRefresh={handleRefreshQr}
          />
        )}
      </ScrollView>

      {/* ── Bottom CTA (Cash only; Transfer has its own confirm button) ── */}
      {method === 'CASH' && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={handleCashCTA}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaText}>Hoàn tất thanh toán</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Modals ── */}
      <CashConfirmModal
        visible={showCashConfirm}
        onCancel={() => setShowCashConfirm(false)}
        onConfirm={handleCashOk}
      />
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
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
