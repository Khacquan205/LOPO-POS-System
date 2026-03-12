import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightIcon?: React.ComponentProps<typeof Ionicons>['name'];
  onRightPress?: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  showBack = true,
  rightIcon,
  onRightPress,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.content}>
        {/* Left - Back button */}
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.iconButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Center - Title */}
        <View style={styles.centerSection}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>

        {/* Right - Optional icon */}
        <View style={styles.rightSection}>
          {rightIcon && (
            <TouchableOpacity
              onPress={onRightPress}
              style={styles.iconButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name={rightIcon} size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    minHeight: 44,
  },
  leftSection: {
    width: 40,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '400',
    letterSpacing: 0.3,
    marginTop: 1,
  },
  iconButton: {
    padding: spacing.xs,
  },
});
