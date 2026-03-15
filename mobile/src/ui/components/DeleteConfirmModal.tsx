import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, spacing, typography } from "../theme";

interface DeleteConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  const normalizedMessage = message.replace(/\\n|\/n/g, "\n");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalBox}>
          <View style={styles.iconOuter}>
            <View style={styles.iconInner}>
              <Text style={styles.iconText}>i</Text>
            </View>
          </View>

          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalBody}>{normalizedMessage}</Text>

          <View style={styles.modalDivider} />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalBtnCancel}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.modalBtnCancelText}>CANCEL</Text>
            </TouchableOpacity>

            <View style={styles.modalBtnDivider} />

            <TouchableOpacity
              style={styles.modalBtnOk}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.modalBtnOkText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  modalBox: {
    backgroundColor: colors.white,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
    paddingTop: spacing.xl,
    overflow: "hidden",
  },
  iconOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FEE9CE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  iconInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F59E0B",
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 30,
  },
  modalTitle: {
    ...typography.body,
    color: "#F59E0B",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  modalBody: {
    ...typography.body,
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  modalDivider: {
    height: 1,
    backgroundColor: colors.border,
    width: "100%",
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
  },
  modalBtnCancel: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
  },
  modalBtnCancelText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "700",
  },
  modalBtnDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  modalBtnOk: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
  },
  modalBtnOkText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "700",
  },
});
