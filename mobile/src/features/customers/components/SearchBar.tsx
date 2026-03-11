import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, radius } from "../../../ui/theme";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
}) => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
        placeholder="Nhập tên khách hàng hoặc số điện thoại"
        placeholderTextColor={colors.textSecondary}
      />
      <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
    </View>
  );
};

const styles = StyleSheet.create({
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
});
