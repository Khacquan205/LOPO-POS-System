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
}

// ============================================================================
// COMPONENT
// ============================================================================

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
}) => {
  return (
    <View style={styles.searchContainer}>
      <Ionicons
        name="search"
        size={20}
        color={colors.textSecondary}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
        placeholder="Nhập tên sản phẩm"
        placeholderTextColor={colors.textSecondary}
      />
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
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    fontStyle: "italic",
    padding: 0,
  },
});
