import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, radius, shadow } from "../../../ui/theme";

interface DeleteCustomerConfirmModalProps {
  visible: boolean;
  customerName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteCustomerConfirmModal: React.FC<
  DeleteCustomerConfirmModalProps
> = ({ visible, customerName = "khách hàng", onConfirm, onCancel }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Dark overlay */}
        <View style={styles.overlay} />

        {/* Modal container */}
        <View style={styles.centerContainer}>
          {/* Icon container with double-circle effect */}
          <View style={styles.iconWrapper}>
            {/* Light circle background */}
            <View style={styles.iconBackgroundLight} />

            {/* Dark circle with icon */}
            <View style={styles.iconBackgroundDark}>
              <Ionicons
                name="information-circle"
                size={40}
                color={colors.white}
              />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Xác nhận xóa khách hàng!</Text>

          {/* Message */}
          <Text style={styles.message}>
            Bạn có chắc muốn xóa khách hàng này không?{"\n"}Hành động này không
            thể hoàn tác
          </Text>

          {/* Action buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.7}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>CANCEL</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmButton}
              activeOpacity={0.7}
              onPress={onConfirm}
            >
              <Text style={styles.confirmButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.black,
    opacity: 0.5,
  },
  centerContainer: {
    width: "85%",
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.md,
  },
  iconWrapper: {
    marginBottom: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: 120,
    height: 120,
  },
  iconBackgroundLight: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.secondary,
    opacity: 0.15,
  },
  iconBackgroundDark: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.secondary,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: "center",
    lineHeight: 22,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    textTransform: "uppercase",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderLeftWidth: 1,
    borderLeftColor: colors.borderLight,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    textTransform: "uppercase",
  },
});
