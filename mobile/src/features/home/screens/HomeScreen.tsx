import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, IconSquare, GridButton, Badge } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';
import { useAuthStore } from '../../../store/auth.store';
import type { MainStackParamList } from '../../../types/navigation';
import type { Ionicons } from '@expo/vector-icons';

type FeatureKey = 'sales' | 'orders' | 'products' | 'customers' | 'staff' | 'settings' | 'support' | 'notifications';

interface GridItem {
  key: FeatureKey;
  title: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  badge?: string;
}

const GRID_ITEMS: GridItem[] = [
  { key: 'sales', title: 'Bán hàng', icon: 'cart-outline' },
  { key: 'orders', title: 'Đơn hàng', icon: 'receipt-outline' },
  { key: 'products', title: 'Sản phẩm', icon: 'cube-outline' },
  { key: 'customers', title: 'Khách hàng', icon: 'people-outline' },
  { key: 'staff', title: 'Nhân viên', icon: 'person-outline' },
  { key: 'settings', title: 'Cài đặt', icon: 'settings-outline' },
  { key: 'support', title: 'Hỗ trợ', icon: 'headset-outline' },
  { key: 'notifications', title: 'Thông báo', icon: 'notifications-outline', badge: '1' },
];

const ROUTE_MAP: Record<FeatureKey, keyof MainStackParamList> = {
  sales: 'Sales',
  orders: 'Orders',
  products: 'Products',
  customers: 'Customers',
  staff: 'Staff',
  settings: 'Settings',
  support: 'Support',
  notifications: 'Notifications',
};

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  // Nếu là owner, hiển thị tên cửa hàng; ngược lại hiển thị tên người dùng
  const displayName = user?.role === 'owner' && user?.storeName 
    ? user.storeName.toUpperCase() 
    : user?.name?.toUpperCase() || 'NGƯỜI DÙNG';

  const handleLogout = (): void => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.getParent()?.dispatch(
            CommonActions.reset({ index: 0, routes: [{ name: 'Auth' }] }),
          );
        },
      },
    ]);
  };

  const handleGridPress = (key: FeatureKey): void => {
    const routeName = ROUTE_MAP[key];
    if (routeName) {
      navigation.navigate(routeName);
    }
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <IconSquare icon="storefront-outline" size={48} />
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Xin chào!</Text>
            <Text style={styles.userName}>{displayName}</Text>
          </View>
        </View>

        {/* Store selector link */}
        <Text style={styles.storeLink}>Chọn cửa hàng</Text>

        {/* Grid 2x4 */}
        <View style={styles.gridContainer}>
          {GRID_ITEMS.map((item) => (
            <View key={item.key} style={styles.gridItemWrapper}>
              <GridButton
                title={item.title}
                iconName={item.icon}
                onPress={() => handleGridPress(item.key)}
                variant="card"
                style={styles.gridItem}
              />
              {item.badge && (
                <Badge
                  count={item.badge}
                  variant="error"
                  size="small"
                  style={styles.badge}
                />
              )}
            </View>
          ))}
        </View>

        {/* Logout */}
        <Text style={styles.logoutLink} onPress={handleLogout}>
          Đăng xuất
        </Text>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  headerText: {
    marginLeft: spacing.md,
  },
  greeting: {
    ...typography.body,
    color: colors.textSecondary,
  },
  userName: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: '700',
  },
  storeLink: {
    ...typography.body,
    color: colors.linkOrange,
    marginBottom: spacing.lg,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
  },
  gridItemWrapper: {
    width: '48%',
    position: 'relative',
  },
  gridItem: {
    width: '100%',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  logoutLink: {
    ...typography.body,
    color: colors.linkOrange,
    textAlign: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
});
