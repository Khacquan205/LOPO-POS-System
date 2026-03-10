import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../../ui/theme';

interface SalesActionButtonProps {
  title: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
}

export const SalesActionButton: React.FC<SalesActionButtonProps> = ({ title, iconName, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7}>
    <Ionicons name={iconName} size={16} color={colors.primary} style={styles.icon} />
    <Text style={styles.label}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 8,
    gap: 6,
  },
  icon: {},
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});
