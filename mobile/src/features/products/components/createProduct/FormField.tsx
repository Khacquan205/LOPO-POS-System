import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../../../../ui/theme";

interface FormFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  required?: boolean;
  keyboardType?: "default" | "numeric" | "decimal-pad" | "number-pad";
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  required = false,
  keyboardType = "default",
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.required}>*</Text>}
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
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
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.textPrimary,
    height: 52,
  },
});
