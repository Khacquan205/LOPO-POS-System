import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "../../../ui/theme";

interface Props {
  visible: boolean;
  orderCode: string;
  formattedTotal: string;
  onOk: () => void;
  title?: string;
  message?: string;
}

export const PaymentSuccessModal: React.FC<Props> = ({
  visible,
  orderCode,
  formattedTotal,
  onOk,
  title,
  message,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onOk}
  >
    <View style={styles.overlay}>
      <View style={styles.dialog}>
        {/* Green check icon circle */}
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={30} color="#ffffff" />
        </View>

        <Text style={styles.title}>{title ?? "Thanh toán thành công!"}</Text>
        <Text style={styles.body}>
          {message ??
            `Đã thanh toán thành công ${formattedTotal} cho đơn hàng ${orderCode}`}
        </Text>

        <TouchableOpacity
          style={styles.okBtn}
          onPress={onOk}
          activeOpacity={0.8}
        >
          <Text style={styles.okText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  dialog: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.xl + spacing.lg,
    alignItems: "center",
    width: "100%",
  },
  iconCircle: {
    position: "absolute",
    top: -(spacing.lg + spacing.sm),
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#22C55E",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#22C55E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  okBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: spacing.sm + 4,
    width: "100%",
    alignItems: "center",
  },
  okText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
});
