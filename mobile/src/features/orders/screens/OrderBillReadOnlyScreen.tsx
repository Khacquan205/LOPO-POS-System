import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader, Button } from '../../../ui/components';
import { colors, spacing } from '../../../ui/theme';
import { OrderStatusChip, OrderProductRow, CustomerBar } from '../components';
import { getOrderById, formatCurrencyVND, formatDateTime } from '../mock/orders.mock';
import type { MainStackScreenProps } from '../../../types/navigation';

type Props = MainStackScreenProps<'OrderBillReadOnly'>;

export const OrderBillReadOnlyScreen: React.FC<Props> = ({ navigation, route }) => {
  const { orderId } = route.params;
  const insets = useSafeAreaInsets();
  const order = getOrderById(orderId);

  if (!order) {
    return (
      <View style={styles.notFound}>
        <ScreenHeader title="Đơn hàng" showBack />
        <Text style={styles.notFoundText}>Không tìm thấy đơn hàng</Text>
      </View>
    );
  }

  const totalItems = order.items.reduce((sum, it) => sum + it.quantity, 0);
  const canViewSummary = order.status === 'NEW';

  return (
    <View style={styles.container}>
      <ScreenHeader title={order.code} showBack />

      {/* Status + date row */}
      <View style={styles.statusRow}>
        <OrderStatusChip status={order.status} />
        <Text style={styles.dateText}>{formatDateTime(order.createdAt)}</Text>
      </View>

      {/* Product list */}
      <FlatList
        data={order.items}
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
              <Text style={styles.totalValue}>{formatCurrencyVND(order.total)}</Text>
            </View>
          </View>
        }
      />

      {/* Customer bar */}
      <CustomerBar customer={order.customer} isEditable={false} />

      {/* Footer - show for NEW orders */}
      {canViewSummary && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <Button
            title="Xem chi tiết thanh toán"
            onPress={() => navigation.navigate('OrderSummary', { orderId })}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  footer: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
});
