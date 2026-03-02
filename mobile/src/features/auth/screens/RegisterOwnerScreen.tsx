import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Screen, Button, TextField } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';
import { registerOwnerSchema, RegisterOwnerFormData } from '../../../lib/validation/auth.schema';
import { registerOwner, type RegisterOwnerPayload } from '../services/auth.mock';
import type { AuthScreenProps } from '../../../types/navigation';

type Props = AuthScreenProps<'RegisterOwner'>;

export const RegisterOwnerScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
  } = useForm<RegisterOwnerFormData>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(registerOwnerSchema),
    defaultValues: {
      storeName: '',
      ownerName: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const showError = (fieldName: keyof RegisterOwnerFormData): string | undefined => {
    const value = watch(fieldName) || '';
    const isTouched = touchedFields[fieldName];
    const hasValue = value.trim().length > 0;
    const shouldShow = submitted || (isTouched && hasValue);
    return shouldShow ? errors[fieldName]?.message : undefined;
  };

  const onValid = async (data: RegisterOwnerFormData): Promise<void> => {
    setLoading(true);
    try {
      await registerOwner(data as unknown as RegisterOwnerPayload);
      // Đăng ký thành công -> chuyển về màn hình đăng nhập
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Register owner error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = (): void => {
    setSubmitted(true);
  };

  return (
    <Screen scroll keyboardAvoiding>
      <View style={styles.form}>
        <Controller
          control={control}
          name="storeName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              placeholder="Tên cửa hàng"
              leftIconName="storefront-outline"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={showError('storeName')}
            />
          )}
        />

        <Controller
          control={control}
          name="ownerName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              placeholder="Tên chủ cửa hàng"
              leftIconName="person-outline"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={showError('ownerName')}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              placeholder="Số điện thoại"
              leftIconName="call-outline"
              keyboardType="phone-pad"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={showError('phone')}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              placeholder="Mật khẩu"
              leftIconName="lock-closed-outline"
              secureTextEntry
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
              placeholder="Nhập lại mật khẩu"
              leftIconName="lock-closed-outline"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={showError('confirmPassword')}
            />
          )}
        />

        <Button
          title="Tiếp theo"
          onPress={handleSubmit(onValid, onInvalid)}
          loading={loading}
          style={styles.submitButton}
        />

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>Bằng việc đăng ký, bạn đồng ý với </Text>
          <TouchableOpacity>
            <Text style={styles.termsLink}>Điều khoản sử dụng</Text>
          </TouchableOpacity>
          <Text style={styles.termsText}> và </Text>
          <TouchableOpacity>
            <Text style={styles.termsLink}>Chính sách bảo mật</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 1,
    paddingTop: spacing.md,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  termsText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  termsLink: {
    ...typography.caption,
    color: colors.primary,
  },
});
