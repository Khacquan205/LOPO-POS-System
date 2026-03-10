import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MainTabs } from './MainTabs';
import { OrdersScreen } from '../../features/orders/screens/OrdersScreen';
import { DraftOrderDetailScreen } from '../../features/orders/screens/DraftOrderDetailScreen';
import { OrderBillReadOnlyScreen } from '../../features/orders/screens/OrderBillReadOnlyScreen';
import { OrderSummaryScreen } from '../../features/orders/screens/OrderSummaryScreen';
import { SalesScreen } from '../../features/sales/screens/SalesScreen';
import { ProductPickerScreen } from '../../features/sales/screens/ProductPickerScreen';
import { QuantityEditorScreen } from '../../features/sales/screens/QuantityEditorScreen';
import { PaymentScreen } from '../../features/sales/screens/PaymentScreen';
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
      <Stack.Screen name="DraftOrderDetail" component={DraftOrderDetailScreen} />
      <Stack.Screen name="OrderBillReadOnly" component={OrderBillReadOnlyScreen} />
      <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} />
      <Stack.Screen name="Sales" component={SalesScreen} />
      <Stack.Screen name="ProductPicker" component={ProductPickerScreen} />
      <Stack.Screen name="QuantityEditor" component={QuantityEditorScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Products" component={ProductsScreen} />
      <Stack.Screen name="Customers" component={CustomersScreen} />
      <Stack.Screen name="Staff" component={StaffScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};
