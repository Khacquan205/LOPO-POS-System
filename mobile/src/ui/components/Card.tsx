import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, radius, shadow, spacing } from '../theme';

type CardVariant = 'default' | 'outlined' | 'elevated';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: CardVariant;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
  noPadding = false,
}) => {
  const Container = onPress ? TouchableOpacity : View;

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'outlined':
        return styles.outlined;
      case 'elevated':
        return styles.elevated;
      default:
        return styles.default;
    }
  };

  return (
    <Container
      style={[
        styles.card,
        getVariantStyle(),
        noPadding && styles.noPadding,
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.md,
  },
  default: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  elevated: {
    ...shadow.md,
  },
  noPadding: {
    padding: 0,
  },
});
