import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import { CategoryChips } from "../components/CategoryChips";
import { ProductItem } from "../components/ProductItem";
import { FloatingActionButton } from "../components/FloatingActionButton";
import { FilterBottomSheet } from "../components/FilterBottomSheet";
import { BulkActionBar } from "../components/BulkActionBar";
import { SuccessToast } from "../../../ui/components";
import { colors, spacing, radius, typography } from "../../../ui/theme";
import { useProductsStore } from "../store/products.store";
import { useAuthStore } from "../../../store/auth.store";
import { useCategoriesStore } from "../store/categories.store";
import type { MainStackScreenProps } from "../../../types/navigation";

// ============================================================================
// ============================================================================
// TYPES
// ============================================================================

interface CategoryOption {
  id: string;
  name: string;
  color: string;
}

const ALL_CATEGORY: CategoryOption = {
  id: "all",
  name: "Tất cả",
  color: "#EFA442",
};

// ============================================================================
// MAIN SCREEN COMPONENT
// ============================================================================

type Props = MainStackScreenProps<"Products">;

export const ProductManagementScreen: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const products = useProductsStore((state) => state.products);
  const fetchProducts = useProductsStore((state) => state.fetchProducts);
  const removeProducts = useProductsStore((state) => state.removeProducts);
  const categories = useCategoriesStore((state) => state.categories);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);
  const createCategory = useCategoriesStore((state) => state.createCategory);
  const updateCategory = useCategoriesStore((state) => state.updateCategory);
  const deleteCategory = useCategoriesStore((state) => state.deleteCategory);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [filterVisible, setFilterVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(
    "all",
  );
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [categoryManagerVisible, setCategoryManagerVisible] = useState(false);
  const [categoryDraft, setCategoryDraft] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );

  const loadProductsAndCategories = useCallback(async () => {
    if (!accessToken) return;

    await fetchCategories(accessToken);
    const freshCategories = useCategoriesStore
      .getState()
      .categories.map((item) => ({
        id: item.id,
        name: item.name,
        color: item.color,
      }));
    await fetchProducts(accessToken, freshCategories);
  }, [accessToken, fetchCategories, fetchProducts]);

  useFocusEffect(
    useCallback(() => {
      if (!accessToken) return;
      void (async () => {
        try {
          await loadProductsAndCategories();
        } catch (error) {
          console.warn("Load products/categories failed:", error);
        }
      })();
    }, [accessToken, loadProductsAndCategories]),
  );

  // Hiển thị toast ngay khi params thay đổi (kể cả khi đã đang ở màn hình này)
  useEffect(() => {
    const params = route.params as
      | {
          showDeleteSuccessToast?: boolean;
          showCreateSuccessToast?: boolean;
          showEditSuccessToast?: boolean;
        }
      | undefined;

    if (params?.showDeleteSuccessToast) {
      setToastMessage("Xóa sản phẩm thành công!");
      setToastVisible(true);
      navigation.setParams({ showDeleteSuccessToast: undefined });
    }
  }, [navigation, route.params?.showDeleteSuccessToast]);

  const categoryOptions = useMemo<CategoryOption[]>(
    () => [
      ALL_CATEGORY,
      ...categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        color: cat.color,
      })),
    ],
    [categories],
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
      filtered = filtered.filter((p) => p.categoryId === selectedCategoryId);
    }

    // Filter by status (Đang hoạt động / Ngưng hoạt động)
    if (statusFilter === "active") {
      filtered = filtered.filter((p) => p.status === "active");
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter((p) => p.status === "inactive");
    }

    return filtered;
  }, [searchQuery, selectedCategoryId, statusFilter, products, categoryOptions]);

  const handleBackPress = () => {
    // Luôn quay về màn hình Home trong MainTabs,
    // tránh quay lại Edit/Detail sau khi đã lưu sản phẩm.
    navigation.navigate("MainTabs", { screen: "Home" });
  };

  const handleFilterPress = () => {
    setFilterVisible(true);
  };

  const handleCloseFilter = () => {
    setFilterVisible(false);
  };

  const handleSelectFilterOption = (option: "active" | "inactive") => {
    setStatusFilter(option);
    setFilterVisible(false);
  };

  const handleClearStatusFilter = () => {
    setStatusFilter("all");
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

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0 || !accessToken) return;

    const categoryLookup = categoryOptions
      .filter((item) => item.id !== "all")
      .map((item) => ({ id: item.id, name: item.name, color: item.color }));

    try {
      await removeProducts(accessToken, selectedIds, categoryLookup);
      setToastVisible(true);
      setIsSelectionMode(false);
      setSelectedIds([]);
    } catch (error) {
      console.warn("Delete products failed:", error);
    }
  };

  const resetCategoryForm = () => {
    setCategoryDraft("");
    setEditingCategoryId(null);
  };

  const handleCloseCategoryManager = () => {
    resetCategoryForm();
    setCategoryManagerVisible(false);
  };

  const handleSubmitCategory = async () => {
    if (!accessToken) return;
    const trimmed = categoryDraft.trim();
    if (!trimmed) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tên loại sản phẩm.");
      return;
    }

    try {
      if (editingCategoryId) {
        await updateCategory(accessToken, editingCategoryId, { name: trimmed });
      } else {
        await createCategory(accessToken, { name: trimmed, is_active: true });
      }
      await loadProductsAndCategories();
      resetCategoryForm();
    } catch (error) {
      console.warn("Save category failed:", error);
      Alert.alert("Không thể lưu loại sản phẩm", "Vui lòng thử lại.");
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (!accessToken) return;

    Alert.alert(
      "Xóa loại sản phẩm",
      "Bạn có chắc muốn xóa loại sản phẩm này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCategory(accessToken, categoryId);
              await loadProductsAndCategories();
              if (selectedCategoryId === categoryId) {
                setSelectedCategoryId("all");
              }
              if (editingCategoryId === categoryId) {
                resetCategoryForm();
              }
            } catch (error) {
              console.warn("Delete category failed:", error);
              Alert.alert("Không thể xóa loại sản phẩm", "Vui lòng thử lại.");
            }
          },
        },
      ],
    );
  };

  const handleStartEditCategory = (
    categoryId: string,
    categoryName: string,
  ) => {
    setEditingCategoryId(categoryId);
    setCategoryDraft(categoryName);
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

        <TouchableOpacity
          style={styles.manageCategoryButton}
          onPress={() => setCategoryManagerVisible(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="settings-outline" size={16} color={colors.primary} />
          <Text style={styles.manageCategoryButtonText}>
            Quản lý loại sản phẩm
          </Text>
        </TouchableOpacity>

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
        message={toastMessage ?? ""}
        onHide={() => {
          setToastVisible(false);
          setToastMessage(null);
        }}
      />

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet
        visible={filterVisible}
        onClose={handleCloseFilter}
        onSelectOption={handleSelectFilterOption}
        onClearAll={handleClearStatusFilter}
      />

      <Modal
        transparent
        visible={categoryManagerVisible}
        animationType="fade"
        onRequestClose={handleCloseCategoryManager}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Quản lý loại sản phẩm</Text>

            <View style={styles.modalInputRow}>
              <TextInput
                style={styles.modalInput}
                placeholder="Nhập tên loại sản phẩm"
                value={categoryDraft}
                onChangeText={setCategoryDraft}
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity
                style={styles.modalPrimaryButton}
                activeOpacity={0.85}
                onPress={handleSubmitCategory}
              >
                <Text style={styles.modalPrimaryButtonText}>
                  {editingCategoryId ? "Lưu" : "Thêm"}
                </Text>
              </TouchableOpacity>
            </View>

            {editingCategoryId ? (
              <TouchableOpacity
                onPress={resetCategoryForm}
                activeOpacity={0.8}
                style={styles.cancelEditButton}
              >
                <Text style={styles.cancelEditButtonText}>Hủy chỉnh sửa</Text>
              </TouchableOpacity>
            ) : null}

            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              style={styles.modalList}
              renderItem={({ item }) => (
                <View style={styles.modalListItem}>
                  <View style={styles.modalCategoryLeft}>
                    <View
                      style={[
                        styles.modalCategoryDot,
                        { backgroundColor: item.color },
                      ]}
                    />
                    <Text style={styles.modalCategoryName}>{item.name}</Text>
                  </View>
                  <View style={styles.modalActionsRow}>
                    <TouchableOpacity
                      onPress={() =>
                        handleStartEditCategory(item.id, item.name)
                      }
                      activeOpacity={0.8}
                      style={styles.modalActionBtn}
                    >
                      <Text style={styles.modalActionEditText}>Sửa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteCategory(item.id)}
                      activeOpacity={0.8}
                      style={styles.modalActionBtn}
                    >
                      <Text style={styles.modalActionDeleteText}>Xóa</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={handleCloseCategoryManager}
              activeOpacity={0.85}
            >
              <Text style={styles.modalCloseBtnText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  manageCategoryButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: "#FFF3E7",
    gap: spacing.xs,
  },
  manageCategoryButtonText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  modalCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    maxHeight: "78%",
  },
  modalTitle: {
    ...typography.body,
    fontSize: 18,
    color: colors.primary,
    fontWeight: "700",
    marginBottom: spacing.md,
  },
  modalInputRow: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
  },
  modalInput: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
  },
  modalPrimaryButton: {
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
  modalPrimaryButtonText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: "700",
  },
  cancelEditButton: {
    alignSelf: "flex-start",
    marginTop: spacing.sm,
  },
  cancelEditButtonText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textDecorationLine: "underline",
  },
  modalList: {
    marginTop: spacing.md,
  },
  modalListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalCategoryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
    paddingRight: spacing.sm,
  },
  modalCategoryDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
  },
  modalCategoryName: {
    ...typography.body,
    color: colors.textPrimary,
  },
  modalActionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  modalActionBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: "#F9FAFB",
  },
  modalActionEditText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: "600",
  },
  modalActionDeleteText: {
    ...typography.bodySmall,
    color: colors.error,
    fontWeight: "600",
  },
  modalCloseBtn: {
    marginTop: spacing.md,
    height: 44,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111827",
  },
  modalCloseBtnText: {
    ...typography.body,
    color: colors.white,
    fontWeight: "600",
  },
});
