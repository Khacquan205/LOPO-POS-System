import React, { useMemo, useState, useEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { MainStackScreenProps } from "../../../types/navigation";
import { colors, spacing } from "../../../ui/theme";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import { CustomerItem } from "../components/CustomerItem";
import { FloatingActionButton } from "../../products/components/FloatingActionButton";
import { SuccessToast } from "../../../ui/components";
import { CustomerFilterBottomSheet } from "../components/CustomerFilterBottomSheet";
import type { Customer, CustomerStatus } from "../mock/customers.mock";
import { useCustomersStore } from "../store/customers.store";

type FilterStatusType = "Tất cả" | CustomerStatus;

type Props = MainStackScreenProps<"Customers">;

export const CustomersScreen: React.FC<Props> = ({ route, navigation }) => {
  const customers = useCustomersStore((state) => state.customers);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("Thêm mới thành công!");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState<FilterStatusType>("Tất cả");

  useEffect(() => {
    if (route.params?.showCreateSuccessToast || route.params?.successMessage) {
      setToastMessage(route.params?.successMessage ?? "Thêm mới thành công!");
      setToastVisible(true);
      navigation.setParams({
        showCreateSuccessToast: undefined,
        successMessage: undefined,
      });
    }
  }, [
    route.params?.showCreateSuccessToast,
    route.params?.successMessage,
    navigation,
  ]);

  const filteredCustomers = useMemo(() => {
    let result = customers;

    // Apply status filter
    if (selectedStatusFilter !== "Tất cả") {
      result = result.filter(
        (customer) => customer.status === selectedStatusFilter,
      );
    }

    // Apply search filter
    if (!searchQuery.trim()) return result;
    const query = searchQuery.toLowerCase().trim();
    return result.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.phone.includes(query),
    );
  }, [searchQuery, customers, selectedStatusFilter]);

  const renderItem = ({ item }: { item: Customer }) => (
    <CustomerItem
      customer={item}
      onPress={() =>
        navigation.navigate("CustomerDetail", { customerId: item.id })
      }
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Header
            onBackPress={() => navigation.goBack()}
            onFilterPress={() => setIsFilterVisible(true)}
          />
        </View>

        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        <FlatList
          data={filteredCustomers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
        />
      </View>

      <FloatingActionButton
        onPress={() => navigation.navigate("CreateCustomer")}
      />

      {/* Success Toast */}
      <SuccessToast
        visible={toastVisible}
        message={toastMessage}
        onHide={() => setToastVisible(false)}
      />

      {/* Filter Bottom Sheet */}
      <CustomerFilterBottomSheet
        visible={isFilterVisible}
        selectedFilter={selectedStatusFilter}
        onSelectFilter={setSelectedStatusFilter}
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
    marginBottom: spacing.xs,
  },
  listContent: {
    paddingBottom: 92,
  },
  separator: {
    height: 1,
    marginLeft: spacing.md,
    marginRight: spacing.md,
    backgroundColor: colors.borderLight,
  },
});
