import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

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
  const [focusedField, setFocusedField] = useState<keyof ForgotPasswordResetFormData | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

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
    if (focusedField === fieldName) return undefined;
    const value = watch(fieldName) || '';
    const isTouched = touchedFields[fieldName];
    const hasValue = value.trim().length > 0;
    const shouldShow = submitted || (isTouched && hasValue);
    return shouldShow ? errors[fieldName]?.message : undefined;
  };

  const makeHandlers = (
    fieldName: keyof ForgotPasswordResetFormData,
    rhfOnBlur: () => void,
  ) => ({
    onFocus: () => setFocusedField(fieldName),
    onBlur: () => {
      setFocusedField(null);
      rhfOnBlur();
    },
  });

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
    <Screen scroll keyboardAvoiding>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.form}>
        <Text style={styles.title}>QUÊN MẬT KHẨU</Text>

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>
                Mật khẩu mới <Text style={styles.required}>*</Text>
              </Text>
              <TextField
                secureTextEntry
                value={value}
                onChangeText={onChange}
                error={showError('password')}
                {...makeHandlers('password', onBlur)}
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>
                Nhập lại mật khẩu <Text style={styles.required}>*</Text>
              </Text>
              <TextField
                secureTextEntry
                value={value}
                onChangeText={onChange}
                error={showError('confirmPassword')}
                {...makeHandlers('confirmPassword', onBlur)}
              />
            </View>
          )}
        />

        <Button
          title="Xác nhận"
          onPress={handleSubmit(onValid, onInvalid)}
          loading={loading}
          style={styles.submitButton}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  form: {
    flex: 1,
  },
  title: {
    ...typography.screenTitle,
    color: colors.primary,
    marginBottom: spacing.xl,
  },
  fieldWrapper: {
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  required: {
    color: colors.error,
  },
  submitButton: {
    marginTop: spacing.md,
  },
});
