import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader, Button } from '../../../ui/components';
import { colors, spacing } from '../../../ui/theme';
import { SummaryInfoRow, OrderStatusChip, CustomerBar } from '../components';
import { getOrderById, formatCurrencyVND, formatDateTime, type Order } from '../mock/orders.mock';
import type { MainStackScreenProps, LiveOrderPayload } from '../../../types/navigation';

type Props = MainStackScreenProps<'OrderSummary'>;

type DisplayOrder = {
  code: string;
  status?: Order['status'];
  createdAt?: string;
  staff?: { name: string };
  customer?: { name: string; phone?: string };
  items: { id: string; productName: string; unitPrice: number; quantity: number }[];
  total: number;
};

export const OrderSummaryScreen: React.FC<Props> = ({ navigation, route }) => {
  const { orderId, liveOrder } = route.params;
  const insets = useSafeAreaInsets();

  // Build normalized view from either live payload (Sales flow) or mock (DraftOrder flow)
  let displayOrder: DisplayOrder | null = null;
  if (liveOrder) {
    displayOrder = liveOrder;
  } else if (orderId) {
    const o = getOrderById(orderId);
    if (o) {
      displayOrder = {
        code: o.code,
        status: o.status,
        createdAt: o.createdAt,
        staff: o.staff,
        customer: o.customer,
        items: o.items,
        total: o.total,
      };
    }
  }

  if (!displayOrder) {
    return (
      <View style={styles.notFound}>
        <ScreenHeader title="Tổng kết đơn" showBack />
        <Text style={styles.notFoundText}>Không tìm thấy đơn hàng</Text>
      </View>
    );
  }

  const subtotal = displayOrder.items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
  const totalItems = displayOrder.items.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Tổng kết đơn" showBack />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Order info */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.orderCode}>{displayOrder.code}</Text>
            {displayOrder.status && <OrderStatusChip status={displayOrder.status} />}
          </View>
          {displayOrder.createdAt && (
            <Text style={styles.dateText}>{formatDateTime(displayOrder.createdAt)}</Text>
          )}
          {displayOrder.staff && (
            <View style={styles.staffRow}>
              <Ionicons name="person-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.staffText}> {displayOrder.staff.name}</Text>
            </View>
          )}
        </View>

        {/* Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sản phẩm ({totalItems} món)</Text>
          {displayOrder.items.map((item) => (
            <View key={item.id} style={styles.productRow}>
              <Text style={styles.productQty}>{item.quantity}x</Text>
              <Text style={styles.productName} numberOfLines={1}>{item.productName}</Text>
              <Text style={styles.productPrice}>{formatCurrencyVND(item.unitPrice * item.quantity)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <SummaryInfoRow label="Tạm tính" value={formatCurrencyVND(subtotal)} />
          <SummaryInfoRow
            label="Tổng thanh toán"
            value={formatCurrencyVND(displayOrder.total)}
            valueColor={colors.linkOrange}
            bold
            topBorderThick
          />
        </View>

        {/* Customer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Khách hàng</Text>
          <CustomerBar customer={displayOrder.customer} isEditable={false} />
        </View>
      </ScrollView>

      {/* Confirm footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button
          title="Tiến hành thanh toán"
          onPress={() =>
            navigation.navigate('Payment', {
              orderCode: displayOrder.code,
              total: displayOrder.total,
            })
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
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
  scrollContent: {
    paddingBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.background,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderCode: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  staffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  staffText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  section: {
    backgroundColor: colors.background,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  paymentMethods: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  paymentMethod: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm + 4,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    gap: 4,
  },
  paymentMethodActive: {
    borderColor: colors.primary,
    backgroundColor: '#EBF2FF',
  },
  paymentLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  paymentLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  footer: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
});
