import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { colors, spacing, typography, radius, shadow } from "../../../ui/theme";

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelectOption?: (option: "active" | "inactive") => void;
}

const FILTER_OPTIONS: Array<{ key: "active" | "inactive"; label: string }> = [
  { key: "active", label: "Đang hoạt động" },
  { key: "inactive", label: "Không dùng nữa" },
];

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  visible,
  onClose,
  onSelectOption,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlayContainer}>
        <Pressable style={styles.overlay} onPress={onClose} />

        <View style={styles.bottomSheet}>
          <Text style={styles.title}>BỘ LỌC</Text>

          <View style={styles.optionList}>
            {FILTER_OPTIONS.map((option, index) => (
              <TouchableOpacity
                key={option.key}
                style={styles.optionRow}
                activeOpacity={0.7}
                onPress={() => onSelectOption?.(option.key)}
              >
                <Text style={styles.optionText}>{option.label}</Text>
                {index < FILTER_OPTIONS.length - 1 && (
                  <View style={styles.divider} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            activeOpacity={0.9}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  bottomSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md + spacing.xs,
    paddingBottom: spacing.lg,
    ...shadow.lg,
  },
  title: {
    ...typography.body,
    fontSize: 17,
    fontWeight: "600",
    color: colors.primary,
    textTransform: "uppercase",
    marginBottom: spacing.md,
  },
  optionList: {
    marginBottom: spacing.md,
  },
  optionRow: {
    paddingVertical: spacing.md,
  },
  optionText: {
    ...typography.body,
    fontSize: 15,
    fontWeight: "400",
    color: colors.textPrimary,
  },
  divider: {
    marginTop: spacing.md,
    height: 1,
    backgroundColor: colors.borderLight,
  },
  closeButton: {
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  closeButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: "600",
    fontSize: 16,
  },
});
