import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';

interface IconSquareProps {
  children?: React.ReactNode;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  iconSize?: number;
  size?: number;
  backgroundColor?: string;
  iconColor?: string;
  borderRadius?: number;
  style?: ViewStyle;
}

export const IconSquare: React.FC<IconSquareProps> = ({
  children,
  icon,
  iconSize = 24,
  size = 48,
  backgroundColor = colors.primary,
  iconColor = colors.white,
  borderRadius: borderRadiusProp,
  style,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor,
          borderRadius: borderRadiusProp ?? radius.md,
        },
        style,
      ]}
    >
      {children ?? (icon && <Ionicons name={icon} size={iconSize} color={iconColor} />)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
