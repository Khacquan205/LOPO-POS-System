import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing } from '../../../ui/theme';
import type { Customer } from '../mock/customers.mock';

interface Props {
  customer: Customer;
  onPress: () => void;
}

export const CustomerListItem: React.FC<Props> = ({ customer, onPress }) => (
  <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.left}>
      <Text style={styles.name}>{customer.name}</Text>
      <Text style={styles.code}>{customer.code}</Text>
    </View>
    <Text style={styles.phone}>{customer.phone}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: '#ffffff',
  },
  left: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  code: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  phone: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
