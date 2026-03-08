import React, { useState, useMemo, useCallback } from "react";
import { View, FlatList, SafeAreaView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import { CategoryChips } from "../components/CategoryChips";
import { ProductItem } from "../components/ProductItem";
import { FloatingActionButton } from "../components/FloatingActionButton";
import { FilterBottomSheet } from "../components/FilterBottomSheet";
import { BulkActionBar } from "../components/BulkActionBar";
import { SuccessToast } from "../../../ui/components";
import { categoriesMock } from "../mock/productManagement.mock";
import { useProductsStore } from "../store/products.store";
import type { MainStackScreenProps } from "../../../types/navigation";

// ============================================================================
// MAIN SCREEN COMPONENT
// ============================================================================

type Props = MainStackScreenProps<"Products">;

export const ProductManagementScreen: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const products = useProductsStore((state) => state.products);
  const removeProducts = useProductsStore((state) => state.removeProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [filterVisible, setFilterVisible] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastVisible, setToastVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.showDeleteSuccessToast) {
        setToastVisible(true);
        navigation.setParams({ showDeleteSuccessToast: undefined });
      }
    }, [route.params?.showDeleteSuccessToast, navigation]),
  );

  const categoryOptions = useMemo(
    () => [
      { id: "all", name: "Tất cả", color: "#EFA442" },
      { id: "1", name: "Bánh kẹo", color: "#FFA500" },
      { id: "2", name: "Thức uống", color: "#20B2AA" },
      { id: "3", name: "Văn phòng phẩm", color: "#228B22" },
      { id: "4", name: "Vệ sinh cá nhân", color: "#DA70D6" },
    ],
    [],
  );

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(query));
    }

    // Filter by category
    if (selectedCategoryId && selectedCategoryId !== "all") {
      filtered = filtered.filter(
        (p) =>
          categoriesMock.find((c) => c.id === selectedCategoryId)?.name ===
          p.category,
      );
    }

    return filtered;
  }, [searchQuery, selectedCategoryId, products]);

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("MainTabs", { screen: "Home" });
  };

  const handleFilterPress = () => {
    setFilterVisible(true);
  };

  const handleCloseFilter = () => {
    setFilterVisible(false);
  };

  const handleFABPress = () => {
    navigation.navigate("CreateProduct");
  };

  const handleOpenProductDetail = (productId: string) => {
    navigation.navigate("ProductDetail", { productId });
  };

  const handleEnterSelectionMode = (productId: string) => {
    setIsSelectionMode(true);
    setSelectedIds((prev) =>
      prev.includes(productId) ? prev : [...prev, productId],
    );
  };

  const handleToggleSelection = (productId: string) => {
    setSelectedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const handleCancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;

    removeProducts(selectedIds);
    setToastVisible(true);
    setIsSelectionMode(false);
    setSelectedIds([]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <Header
          onBackPress={handleBackPress}
          onFilterPress={handleFilterPress}
        />

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          iconPosition="right"
        />

        {/* Category Chips */}
        <CategoryChips
          categories={categoryOptions}
          selectedId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          compact
        />

        {/* Product List */}
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductItem
              product={item}
              selectionMode={isSelectionMode}
              selected={selectedIds.includes(item.id)}
              onLongPress={() =>
                isSelectionMode
                  ? handleToggleSelection(item.id)
                  : handleEnterSelectionMode(item.id)
              }
              onPress={
                isSelectionMode
                  ? () => handleToggleSelection(item.id)
                  : () => handleOpenProductDetail(item.id)
              }
              onToggleSelect={() => handleToggleSelection(item.id)}
            />
          )}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          contentContainerStyle={[
            styles.listContent,
            isSelectionMode && styles.listContentSelection,
          ]}
        />
      </View>

      {/* Floating Action Button */}
      <FloatingActionButton onPress={handleFABPress} />

      {/* Bulk Action Bar */}
      {isSelectionMode && (
        <BulkActionBar
          selectedCount={selectedIds.length}
          onDeletePress={handleBulkDelete}
          onCancelPress={handleCancelSelection}
        />
      )}

      {/* Success Toast */}
      <SuccessToast
        visible={toastVisible}
        message="Xóa sản phẩm thành công!"
        onHide={() => setToastVisible(false)}
      />

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet visible={filterVisible} onClose={handleCloseFilter} />
    </SafeAreaView>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  listContent: {
    paddingTop: 0,
  },
  listContentSelection: {
    paddingBottom: 104,
  },
});
