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

interface CreateCustomerHeaderProps {
  onBackPress: () => void;
  customerCode: string;
}

export const CreateCustomerHeader: React.FC<CreateCustomerHeaderProps> = ({
  onBackPress,
  customerCode,
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

      <Text style={styles.headerTitle}>{customerCode}</Text>

      <View style={styles.headerIconButton} />
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
    paddingBottom: spacing.md,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    flex: 1,
    textAlign: "center",
    letterSpacing: 0.5,
  },
});
