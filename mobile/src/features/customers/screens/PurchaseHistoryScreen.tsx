import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { MainStackScreenProps } from "../../../types/navigation";
import { colors, spacing, typography, radius } from "../../../ui/theme";
import { PurchaseHistoryFilterBottomSheet } from "../components/PurchaseHistoryFilterBottomSheet";

type Props = MainStackScreenProps<"PurchaseHistory">;

type OrderStatus = "draft" | "new" | "completed" | "cancelled";
type FilterKey = "all" | "draft" | "new" | "completed" | "cancelled";

interface OrderHistoryItem {
  id: string;
  statusKey: OrderStatus;
  statusLabel: string;
  orderCode: string;
  dateTime: string;
  amount: string;
}

interface StatusChip {
  key: FilterKey;
  label: string;
  count: number;
}

const STATUS_CHIPS: StatusChip[] = [
  { key: "all", label: "Tất cả", count: 35 },
  { key: "draft", label: "Nháp", count: 1 },
  { key: "new", label: "Mới", count: 3 },
  { key: "completed", label: "Hoàn thành", count: 27 },
  { key: "cancelled", label: "Hủy", count: 3 },
];

const ORDER_HISTORY_MOCK: OrderHistoryItem[] = [
  {
    id: "1",
    statusKey: "draft",
    statusLabel: "Đơn nháp",
    orderCode: "SO0000015",
    dateTime: "20/10/2025 11:05:00",
    amount: "50,000",
  },
  {
    id: "2",
    statusKey: "new",
    statusLabel: "Đơn mới",
    orderCode: "SO0000014",
    dateTime: "20/10/2025 11:05:00",
    amount: "60,000",
  },
  {
    id: "3",
    statusKey: "completed",
    statusLabel: "Hoàn thành",
    orderCode: "SO0000013",
    dateTime: "20/10/2025 11:05:00",
    amount: "20,000",
  },
  {
    id: "4",
    statusKey: "new",
    statusLabel: "Đơn mới",
    orderCode: "SO0000012",
    dateTime: "20/10/2025 11:05:00",
    amount: "20,000",
  },
  {
    id: "5",
    statusKey: "completed",
    statusLabel: "Hoàn thành",
    orderCode: "SO0000011",
    dateTime: "20/10/2025 11:05:00",
    amount: "110,000",
  },
  {
    id: "6",
    statusKey: "cancelled",
    statusLabel: "Đã hủy",
    orderCode: "SO0000010",
    dateTime: "20/10/2025 11:05:00",
    amount: "110,000",
  },
];

const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case "draft":
      return colors.textSecondary;
    case "new":
      return colors.primary;
    case "completed":
      return colors.success;
    case "cancelled":
      return colors.error;
    default:
      return colors.textSecondary;
  }
};

export const PurchaseHistoryScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>("all");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const filteredOrders = useMemo(() => {
    return ORDER_HISTORY_MOCK.filter((order) => {
      const matchesFilter =
        selectedFilter === "all" || order.statusKey === selectedFilter;
      const matchesSearch =
        searchQuery.trim().length === 0 ||
        order.orderCode
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim());

      return matchesFilter && matchesSearch;
    });
  }, [searchQuery, selectedFilter]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIconButton}
            activeOpacity={0.75}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>LỊCH SỬ MUA HÀNG</Text>

          <TouchableOpacity
            style={styles.headerIconButton}
            activeOpacity={0.75}
            onPress={() => setIsFilterVisible(true)}
          >
            <Ionicons name="funnel-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Nhập mã đơn"
            placeholderTextColor={colors.textDisabled}
          />
          <Ionicons
            name="search-outline"
            size={19}
            color={colors.textDisabled}
          />
        </View>

        <View style={styles.chipsContainer}>
          {STATUS_CHIPS.map((chip) => {
            const isSelected = chip.key === selectedFilter;
            return (
              <TouchableOpacity
                key={chip.key}
                activeOpacity={0.85}
                onPress={() => setSelectedFilter(chip.key)}
                style={[
                  styles.chip,
                  isSelected ? styles.chipSelected : styles.chipUnselected,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected
                      ? styles.chipTextSelected
                      : styles.chipTextUnselected,
                  ]}
                >
                  {chip.label} {chip.count}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.orderItem}
              activeOpacity={0.8}
              onPress={() => console.log("Open order", item.orderCode)}
            >
              <View style={styles.leftBlock}>
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(item.statusKey) },
                  ]}
                >
                  {item.statusLabel}
                </Text>
                <Text style={styles.orderCodeText}>{item.orderCode}</Text>
              </View>

              <View style={styles.rightBlock}>
                <Text style={styles.dateText}>{item.dateTime}</Text>
                <Text style={styles.amountText}>{item.amount}</Text>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>

      {/* Filter Bottom Sheet */}
      <PurchaseHistoryFilterBottomSheet
        visible={isFilterVisible}
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
        onClose={() => setIsFilterVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  container: {
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
    paddingBottom: spacing.sm,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    flex: 1,
    textAlign: "center",
  },
  searchContainer: {
    marginHorizontal: spacing.md,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontStyle: "italic",
    paddingVertical: 0,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  chip: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + spacing.xs,
    paddingVertical: spacing.xs + 1,
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipUnselected: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "500",
  },
  chipTextSelected: {
    color: colors.white,
  },
  chipTextUnselected: {
    color: colors.textSecondary,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + spacing.xs,
  },
  leftBlock: {
    flex: 1,
  },
  rightBlock: {
    alignItems: "flex-end",
  },
  statusText: {
    ...typography.caption,
    fontWeight: "500",
    marginBottom: spacing.xs,
  },
  orderCodeText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  dateText: {
    ...typography.caption,
    color: colors.textDisabled,
    marginBottom: spacing.xs,
  },
  amountText: {
    ...typography.body,
    color: colors.secondary,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.md,
  },
});
