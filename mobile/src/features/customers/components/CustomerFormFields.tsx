import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, radius } from "../../../ui/theme";

interface CustomerFormFieldsProps {
  name: string;
  onChangeName: (text: string) => void;
  phone: string;
  onChangePhone: (text: string) => void;
  phoneError?: string;
  status: string;
  onPressStatus: () => void;
}

export const CustomerFormFields: React.FC<CustomerFormFieldsProps> = ({
  name,
  onChangeName,
  phone,
  onChangePhone,
  phoneError,
  status,
  onPressStatus,
}) => {
  return (
    <View style={styles.form}>
      {/* Tên nhân viên Field */}
      <View style={styles.fieldContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Tên nhân viên</Text>
          <Text style={styles.required}>*</Text>
        </View>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={onChangeName}
          placeholder="Nguyễn Văn Thành"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {/* Số điện thoại Field */}
      <View style={styles.fieldContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Số điện thoại</Text>
          <Text style={styles.required}>*</Text>
        </View>
        <TextInput
          style={[styles.input, phoneError ? styles.inputError : null]}
          value={phone}
          onChangeText={onChangePhone}
          placeholder="0365416503"
          placeholderTextColor={colors.textSecondary}
          keyboardType="phone-pad"
          maxLength={10}
        />
        {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
      </View>

      {/* Trạng thái Field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Trạng thái</Text>
        <TouchableOpacity
          style={styles.selectInput}
          activeOpacity={0.75}
          onPress={onPressStatus}
        >
          <Text style={styles.selectText}>{status}</Text>
          <Ionicons name="chevron-down" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  fieldContainer: {
    marginBottom: spacing.lg,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  required: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EF4444",
    marginLeft: 2,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    fontSize: 14,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  selectInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "500",
  },
});
