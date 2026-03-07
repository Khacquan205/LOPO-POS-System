import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../../../ui/theme";

// ============================================================================
// TYPES
// ============================================================================

interface HeaderProps {
  onBackPress?: () => void;
  onFilterPress?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const Header: React.FC<HeaderProps> = ({
  onBackPress,
  onFilterPress,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackPress} style={styles.headerIconLeft}>
        <Ionicons name="chevron-back" size={24} color={colors.primary} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>QUẢN LÝ SẢN PHẨM</Text>

      <TouchableOpacity onPress={onFilterPress} style={styles.headerIconRight}>
        <Ionicons name="funnel" size={22} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop:
      Platform.OS === "android"
        ? (StatusBar.currentHeight ?? 0) + spacing.xs
        : spacing.sm,
    paddingBottom: spacing.xs,
  },
  headerIconLeft: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    ...typography.screenTitle,
    color: colors.primary,
    flex: 1,
    textAlign: "center",
  },
  headerIconRight: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
