import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, radius } from "../../../ui/theme";
import { categoriesMock, Category } from "../mock/productManagement.mock";

// ============================================================================
// TYPES
// ============================================================================

interface CategoryPickerBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelectCategory: (category: Category) => void;
  onAddNewCategory?: () => void;
}

// ============================================================================
// HEADER COMPONENT
// ============================================================================

const Header: React.FC<{ onAddPress?: () => void }> = ({ onAddPress }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>CHỌN LOẠI SẢN PHẨM</Text>
      <TouchableOpacity
        onPress={onAddPress}
        style={styles.addButton}
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={20} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

// ============================================================================
// SEARCH INPUT COMPONENT
// ============================================================================

const SearchInput: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
}> = ({ value, onChangeText }) => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Nhập loại sản phẩm"
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
      />
      <Ionicons
        name="search"
        size={20}
        color={colors.textSecondary}
        style={styles.searchIcon}
      />
    </View>
  );
};

// ============================================================================
// CATEGORY ITEM COMPONENT
// ============================================================================

const CategoryItem: React.FC<{
  category: Category;
  onPress: () => void;
  isLast: boolean;
}> = ({ category, onPress, isLast }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.categoryItem}
      activeOpacity={0.7}
    >
      <View style={styles.categoryItemContent}>
        {/* Color Dot */}
        <View style={[styles.colorDot, { backgroundColor: category.color }]} />

        {/* Category Name */}
        <Text style={styles.categoryName}>{category.name}</Text>
      </View>

      {/* Divider */}
      {!isLast && <View style={styles.divider} />}
    </TouchableOpacity>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const CategoryPickerBottomSheet: React.FC<
  CategoryPickerBottomSheetProps
> = ({ visible, onClose, onSelectCategory, onAddNewCategory }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter categories based on search query
  const filteredCategories = categoriesMock.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase().trim()),
  );

  const handleSelectCategory = (category: Category) => {
    onSelectCategory(category);
    setSearchQuery("");
    onClose();
  };

  const handleAddNew = () => {
    onAddNewCategory?.();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Bottom Sheet Container */}
        <TouchableOpacity
          activeOpacity={1}
          style={styles.bottomSheetContainer}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.bottomSheet}>
            {/* Header */}
            <Header onAddPress={handleAddNew} />

            {/* Search Input */}
            <SearchInput value={searchQuery} onChangeText={setSearchQuery} />

            {/* Category List */}
            <FlatList
              data={filteredCategories}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <CategoryItem
                  category={item}
                  onPress={() => handleSelectCategory(item)}
                  isLast={index === filteredCategories.length - 1}
                />
              )}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    Không tìm thấy loại sản phẩm
                  </Text>
                </View>
              }
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.55; // 55% of screen

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "flex-end",
  },
  bottomSheetContainer: {
    height: BOTTOM_SHEET_HEIGHT,
  },
  bottomSheet: {
    height: "100%",
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.primary,
    letterSpacing: 0.5,
  },
  addButton: {
    width: 34,
    height: 34,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    height: 42,
    paddingHorizontal: spacing.sm + spacing.xs, // 12
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    padding: 0,
  },
  searchIcon: {
    marginLeft: spacing.sm,
  },
  categoryItem: {
    paddingVertical: spacing.md,
  },
  categoryItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
    marginRight: spacing.sm + spacing.xs, // 12
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginTop: spacing.md,
    marginLeft: spacing.lg - 2, // Align with text (10 + 12)
  },
  emptyContainer: {
    paddingVertical: spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
