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
import type { CustomerStatus } from "../mock/customers.mock";

interface StatusBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelectStatus: (status: CustomerStatus) => void;
  currentStatus: CustomerStatus;
}

const STATUS_OPTIONS: CustomerStatus[] = [
  "Đang hoạt động",
  "Ngừng hoạt động",
  "Khóa tài khoản",
];

export const StatusBottomSheet: React.FC<StatusBottomSheetProps> = ({
  visible,
  onClose,
  onSelectStatus,
  currentStatus,
}) => {
  const handleSelectStatus = (status: CustomerStatus) => {
    onSelectStatus(status);
    onClose();
  };

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
          <Text style={styles.title}>CHỌN TRẠNG THÁI</Text>

          <View style={styles.optionList}>
            {STATUS_OPTIONS.map((status, index) => (
              <React.Fragment key={status}>
                <TouchableOpacity
                  style={styles.optionRow}
                  activeOpacity={0.7}
                  onPress={() => handleSelectStatus(status)}
                >
                  <Text style={styles.optionText}>{status}</Text>
                </TouchableOpacity>
                {index < STATUS_OPTIONS.length - 1 && (
                  <View style={styles.divider} />
                )}
              </React.Fragment>
            ))}
          </View>
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
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.md,
    paddingTop: 20,
    paddingBottom: spacing.md,
    ...shadow.lg,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.primary,
    textTransform: "uppercase",
    marginBottom: spacing.md,
    letterSpacing: 0.3,
  },
  optionList: {
    marginBottom: spacing.xs,
  },
  optionRow: {
    paddingVertical: 15,
  },
  optionText: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: "#E8E8E8",
    marginTop: 1,
  },
});
