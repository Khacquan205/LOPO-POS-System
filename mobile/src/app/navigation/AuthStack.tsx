import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '../../features/auth/screens/LoginScreen';
import { RegisterSelectRoleScreen } from '../../features/auth/screens/RegisterSelectRoleScreen';
import { RegisterOwnerScreen } from '../../features/auth/screens/RegisterOwnerScreen';
import { RegisterStaffScreen } from '../../features/auth/screens/RegisterStaffScreen';
import { ForgotPasswordPhoneScreen } from '../../features/auth/screens/ForgotPasswordPhoneScreen';
import { ForgotPasswordOtpScreen } from '../../features/auth/screens/ForgotPasswordOtpScreen';
import { ForgotPasswordResetScreen } from '../../features/auth/screens/ForgotPasswordResetScreen';
import type { AuthStackParamList } from '../../types/navigation';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      id="AuthStack"
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RegisterSelectRole" component={RegisterSelectRoleScreen} />
      <Stack.Screen name="RegisterOwner" component={RegisterOwnerScreen} />
      <Stack.Screen name="RegisterStaff" component={RegisterStaffScreen} />
      <Stack.Screen name="ForgotPasswordPhone" component={ForgotPasswordPhoneScreen} />
      <Stack.Screen name="ForgotPasswordOtp" component={ForgotPasswordOtpScreen} />
      <Stack.Screen name="ForgotPasswordReset" component={ForgotPasswordResetScreen} />
    </Stack.Navigator>
  );
};