import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../../ui/theme';

interface CustomerBarProps {
  customer?: { name: string; phone?: string };
  isEditable?: boolean;
  onPress?: () => void;
}

export const CustomerBar: React.FC<CustomerBarProps> = ({ customer, isEditable, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={isEditable ? onPress : undefined}
      activeOpacity={isEditable ? 0.7 : 1}
    >
      <Ionicons name="person-circle-outline" size={22} color={colors.linkOrange} style={styles.icon} />
      <Text style={styles.name} numberOfLines={1}>
        {customer?.name ?? 'Khách lẻ'}
      </Text>
      {customer?.phone ? (
        <Text style={styles.phone}>{customer.phone}</Text>
      ) : null}
      {isEditable && (
        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  icon: {
    marginRight: spacing.sm,
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.linkOrange,
  },
  phone: {
    fontSize: 13,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
});
