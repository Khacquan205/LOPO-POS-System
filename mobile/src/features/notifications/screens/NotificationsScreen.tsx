import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader, Badge } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';
import {
  notificationsMock,
  Notification,
  NotificationType,
  getUnreadCount,
} from '../mock/notifications.mock';

const TYPE_ICONS: Record<NotificationType, React.ComponentProps<typeof Ionicons>['name']> = {
  order: 'receipt-outline',
  system: 'settings-outline',
  promotion: 'pricetag-outline',
  alert: 'warning-outline',
};

const TYPE_COLORS: Record<NotificationType, string> = {
  order: colors.primary,
  system: colors.info,
  promotion: colors.linkOrange,
  alert: colors.warning,
};

export const NotificationsScreen: React.FC = () => {
  const unreadCount = getUnreadCount(notificationsMock);

  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Vừa xong';
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  };

  const handleNotificationPress = (item: Notification): void => {
    // TODO: Mark as read and navigate
    console.log('Notification pressed:', item.id);
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.isRead && styles.unreadItem]}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: TYPE_COLORS[item.type] + '20' },
        ]}
      >
        <Ionicons
          name={TYPE_ICONS[item.type]}
          size={24}
          color={TYPE_COLORS[item.type]}
        />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, !item.isRead && styles.unreadTitle]}>
            {item.title}
          </Text>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.headerText}>
        {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Tất cả đã đọc'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Thông báo" showBack />

      <FlatList
        data={notificationsMock}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listHeader: {
    padding: spacing.md,
    backgroundColor: colors.surfaceSecondary,
  },
  headerText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  unreadItem: {
    backgroundColor: colors.primary + '05',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  notificationContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  unreadTitle: {
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
  },
  message: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  time: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
});
