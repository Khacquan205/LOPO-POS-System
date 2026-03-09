import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TextInput, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';
import { Staff } from '../mock/staff.mock';
import { useStaffStore } from '../store/staff.store';
import type { MainStackScreenProps } from '../../../types/navigation';

type Props = MainStackScreenProps<'Staff'>;

export const StaffScreen: React.FC<Props> = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const staffList = useStaffStore((s) => s.staffList);

  const filtered = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search),
  );

  const renderItem = ({ item }: { item: Staff }) => (
    <TouchableOpacity
      style={styles.staffItem}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('StaffDetail', { staffId: item.id })}
    >
      {/* Row 1: date + status */}
      <View style={styles.topRow}>
        <Text style={styles.createdAt}>{item.createdAt}</Text>
        <Text style={[styles.statusText, item.isActive ? styles.active : styles.inactive]}>
          {item.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
        </Text>
      </View>
      {/* Row 2: name */}
      <Text style={styles.staffName}>{item.name}</Text>
      {/* Row 3: code + phone */}
      <View style={styles.bottomRow}>
        <Text style={styles.staffCode}>{item.staffCode}</Text>
        <View style={styles.phoneRow}>
          <Ionicons name="call-outline" size={13} color={colors.textSecondary} />
          <Text style={styles.staffPhone}> {item.phone}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="QUẢN LÝ NHÂN VIÊN"
        showBack
        rightIcon="options-outline"
      />

      {/* Pending tab */}
      <TouchableOpacity style={styles.pendingTab} onPress={() => navigation.navigate('StaffApproval')}>
        <Text style={styles.pendingText}>Danh sách chờ duyệt</Text>
      </TouchableOpacity>

      {/* Search bar */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Nhập tên nhân viên hoặc số điện thoại"
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
      </View>

      {/* Staff List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateStaff')}>
        <Ionicons name="add" size={28} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pendingTab: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  pendingText: {
    ...typography.body,
    color: colors.secondary,
    fontWeight: '500',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.background,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.textPrimary,
  },
  listContent: {
    paddingBottom: 100,
  },
  staffItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  createdAt: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '500',
  },
  active: {
    color: colors.success,
  },
  inactive: {
    color: colors.textSecondary,
  },
  staffName: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  staffCode: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  staffPhone: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.md + 48 + spacing.md,
  },
});
