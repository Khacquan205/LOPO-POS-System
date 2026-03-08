import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, spacing, typography, radius, shadow } from "../../../ui/theme";

interface BulkActionBarProps {
  selectedCount: number;
  onDeletePress: () => void;
  onCancelPress: () => void;
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  onDeletePress,
  onCancelPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.deleteButton}
        activeOpacity={0.85}
        onPress={onDeletePress}
      >
        <Text style={styles.deleteText}>{`Xóa (${selectedCount})`}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        activeOpacity={0.85}
        onPress={onCancelPress}
      >
        <Text style={styles.cancelText}>Hủy</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    flexDirection: "row",
    gap: spacing.sm,
    backgroundColor: colors.white,
    padding: spacing.sm,
    borderRadius: radius.lg,
    ...shadow.md,
  },
  deleteButton: {
    flex: 1,
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: {
    ...typography.body,
    color: colors.white,
    fontWeight: "600",
  },
  cancelText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "600",
  },
});
