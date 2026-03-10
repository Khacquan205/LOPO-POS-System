import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "../../../../ui/theme";

interface BarcodeFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onScanPress?: () => void;
  required?: boolean;
}

export const BarcodeField: React.FC<BarcodeFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onScanPress,
  required = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.required}>*</Text>}
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          keyboardType="numeric"
        />
        <TouchableOpacity onPress={onScanPress} style={styles.scanButton}>
          <Ionicons name="qr-code" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    height: 52,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
  },
  scanButton: {
    paddingRight: spacing.md,
    paddingLeft: spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
});
