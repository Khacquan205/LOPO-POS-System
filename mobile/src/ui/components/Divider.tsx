import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface DividerProps {
  style?: ViewStyle;
  text?: string;
  textStyle?: TextStyle;
  vertical?: boolean;
  color?: string;
  thickness?: number;
  spacing?: number;
}

export const Divider: React.FC<DividerProps> = ({
  style,
  text,
  textStyle,
  vertical = false,
  color = colors.border,
  thickness = 1,
  spacing: customSpacing,
}) => {
  if (text) {
    return (
      <View style={[styles.textDividerContainer, style]}>
        <View style={[styles.line, { backgroundColor: color, height: thickness }]} />
        <Text style={[styles.text, textStyle]}>{text}</Text>
        <View style={[styles.line, { backgroundColor: color, height: thickness }]} />
      </View>
    );
  }

  if (vertical) {
    return (
      <View
        style={[
          styles.verticalDivider,
          {
            backgroundColor: color,
            width: thickness,
            marginHorizontal: customSpacing ?? spacing.md,
          },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: color,
          height: thickness,
          marginVertical: customSpacing ?? spacing.md,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
  verticalDivider: {
    height: '100%',
  },
  textDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  line: {
    flex: 1,
  },
  text: {
    ...typography.caption,
    color: colors.textSecondary,
    marginHorizontal: spacing.sm,
  },
});
