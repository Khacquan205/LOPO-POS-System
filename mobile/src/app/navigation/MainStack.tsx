import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { MainTabs } from "./MainTabs";
import { OrdersScreen } from "../../features/orders/screens/OrdersScreen";
import { DraftOrderDetailScreen } from '../../features/orders/screens/DraftOrderDetailScreen';
import { OrderBillReadOnlyScreen } from '../../features/orders/screens/OrderBillReadOnlyScreen';
import { OrderSummaryScreen } from '../../features/orders/screens/OrderSummaryScreen';
import { SalesScreen } from "../../features/sales/screens/SalesScreen";
import { ProductPickerScreen } from '../../features/sales/screens/ProductPickerScreen';
import { QuantityEditorScreen } from '../../features/sales/screens/QuantityEditorScreen';
import { PaymentScreen } from '../../features/sales/screens/PaymentScreen';
import { CustomersScreen } from "../../features/customers/screens/CustomersScreen";
import { CreateCustomerScreen } from "../../features/customers/screens/CreateCustomerScreen";
import { EditCustomerScreen } from "../../features/customers/screens/EditCustomerScreen";
import { CustomerDetailScreen } from "../../features/customers/screens/CustomerDetailScreen";
import { PurchaseHistoryScreen } from "../../features/customers/screens/PurchaseHistoryScreen";
import { StaffScreen } from "../../features/staff/screens/StaffScreen";
import { StaffDetailScreen } from "../../features/staff/screens/StaffDetailScreen";
import { EditStaffScreen } from "../../features/staff/screens/EditStaffScreen";
import { CreateStaffScreen } from "../../features/staff/screens/CreateStaffScreen";
import { StaffApprovalScreen } from "../../features/staff/screens/StaffApprovalScreen";
import { StaffApprovalDetailScreen } from "../../features/staff/screens/StaffApprovalDetailScreen";
import { SettingsScreen } from "../../features/settings/screens/SettingsScreen";
import { SupportScreen } from "../../features/support/screens/SupportScreen";
import { NotificationsScreen } from "../../features/notifications/screens/NotificationsScreen";
import { CreateProductScreen } from "../../features/products/screens/CreateProductScreen";
import { ProductDetailScreen } from "../../features/products/screens/ProductDetailScreen";
import { EditProductScreen } from "../../features/products/screens/EditProductScreen";
import type { MainStackParamList } from "../../types/navigation";
import { ProductManagementScreen } from "~/features/products/screens/ProductManagementScreen";

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
      <Stack.Screen name="Products" component={ProductManagementScreen} />
      <Stack.Screen name="CreateProduct" component={CreateProductScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="EditProduct" component={EditProductScreen} />
      <Stack.Screen name="Customers" component={CustomersScreen} />
      <Stack.Screen name="CreateCustomer" component={CreateCustomerScreen} />
      <Stack.Screen name="EditCustomer" component={EditCustomerScreen} />
      <Stack.Screen name="CustomerDetail" component={CustomerDetailScreen} />
      <Stack.Screen name="PurchaseHistory" component={PurchaseHistoryScreen} />
      <Stack.Screen name="Staff" component={StaffScreen} />
      <Stack.Screen name="StaffDetail" component={StaffDetailScreen} />
      <Stack.Screen name="EditStaff" component={EditStaffScreen} />
      <Stack.Screen name="CreateStaff" component={CreateStaffScreen} />
      <Stack.Screen name="StaffApproval" component={StaffApprovalScreen} />
      <Stack.Screen name="StaffApprovalDetail" component={StaffApprovalDetailScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};
