import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { ScreenHeader } from "../../../ui/components";
import { colors, spacing, typography } from "../../../ui/theme";
import { FilterChip, OrderRow, SearchBar } from "../components";
import {
  STATUS_FILTER_LABELS,
  type OrderStatusApi,
  type OrderRowData,
} from "../types/order.types";
import { useOrdersStore } from "../store/orders.store";
import { useAuthStore } from "../../../store/auth.store";
import type { ApiOrder } from "../../sales/services/orders.service";
import type { MainStackScreenProps } from "../../../types/navigation";

type FilterType = OrderStatusApi | "ALL";

const FILTER_OPTIONS: FilterType[] = ["ALL", "draft", "completed", "cancelled"];

function mapToRowData(order: ApiOrder): OrderRowData {
  return {
    id: order.order_id,
    code: order.order_code,
    status: order.status,
    createdAt: order.createdAt,
    grandTotal: order.grand_total,
  };
}

type Props = MainStackScreenProps<"Orders">;

export const OrdersScreen: React.FC<Props> = ({ navigation }) => {
  const { orders, isLoading, error, fetchOrders } = useOrdersStore();
  const token = useAuthStore((s) => s.accessToken);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("ALL");

  const load = useCallback(() => {
    if (token) fetchOrders(token);
  }, [token, fetchOrders]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredOrders = useMemo(() => {
    let result = orders;
    if (selectedFilter !== "ALL") {
      result = result.filter((o) => o.status === selectedFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((o) => o.order_code.toLowerCase().includes(q));
    }
    return [...result].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [orders, selectedFilter, searchQuery]);

  const getFilterCount = (filter: FilterType): number => {
    if (filter === "ALL") return orders.length;
    return orders.filter((o) => o.status === filter).length;
  };

  const handleOrderPress = (order: ApiOrder): void => {
    if (order.status === 'draft') {
      navigation.navigate('Sales', { draftOrderId: order.order_id, source: 'orders' });
    } else {
      navigation.navigate("OrderBillReadOnly", { orderId: order.order_id });
    }
  };

  const renderItem = ({ item }: { item: ApiOrder }) => (
    <OrderRow
      order={mapToRowData(item)}
      onPress={() => handleOrderPress(item)}
    />
  );

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {error ? error : "Không có đơn hàng nào"}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Đơn hàng" showBack />

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Nhập mã đơn"
      />

      {/* Filter Chips */}
      <View style={styles.filtersContainer}>
        <View style={styles.filtersRow}>
          {FILTER_OPTIONS.map((filter) => (
            <FilterChip
              key={filter}
              label={STATUS_FILTER_LABELS[filter]}
              count={getFilterCount(filter)}
              isSelected={selectedFilter === filter}
              onPress={() => setSelectedFilter(filter)}
            />
          ))}
        </View>
      </View>

      {/* Loading indicator */}
      {isLoading && orders.length === 0 && (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      )}

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.order_id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={filteredOrders.length === 0 && styles.emptyList}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={load}
            colors={[colors.primary]}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filtersContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  loader: {
    marginTop: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  emptyList: {
    flexGrow: 1,
  },
});
