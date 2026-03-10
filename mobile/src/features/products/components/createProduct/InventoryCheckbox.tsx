import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "../../../../ui/theme";

interface InventoryCheckboxProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
}

export const InventoryCheckbox: React.FC<InventoryCheckboxProps> = ({
  value,
  onValueChange,
  label = "Quản lý tồn kho",
}) => {
  return (
    <TouchableOpacity
      onPress={() => onValueChange(!value)}
      style={styles.container}
    >
      <View style={[styles.checkbox, value && styles.checkboxChecked]}>
        {value && <Ionicons name="checkmark" size={16} color={colors.white} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
    backgroundColor: colors.white,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
  },
});
