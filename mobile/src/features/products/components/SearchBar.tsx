import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../../../ui/theme";

// ============================================================================
// TYPES
// ============================================================================

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  iconPosition?: "left" | "right";
}

// ============================================================================
// COMPONENT
// ============================================================================

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  iconPosition = "left",
}) => {
  return (
    <View style={styles.searchContainer}>
      {iconPosition === "left" && (
        <Ionicons
          name="search"
          size={20}
          color={colors.textSecondary}
          style={styles.searchIconLeft}
        />
      )}
      <TextInput
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
        placeholder="Nhập tên sản phẩm"
        placeholderTextColor={colors.textSecondary}
      />
      {iconPosition === "right" && (
        <Ionicons
          name="search"
          size={20}
          color={colors.textSecondary}
          style={styles.searchIconRight}
        />
      )}
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    height: 52,
    backgroundColor: "#EEEEEE",
    borderRadius: 12,
  },
  searchIconLeft: {
    marginRight: spacing.sm,
  },
  searchIconRight: {
    marginLeft: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    fontStyle: "italic",
    padding: 0,
  },
});
