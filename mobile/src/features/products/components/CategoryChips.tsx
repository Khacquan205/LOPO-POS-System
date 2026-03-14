import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, spacing, typography, radius } from "../../../ui/theme";

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
  compact?: boolean;
}

interface CategoryChipsProps {
  categories: Category[];
  selectedId?: string;
  onSelectCategory?: (id: string | undefined) => void;
  compact?: boolean;
}

// ============================================================================
// CATEGORY CHIP COMPONENT
// ============================================================================

const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  color,
  isSelected = false,
  onPress,
  compact = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.categoryChip,
        compact ? styles.categoryChipCompact : styles.categoryChipDefault,
        !isSelected && styles.categoryChipMuted,
        isSelected && styles.categoryChipSelected,
        { backgroundColor: color },
      ]}
    >
      <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}>
        {label}
      </Text>
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
  compact = false,
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
          compact={compact}
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
    justifyContent: "center",
    borderRadius: radius.full,
    alignSelf: "flex-start",
    borderWidth: 2,
    borderColor: "transparent",
  },
  categoryChipMuted: {
    opacity: 0.65,
  },
  categoryChipSelected: {
    borderColor: colors.white,
  },
  categoryChipDefault: {
    height: 44,
    paddingHorizontal: spacing.lg,
  },
  categoryChipCompact: {
    height: 36,
    paddingHorizontal: spacing.md,
  },
  categoryChipText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: "600",
  },
  categoryChipTextSelected: {
    fontWeight: "700",
  },
});
