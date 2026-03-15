import React from "react";
import { View, Text, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { colors, spacing } from "../../../ui/theme";

interface Props {
  qrValue: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
}

export const TransferQrCard: React.FC<Props> = ({
  qrValue,
  accountName,
  accountNumber,
  bankName,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Thông tin chuyển khoản:</Text>

      <View style={styles.qrWrapper}>
        <View style={styles.qrFrame}>
          <QRCode value={qrValue} size={220} />
        </View>
      </View>

      <Text style={styles.accountName}>{accountName}</Text>
      <Text style={styles.accountNumber}>Tài khoản: {accountNumber}</Text>
      <Text style={styles.bankName}>{bankName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderRadius: 14,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  qrWrapper: {
    marginBottom: spacing.md,
  },
  qrFrame: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 24,
    overflow: "hidden",
    padding: 14,
    backgroundColor: "#ffffff",
  },
  accountName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#16324F",
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  accountNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#16324F",
    marginBottom: spacing.sm,
  },
  bankName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#16324F",
    textAlign: "center",
    lineHeight: 20,
  },
});
