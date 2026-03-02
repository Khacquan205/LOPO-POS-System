import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';

interface SupportItem {
  id: string;
  title: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  action: () => void;
}

export const SupportScreen: React.FC = () => {
  const supportItems: SupportItem[] = [
    {
      id: '1',
      title: 'Gọi hotline',
      icon: 'call-outline',
      action: () => Linking.openURL('tel:1900123456'),
    },
    {
      id: '2',
      title: 'Chat với hỗ trợ',
      icon: 'chatbubble-outline',
      action: () => console.log('Open chat'),
    },
    {
      id: '3',
      title: 'Gửi email',
      icon: 'mail-outline',
      action: () => Linking.openURL('mailto:support@lopo.vn'),
    },
    {
      id: '4',
      title: 'Hướng dẫn sử dụng',
      icon: 'book-outline',
      action: () => Linking.openURL('https://lopo.vn/help'),
    },
    {
      id: '5',
      title: 'Câu hỏi thường gặp',
      icon: 'help-circle-outline',
      action: () => Linking.openURL('https://lopo.vn/faq'),
    },
  ];

  return (
    <View style={styles.container}>
      <ScreenHeader title="Hỗ trợ" showBack />

      <View style={styles.content}>
        {/* Header info */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="headset" size={48} color={colors.primary} />
          </View>
          <Text style={styles.headerTitle}>Trung tâm hỗ trợ</Text>
          <Text style={styles.headerSubtitle}>
            Liên hệ với chúng tôi nếu bạn cần hỗ trợ
          </Text>
        </View>

        {/* Support items */}
        <View style={styles.itemsContainer}>
          {supportItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.supportItem}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={24} color={colors.primary} />
              </View>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Hotline: 1900 123 456</Text>
          <Text style={styles.footerText}>Email: support@lopo.vn</Text>
          <Text style={styles.footerText}>Giờ làm việc: 8:00 - 22:00</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  itemsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  itemTitle: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  footer: {
    marginTop: 'auto',
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
});
