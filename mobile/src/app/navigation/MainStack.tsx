import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MainTabs } from './MainTabs';
import { OrdersScreen } from '../../features/orders/screens/OrdersScreen';
import { SalesScreen } from '../../features/sales/screens/SalesScreen';
import { ProductsScreen } from '../../features/products/screens/ProductsScreen';
import { CustomersScreen } from '../../features/customers/screens/CustomersScreen';
import { StaffScreen } from '../../features/staff/screens/StaffScreen';
import { SettingsScreen } from '../../features/settings/screens/SettingsScreen';
import { SupportScreen } from '../../features/support/screens/SupportScreen';
import { NotificationsScreen } from '../../features/notifications/screens/NotificationsScreen';
import type { MainStackParamList } from '../../types/navigation';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainStack: React.FC = () => {
  return (
    <Stack.Navigator
      id="MainStack"
      initialRouteName="MainTabs"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="Sales" component={SalesScreen} />
      <Stack.Screen name="Products" component={ProductsScreen} />
      <Stack.Screen name="Customers" component={CustomersScreen} />
      <Stack.Screen name="Staff" component={StaffScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};
