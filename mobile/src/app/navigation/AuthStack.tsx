import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { LoginScreen } from '../../features/auth/screens/LoginScreen';
import { RegisterSelectRoleScreen } from '../../features/auth/screens/RegisterSelectRoleScreen';
import { RegisterOwnerScreen } from '../../features/auth/screens/RegisterOwnerScreen';
import { RegisterStaffScreen } from '../../features/auth/screens/RegisterStaffScreen';
import { ForgotPasswordPhoneScreen } from '../../features/auth/screens/ForgotPasswordPhoneScreen';
import { ForgotPasswordOtpScreen } from '../../features/auth/screens/ForgotPasswordOtpScreen';
import { ForgotPasswordResetScreen } from '../../features/auth/screens/ForgotPasswordResetScreen';
import { colors } from '../../ui/theme';
import type { AuthStackParamList } from '../../types/navigation';

const Stack = createNativeStackNavigator<AuthStackParamList>();

interface BackButtonProps {
  onPress: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ padding: 8 }}>
    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
  </TouchableOpacity>
);

const screensWithBackButton: Record<string, string> = {
  RegisterSelectRole: 'Chọn vai trò',
  RegisterOwner: 'Đăng ký chủ cửa hàng',
  RegisterStaff: 'Đăng ký nhân viên',
  ForgotPasswordPhone: 'Quên mật khẩu',
  ForgotPasswordOtp: 'Xác thực OTP',
  ForgotPasswordReset: 'Đặt lại mật khẩu',
};

export const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      id="AuthStack"
      initialRouteName="Login"
      screenOptions={({ navigation, route }) => {
        const needsBackButton = screensWithBackButton[route.name];

        return {
          headerShown: !!needsBackButton,
          headerTitle: needsBackButton || '',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: colors.textPrimary,
            fontWeight: '600',
            fontSize: 18,
          },
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerShadowVisible: false,
          headerLeft: needsBackButton
            ? () => <BackButton onPress={() => navigation.goBack()} />
            : undefined,
        };
      }}
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
