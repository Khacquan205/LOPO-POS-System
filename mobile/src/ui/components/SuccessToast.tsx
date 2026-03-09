import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, radius, shadow } from "../theme";

// ============================================================================
// TYPES
// ============================================================================

interface SuccessToastProps {
  visible: boolean;
  message: string;
  duration?: number;
  onHide?: () => void;
  variant?: 'success' | 'error' | 'warning';
}

// ============================================================================
// COMPONENT
// ============================================================================

export const SuccessToast: React.FC<SuccessToastProps> = ({
  visible,
  message,
  duration = 3000,
  onHide,
  variant = 'success',
}) => {
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      hideToast();
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide?.();
    });
  };

  if (!visible) return null;

  const iconName =
    variant === 'error' ? 'close' : variant === 'warning' ? 'alert' : 'checkmark';
  const iconBg =
    variant === 'error' ? '#EF4444' : variant === 'warning' ? '#F59E0B' : colors.success;
  const containerBg =
    variant === 'error' ? '#FEE2E2' : variant === 'warning' ? '#FEF3C7' : '#D1FAE5';

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY }], opacity, backgroundColor: containerBg },
      ]}
    >
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName} size={16} color={colors.white} />
      </View>

      {/* Success Message */}
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: "#D1FAE5", // Light green background
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    ...shadow.lg,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.success, // #10B981
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm + spacing.xs, // 12
  },
  message: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#065F46", // Dark green text
  },
});
