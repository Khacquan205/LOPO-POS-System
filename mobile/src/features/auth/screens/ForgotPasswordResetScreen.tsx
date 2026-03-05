import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CommonActions } from '@react-navigation/native';

import { Screen, Button, TextField } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';
import {
  forgotPasswordResetSchema,
  ForgotPasswordResetFormData,
} from '../../../lib/validation/auth.schema';
import { resetPassword } from '../services/auth.mock';
import type { AuthScreenProps } from '../../../types/navigation';

type Props = AuthScreenProps<'ForgotPasswordReset'>;

export const ForgotPasswordResetScreen: React.FC<Props> = ({ navigation, route }) => {
  const phone = route?.params?.phone;
  const otp = route?.params?.otp;
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
  } = useForm<ForgotPasswordResetFormData>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(forgotPasswordResetSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const showError = (fieldName: keyof ForgotPasswordResetFormData): string | undefined => {
    const value = watch(fieldName) || '';
    const isTouched = touchedFields[fieldName];
    const hasValue = value.trim().length > 0;
    const shouldShow = submitted || (isTouched && hasValue);
    return shouldShow ? errors[fieldName]?.message : undefined;
  };

  const onValid = async (data: ForgotPasswordResetFormData): Promise<void> => {
    setLoading(true);
    try {
      await resetPassword(phone, otp, data.password);
      Alert.alert('Thành công', 'Đổi mật khẩu thành công!', [
        {
          text: 'Đăng nhập',
          onPress: () =>
            navigation.dispatch(
              CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] }),
            ),
        },
      ]);
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = (): void => {
    setSubmitted(true);
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>QUÊN MẬT KHẨU</Text>
          </View>

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Mật khẩu mới"
                placeholder="Nhập mật khẩu mới"
                secureTextEntry
                leftIconName="lock-closed-outline"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={showError('password')}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Xác nhận mật khẩu"
                placeholder="Nhập lại mật khẩu"
                secureTextEntry
                leftIconName="lock-closed-outline"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={showError('confirmPassword')}
              />
            )}
          />

          <View style={styles.buttonWrapper}>
            <Button
              title="Xác nhận"
              onPress={handleSubmit(onValid, onInvalid)}
              loading={loading}
              disabled={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.primary,
    textAlign: 'center',
  },
  buttonWrapper: {
    marginTop: spacing.lg,
  },
});
