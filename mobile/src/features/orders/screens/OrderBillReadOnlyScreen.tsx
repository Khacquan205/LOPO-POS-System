import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../../ui/components';
import { colors, spacing } from '../../../ui/theme';
import { OrderStatusChip, OrderProductRow, CustomerBar } from '../components';
import { getOrderDetail, type ApiOrderItem } from '../../sales/services/orders.service';
import { formatCurrencyVND, formatDateTime, type OrderItemDisplay, type OrderStatusApi } from '../types/order.types';
import { useAuthStore } from '../../../store/auth.store';
import type { MainStackScreenProps } from '../../../types/navigation';

type Props = MainStackScreenProps<'OrderBillReadOnly'>;

function mapApiItem(item: ApiOrderItem): OrderItemDisplay {
  return {
    id: item.product_id,
    productId: item.product_id,
    productName: item.product_name_snapshot,
    unitPrice: item.unit_price,
    quantity: item.quantity,
  };
}

export const OrderBillReadOnlyScreen: React.FC<Props> = ({ navigation: _navigation, route }) => {
  const { orderId } = route.params;
  const insets = useSafeAreaInsets();
  const token = useAuthStore((s) => s.accessToken);

  const [isLoading, setIsLoading] = useState(true);
  const [orderCode, setOrderCode] = useState('');
  const [orderStatus, setOrderStatus] = useState<OrderStatusApi>('completed');
  const [orderCreatedAt, setOrderCreatedAt] = useState('');
  const [items, setItems] = useState<OrderItemDisplay[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    if (!token) return;
    setIsLoading(true);
    getOrderDetail(token, orderId)
      .then(({ order, items: apiItems }) => {
        setOrderCode(order.order_code);
        setOrderStatus(order.status);
        setOrderCreatedAt(order.createdAt);
        setItems(apiItems.map(mapApiItem));
        setGrandTotal(order.grand_total);
      })
      .catch((err: unknown) => {
        Alert.alert('Lỗi', err instanceof Error ? err.message : 'Không thể tải đơn hàng');
      })
      .finally(() => setIsLoading(false));
  }, [token, orderId]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Đơn hàng" showBack />
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      </View>
    );
  }

  const totalItems = items.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <View style={styles.container}>
      <ScreenHeader title={orderCode || 'Đơn hàng'} showBack />

      {/* Status + date row */}
      <View style={styles.statusRow}>
        <OrderStatusChip status={orderStatus} />
        <Text style={styles.dateText}>{formatDateTime(orderCreatedAt)}</Text>
      </View>

      {/* Product list */}
      <FlatList
        data={items}
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
        ListFooterComponent={
          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tổng cộng</Text>
              <Text style={styles.totalValue}>{formatCurrencyVND(grandTotal)}</Text>
            </View>
          </View>
        }
      />

      {/* Customer bar — no customer data in API response yet */}
      <CustomerBar customer={undefined} isEditable={false} />

      {/* No action footer — completed/cancelled orders can't be paid again */}
      <View style={{ paddingBottom: insets.bottom }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
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
  totalSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
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
