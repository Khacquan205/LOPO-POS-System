import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Screen, Button, TextField } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';
import { registerStaffSchema, RegisterStaffFormData } from '../../../lib/validation/auth.schema';
import { registerStaff } from '../services/auth.service';
import { ApiError } from '../../../lib/api/client';
import type { AuthScreenProps } from '../../../types/navigation';

type Props = AuthScreenProps<'RegisterStaff'>;

export const RegisterStaffScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
  } = useForm<RegisterStaffFormData>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(registerStaffSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const showError = (fieldName: keyof RegisterStaffFormData): string | undefined => {
    const value = watch(fieldName) || '';
    const isTouched = touchedFields[fieldName];
    const hasValue = value.trim().length > 0;
    const shouldShow = submitted || (isTouched && hasValue);
    return shouldShow ? errors[fieldName]?.message : undefined;
  };

  const onValid = async (data: RegisterStaffFormData): Promise<void> => {
    setLoading(true);
    try {
      await registerStaff(
        data.fullName,
        data.phone,
        data.password,
        data.confirmPassword,
      );
      Alert.alert('Đăng ký thành công', 'Vui lòng đăng nhập để tiếp tục', [
        {
          text: 'Đăng nhập',
          onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }),
        },
      ]);
    } catch (err: any) {
      if (err instanceof ApiError) {
        const detail = err.getFieldErrors();
        Alert.alert('Đăng ký thất bại', detail || 'Dữ liệu không hợp lệ');
      } else {
        Alert.alert('Lỗi', err.message || 'Không thể kết nối đến máy chủ');
      }
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = (): void => {
    setSubmitted(true);
  };

  const openTerms = (): void => {
    Linking.openURL('https://lopo.vn/terms');
  };
  const openPrivacy = (): void => {
    Linking.openURL('https://lopo.vn/privacy');
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
            <Text style={styles.title}>ĐĂNG KÝ NHÂN VIÊN</Text>
          </View>

          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Họ và tên"
                placeholder="Nhập họ và tên"
                leftIconName="person-outline"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={showError('fullName')}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Số điện thoại"
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
                leftIconName="call-outline"
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
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
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
                label="Nhập lại mật khẩu"
                placeholder="Xác nhận mật khẩu"
                leftIconName="lock-closed-outline"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={showError('confirmPassword')}
              />
            )}
          />

          <View style={styles.buttonWrapper}>
            <Button
              title="Hoàn tất"
              onPress={handleSubmit(onValid, onInvalid)}
              loading={loading}
              disabled={loading}
            />
          </View>

          <Text style={styles.termsText}>
            Bằng việc đăng ký, bạn đồng ý với{' '}
            <Text style={styles.linkText} onPress={openTerms}>
              Điều khoản dịch vụ
            </Text>{' '}
            và{' '}
            <Text style={styles.linkText} onPress={openPrivacy}>
              Chính sách bảo mật
            </Text>{' '}
            của LOPO.
          </Text>
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
  termsText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 18,
  },
  linkText: {
    color: colors.linkOrange,
  },
});
