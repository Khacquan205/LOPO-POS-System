import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../../../ui/theme";

// ============================================================================
// TYPES
// ============================================================================

interface Category {
  id: string;
  name: string;
  color: string;
}

interface CategoryChipProps {
  label: string;
  color: string;
  isSelected?: boolean;
  onPress?: () => void;
}

interface CategoryChipsProps {
  categories: Category[];
  selectedId?: string;
  onSelectCategory?: (id: string | undefined) => void;
}

// ============================================================================
// CATEGORY CHIP COMPONENT
// ============================================================================

const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  color,
  isSelected = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.categoryChip, { backgroundColor: color }]}
    >
      <Text style={styles.categoryChipText}>{label}</Text>
    </TouchableOpacity>
  );
};

// ============================================================================
// CATEGORY CHIPS LIST COMPONENT
// ============================================================================

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedId,
  onSelectCategory,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoryChipsContainer}
      contentContainerStyle={styles.categoryChipsContent}
    >
      {categories.map((category) => (
        <CategoryChip
          key={category.id}
          label={category.name}
          color={category.color}
          isSelected={selectedId === category.id}
          onPress={() =>
            onSelectCategory?.(
              selectedId === category.id ? undefined : category.id,
            )
          }
        />
      ))}
    </ScrollView>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  categoryChipsContainer: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.xs,
    flexGrow: 0,
  },
  categoryChipsContent: {
    paddingHorizontal: 0,
    gap: spacing.xs,
    alignItems: "center",
  },
  categoryChip: {
    height: 44,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  categoryChipText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: "600",
  },
});
