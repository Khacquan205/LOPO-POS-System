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

interface HeaderProps {
  onBackPress: () => void;
  onFilterPress: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onBackPress,
  onFilterPress,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.headerIconButton}
        activeOpacity={0.75}
        onPress={onBackPress}
      >
        <Ionicons name="chevron-back" size={24} color={colors.primary} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>QUẢN LÝ KHÁCH HÀNG</Text>

      <TouchableOpacity
        style={styles.headerIconButton}
        activeOpacity={0.75}
        onPress={onFilterPress}
      >
        <Ionicons name="funnel-outline" size={20} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

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
  headerIconButton: {
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
});
