import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';
import { staffMock, Staff, ROLE_LABELS } from '../mock/staff.mock';

export const StaffScreen: React.FC = () => {
  const renderItem = ({ item }: { item: Staff }) => (
    <View style={styles.staffItem}>
      <View style={[styles.avatar, !item.isActive && styles.avatarInactive]}>
        <Ionicons
          name="person"
          size={24}
          color={item.isActive ? colors.white : colors.textSecondary}
        />
      </View>
      <View style={styles.staffInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.staffName}>{item.name}</Text>
          {!item.isActive && (
            <View style={styles.inactiveBadge}>
              <Text style={styles.inactiveText}>Nghỉ việc</Text>
            </View>
          )}
        </View>
        <Text style={styles.staffPhone}>{item.phone}</Text>
      </View>
      <View style={styles.roleContainer}>
        <Text style={styles.roleText}>{ROLE_LABELS[item.role]}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Nhân viên" showBack />

      {/* Staff List */}
      <FlatList
        data={staffMock}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingTop: spacing.sm,
  },
  staffItem: {
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
  avatarInactive: {
    backgroundColor: colors.surfaceSecondary,
  },
  staffInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  staffName: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  inactiveBadge: {
    backgroundColor: colors.error + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: spacing.sm,
  },
  inactiveText: {
    ...typography.caption,
    color: colors.error,
    fontSize: 10,
  },
  staffPhone: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  roleContainer: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  roleText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.md + 48 + spacing.md,
  },
});
