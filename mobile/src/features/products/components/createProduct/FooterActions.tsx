import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../../../../ui/theme";

interface FooterActionsProps {
  onCancelPress?: () => void;
  onCreatePress?: () => void;
}

export const FooterActions: React.FC<FooterActionsProps> = ({
  onCancelPress,
  onCreatePress,
}) => {
  return (
    <View style={styles.container}>
      {/* Cancel Button */}
      <TouchableOpacity onPress={onCancelPress} style={styles.cancelButton}>
        <Ionicons name="close-circle" size={16} color="#FFA500" />
        <Text style={styles.cancelText}>Hủy</Text>
      </TouchableOpacity>

      {/* Create Button */}
      <TouchableOpacity onPress={onCreatePress} style={styles.createButton}>
        <Text style={styles.createText}>Tạo mới</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xl,
  },
  cancelButton: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: spacing.lg,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFA500",
    marginLeft: spacing.sm,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  createText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
});
