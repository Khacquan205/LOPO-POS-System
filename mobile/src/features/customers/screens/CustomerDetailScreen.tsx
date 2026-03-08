import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { MainStackScreenProps } from "../../../types/navigation";
import { colors, spacing, typography, radius, shadow } from "../../../ui/theme";
import { useCustomersStore } from "../store/customers.store";
import type { CustomerStatus } from "../mock/customers.mock";
import { DeleteCustomerConfirmModal } from "../components/DeleteCustomerConfirmModal";
import { useToast } from "../../../ui/components";

type Props = MainStackScreenProps<"CustomerDetail">;

interface DetailRowProps {
  label: string;
  value: string;
  valueStyle?: object;
}

interface CustomerDetailViewModel {
  customerCode: string;
  name: string;
  phone: string;
  status: CustomerStatus;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, valueStyle }) => {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, valueStyle]}>{value}</Text>
    </View>
  );
};

const getStatusColor = (status: CustomerStatus): string => {
  if (status === "Ngừng hoạt động") return colors.warning;
  if (status === "Khóa tài khoản") return colors.error;
  return colors.success;
};

export const CustomerDetailScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const customers = useCustomersStore((state) => state.customers);
  const deleteCustomer = useCustomersStore((state) => state.deleteCustomer);
  const { showSuccessToast } = useToast();
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);

  const customerDetail = useMemo<CustomerDetailViewModel>(() => {
    const found = customers.find(
      (customer) => customer.id === route.params.customerId,
    );

    if (found) {
      return {
        customerCode: found.code,
        name: found.name,
        phone: found.phone,
        status: found.status,
      };
    }

    const fallbackCustomer: CustomerDetailViewModel = {
      customerCode: "CUS00000035",
      name: "Nguyễn Văn Thành",
      phone: "0365416503",
      status: "Đang hoạt động",
    };

    return fallbackCustomer;
  }, [customers, route.params.customerId]);

  const handleDeleteConfirm = () => {
    // Remove customer from store
    deleteCustomer(route.params.customerId);

    // Show success toast
    showSuccessToast("Xóa thành công!");

    // Close modal and navigate back
    setIsDeleteConfirmVisible(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.75}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{customerDetail.customerCode}</Text>

          <View style={styles.backButton} />
        </View>

        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate("EditCustomer", {
                customerId: route.params.customerId,
              })
            }
          >
            <Ionicons name="pencil" size={13} color={colors.white} />
            <Text style={styles.actionButtonText}>Chỉnh sửa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.85}
            onPress={() => setIsDeleteConfirmVisible(true)}
          >
            <Ionicons name="close-circle" size={13} color={colors.white} />
            <Text style={styles.actionButtonText}>Xóa</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.purchaseHistoryAction}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate("PurchaseHistory", {
              customerId: route.params.customerId,
              customerCode: customerDetail.customerCode,
            })
          }
        >
          <Ionicons name="time-outline" size={14} color={colors.secondary} />
          <Text style={styles.purchaseHistoryText}>Lịch sử mua hàng</Text>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <DetailRow label="Tên nhân viên" value={customerDetail.name} />
          <DetailRow label="Số điện thoại" value={customerDetail.phone} />
          <DetailRow
            label="Trạng thái"
            value={customerDetail.status}
            valueStyle={[
              styles.statusValue,
              { color: getStatusColor(customerDetail.status) },
            ]}
          />
        </View>
      </ScrollView>

      <DeleteCustomerConfirmModal
        visible={isDeleteConfirmVisible}
        customerName={customerDetail.name}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteConfirmVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop:
      Platform.OS === "android"
        ? (StatusBar.currentHeight ?? 0) + spacing.xs
        : spacing.sm,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.8,
    textAlign: "center",
    flex: 1,
  },
  actionButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    height: 34,
    minWidth: 104,
    gap: spacing.xs,
    ...shadow.sm,
  },
  actionButtonText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: "600",
  },
  purchaseHistoryAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  purchaseHistoryText: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: "500",
  },
  infoCard: {
    marginHorizontal: spacing.md,
    marginTop: spacing.xs,
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...shadow.sm,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm + spacing.xs,
  },
  detailLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: "500",
    flex: 1,
  },
  detailValue: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
  },
  statusValue: {
    fontWeight: "600",
  },
});
