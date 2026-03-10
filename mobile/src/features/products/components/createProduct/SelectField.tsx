import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "../../../../ui/theme";

interface SelectFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onPress?: () => void;
  required?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  placeholder,
  value,
  onPress,
  required = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.required}>*</Text>}
      </View>
      <TouchableOpacity onPress={onPress} style={styles.selectButton}>
        <Text style={[styles.selectText, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  labelContainer: {
    flexDirection: "row",
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  required: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EF4444",
    marginLeft: 4,
  },
  selectButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: "400",
  },
  placeholder: {
    color: colors.textSecondary,
  },
});
