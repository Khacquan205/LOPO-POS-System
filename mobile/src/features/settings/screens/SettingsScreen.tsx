import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';

interface SettingItem {
  id: string;
  title: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  description?: string;
}

const settingsItems: SettingItem[] = [
  { id: '1', title: 'Thông tin cửa hàng', icon: 'storefront-outline', description: 'Tên, địa chỉ, logo' },
  { id: '2', title: 'Máy in', icon: 'print-outline', description: 'Cài đặt máy in hóa đơn' },
  { id: '3', title: 'Thanh toán', icon: 'card-outline', description: 'Phương thức thanh toán' },
  { id: '4', title: 'Thuế & Phí', icon: 'receipt-outline', description: 'VAT, phí dịch vụ' },
  { id: '5', title: 'Thông báo', icon: 'notifications-outline', description: 'Cài đặt thông báo' },
  { id: '6', title: 'Bảo mật', icon: 'shield-outline', description: 'Mật khẩu, xác thực' },
  { id: '7', title: 'Ngôn ngữ', icon: 'language-outline', description: 'Tiếng Việt' },
  { id: '8', title: 'Giới thiệu', icon: 'information-circle-outline', description: 'Phiên bản 1.0.0' },
];

export const SettingsScreen: React.FC = () => {
  const handleSettingPress = (item: SettingItem): void => {
    // TODO: Navigate to specific setting
    console.log('Setting pressed:', item.title);
  };

  const renderItem = ({ item }: { item: SettingItem }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={() => handleSettingPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        {item.description && (
          <Text style={styles.settingDescription}>{item.description}</Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Cài đặt" showBack />

      <FlatList
        data={settingsItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingTop: spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background,
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
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  settingDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.md + 40 + spacing.md,
  },
});
