import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../../ui/theme';
import { Badge } from '../../../ui/components';
import { useAuthStore } from '../../../store/auth.store';

interface HomeHeaderProps {
  onNotificationPress?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onNotificationPress }) => {
  const { user } = useAuthStore();
  const displayName = user?.name || 'LOPO Coffee';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>Xin chào!</Text>
          <Text style={styles.storeName}>{displayName}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.notificationButton} onPress={onNotificationPress}>
        <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
        <Badge count={1} variant="error" size="small" style={styles.badge as ViewStyle} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.bodyMedium,
    color: colors.white,
    fontWeight: '600',
  },
  textContainer: {
    justifyContent: 'center',
  },
  greeting: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  storeName: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  notificationButton: {
    position: 'relative',
    padding: spacing.sm,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
});
