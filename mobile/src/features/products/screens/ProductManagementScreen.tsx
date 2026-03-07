import React, { useState, useMemo } from "react";
import { View, FlatList, SafeAreaView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import { CategoryChips } from "../components/CategoryChips";
import { ProductItem } from "../components/ProductItem";
import { FloatingActionButton } from "../components/FloatingActionButton";
import { SuccessToast, useToast } from "../../../ui/components";
import { categoriesMock, productsMock } from "../mock/productManagement.mock";
import type { MainStackParamList } from "../../../types/navigation";

// ============================================================================
// MAIN SCREEN COMPONENT
// ============================================================================

export const ProductManagementScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { toastVisible, toastMessage, hideToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>();

  const filteredProducts = useMemo(() => {
    let filtered = productsMock;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(query));
    }

    // Filter by category
    if (selectedCategoryId) {
      filtered = filtered.filter(
        (p) =>
          categoriesMock.find((c) => c.id === selectedCategoryId)?.name ===
          p.category,
      );
    }

    return filtered;
  }, [searchQuery, selectedCategoryId]);

  const handleBackPress = () => {
    // Navigation back logic - to be implemented by router
    console.log("Back pressed");
  };

  const handleFilterPress = () => {
    console.log("Filter pressed");
  };

  const handleFABPress = () => {
    navigation.navigate("CreateProduct");
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
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        {/* Category Chips */}
        <CategoryChips
          categories={categoriesMock}
          selectedId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />

        {/* Product List */}
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ProductItem product={item} />}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* Floating Action Button */}
      <FloatingActionButton onPress={handleFABPress} />

      {/* Success Toast */}
      <SuccessToast
        visible={toastVisible}
        message={toastMessage}
        onHide={hideToast}
      />
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
});
