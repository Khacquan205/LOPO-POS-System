import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { ScreenHeader } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';
import { FilterChip, OrderRow, SearchBar } from '../components';
import {
  ordersMock,
  Order,
  OrderStatus,
  OrderStatusType,
  STATUS_FILTER_LABELS,
  getOrderCountByStatus,
} from '../mock/orders.mock';

type FilterType = OrderStatusType | 'ALL';

const FILTER_OPTIONS: FilterType[] = ['ALL', 'DRAFT', 'NEW', 'COMPLETED', 'CANCELLED'];

export const OrdersScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('ALL');

  // Filter orders based on status and search query
  const filteredOrders = useMemo(() => {
    let result = ordersMock;

    // Filter by status
    if (selectedFilter !== 'ALL') {
      result = result.filter((order) => order.status === selectedFilter);
    }

    // Filter by search query (code)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((order) =>
        order.code.toLowerCase().includes(query),
      );
    }

    // Sort by createdAt descending (newest first)
    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [selectedFilter, searchQuery]);

  // Get counts for each filter
  const getFilterCount = (filter: FilterType): number => {
    if (filter === 'ALL') return ordersMock.length;
    return getOrderCountByStatus(ordersMock, filter);
  };

  const handleOrderPress = (order: Order): void => {
    // TODO: Navigate to order detail
    console.log('Order pressed:', order.code);
  };

  const handleFilterPress = (): void => {
    // TODO: Open filter modal
    console.log('Filter pressed');
  };

  const renderItem = ({ item }: { item: Order }) => (
    <OrderRow order={item} onPress={() => handleOrderPress(item)} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Không có đơn hàng nào</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Đơn hàng"
        showBack
        rightIcon="funnel-outline"
        onRightPress={handleFilterPress}
      />

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

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={filteredOrders.length === 0 && styles.emptyList}
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
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
