import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../../../ui/theme";
import type { Customer } from "../mock/customers.mock";

interface CustomerItemProps {
  customer: Customer;
  onPress?: () => void;
}

export const CustomerItem: React.FC<CustomerItemProps> = ({
  customer,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.customerRow}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.leftColumn}>
        <Text style={styles.customerName}>{customer.name}</Text>
        <Text style={styles.customerCode}>{customer.code}</Text>
      </View>

      <View style={styles.phoneGroup}>
        <Ionicons name="call-outline" size={14} color={colors.textSecondary} />
        <Text style={styles.phoneText}>{customer.phone}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  customerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: "#F6F6F6",
  },
  leftColumn: {
    flex: 1,
    paddingRight: spacing.md,
  },
  customerName: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "500",
    marginBottom: spacing.xs,
  },
  customerCode: {
    ...typography.caption,
    color: colors.textDisabled,
    letterSpacing: 0.5,
  },
  phoneGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  phoneText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
