import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';
import { customersMock, Customer } from '../mock/customers.mock';

export const CustomersScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customersMock;
    const query = searchQuery.toLowerCase().trim();
    return customersMock.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.phone.includes(query),
    );
  }, [searchQuery]);

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('vi-VN') + '₫';
  };

  const renderItem = ({ item }: { item: Customer }) => (
    <View style={styles.customerItem}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name.split(' ').slice(-1)[0][0]}
        </Text>
      </View>
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{item.name}</Text>
        <Text style={styles.customerPhone}>{item.phone}</Text>
      </View>
      <View style={styles.customerStats}>
        <Text style={styles.orderCount}>{item.totalOrders} đơn</Text>
        <Text style={styles.totalSpent}>{formatCurrency(item.totalSpent)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Khách hàng" showBack />

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Tìm khách hàng..."
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {/* Customer List */}
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    margin: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    ...typography.body,
    color: colors.textPrimary,
  },
  customerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.h3,
    color: colors.white,
    fontWeight: '700',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  customerPhone: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  customerStats: {
    alignItems: 'flex-end',
  },
  orderCount: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  totalSpent: {
    ...typography.body,
    color: colors.linkOrange,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.md + 48 + spacing.md,
  },
});
