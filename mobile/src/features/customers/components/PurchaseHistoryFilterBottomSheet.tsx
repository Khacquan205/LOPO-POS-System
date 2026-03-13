import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, radius, shadow } from "../../../ui/theme";

type OrderStatusType = "all" | "draft" | "new" | "completed" | "cancelled";

interface PurchaseHistoryFilterBottomSheetProps {
  visible: boolean;
  selectedFilter: OrderStatusType;
  onSelectFilter: (filter: OrderStatusType) => void;
  onClose: () => void;
}

const FILTER_OPTIONS: { label: string; value: OrderStatusType }[] = [
  { label: "Tất cả", value: "all" },
  { label: "Đơn nháp", value: "draft" },
  { label: "Đơn mới", value: "new" },
  { label: "Hoàn thành", value: "completed" },
  { label: "Đã hủy", value: "cancelled" },
];

export const PurchaseHistoryFilterBottomSheet: React.FC<
  PurchaseHistoryFilterBottomSheetProps
> = ({ visible, selectedFilter, onSelectFilter, onClose }) => {
  const handleSelectFilter = (filter: OrderStatusType) => {
    onSelectFilter(filter);
  };

  const renderFilterOption = ({
    item,
    index,
  }: {
    item: { label: string; value: OrderStatusType };
    index: number;
  }) => {
    const isSelected = selectedFilter === item.value;

    return (
      <View>
        <TouchableOpacity
          style={styles.optionRow}
          activeOpacity={0.7}
          onPress={() => handleSelectFilter(item.value)}
        >
          <Text
            style={[styles.optionText, isSelected && styles.optionTextSelected]}
          >
            {item.label}
          </Text>

          {isSelected && (
            <Ionicons
              name="checkmark"
              size={20}
              color={colors.primary}
              style={styles.checkIcon}
            />
          )}
        </TouchableOpacity>

        {index < FILTER_OPTIONS.length - 1 && <View style={styles.divider} />}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Dark Overlay */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Bottom Sheet */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.bottomSheet}>
          {/* Title */}
          <Text style={styles.title}>BỘ LỌC</Text>

          {/* Filter Options List */}
          <FlatList
            data={FILTER_OPTIONS}
            keyExtractor={(item) => item.value}
            renderItem={renderFilterOption}
            scrollEnabled={false}
            style={styles.optionsList}
          />

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            activeOpacity={0.85}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.black,
    opacity: 0.4,
  },
  safeArea: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    ...shadow.lg,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: spacing.lg,
    textAlign: "left",
  },
  optionsList: {
    marginBottom: spacing.lg,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
  },
  optionText: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.textPrimary,
    flex: 1,
  },
  optionTextSelected: {
    fontWeight: "500",
    color: colors.primary,
  },
  checkIcon: {
    marginLeft: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  closeButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    marginTop: spacing.md,
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.white,
  },
});
