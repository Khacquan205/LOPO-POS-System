import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';

import { Screen, Button, TextField } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';
import { registerOwnerSchema, RegisterOwnerFormData } from '../../../lib/validation/auth.schema';
import { registerOwner } from '../services/auth.service';
import { ApiError } from '../../../lib/api/client';
import type { AuthScreenProps } from '../../../types/navigation';

type Props = AuthScreenProps<'RegisterOwner'>;

export const RegisterOwnerScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<keyof RegisterOwnerFormData | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

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
    if (focusedField === fieldName) return undefined;
    const value = watch(fieldName) || '';
    const isTouched = touchedFields[fieldName];
    const hasValue = value.trim().length > 0;
    const shouldShow = submitted || (isTouched && hasValue);
    return shouldShow ? errors[fieldName]?.message : undefined;
  };

  const makeHandlers = (
    fieldName: keyof RegisterOwnerFormData,
    rhfOnBlur: () => void,
  ) => ({
    onFocus: () => setFocusedField(fieldName),
    onBlur: () => {
      setFocusedField(null);
      rhfOnBlur();
    },
  });

  const onValid = async (data: RegisterOwnerFormData): Promise<void> => {
    setLoading(true);
    try {
      await registerOwner(
        data.storeName,
        data.ownerName,
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
    } catch (error: any) {
      console.error('Register owner error:', error);

      if (error instanceof ApiError) {
        const detail = error.getFieldErrors();
        Alert.alert('Đăng ký thất bại', detail || 'Dữ liệu không hợp lệ');
      } else {
        Alert.alert('Đăng ký thất bại', error.message || 'Không thể kết nối đến máy chủ');
      }
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
        <Text style={styles.title}>ĐĂNG KÝ</Text>

        <Controller
          control={control}
          name="storeName"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>
                Tên cửa hàng <Text style={styles.required}>*</Text>
              </Text>
              <TextField
                placeholder="Ví dụ: Hồng Phát"
                value={value}
                onChangeText={onChange}
                error={showError('storeName')}
                {...makeHandlers('storeName', onBlur)}
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name="ownerName"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>
                Tên chủ cửa hàng <Text style={styles.required}>*</Text>
              </Text>
              <TextField
                placeholder="Ví dụ: Nguyễn Văn A"
                value={value}
                onChangeText={onChange}
                error={showError('ownerName')}
                {...makeHandlers('ownerName', onBlur)}
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>
                Số điện thoại <Text style={styles.required}>*</Text>
              </Text>
              <TextField
                placeholder="Ví dụ: 0365416XXX"
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
                error={showError('phone')}
                {...makeHandlers('phone', onBlur)}
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>
                Mật khẩu <Text style={styles.required}>*</Text>
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
          title="Tiếp theo"
          onPress={handleSubmit(onValid, onInvalid)}
          loading={loading}
          style={styles.submitButton}
        />

        <View style={styles.noticeBox}>
          <Text style={styles.noticeText}>
            Khi chọn Hoàn tất đồng nghĩa với việc bạn đã chấp thuận các{' '}
            <Text style={styles.noticeLink}>Điều khoản sử dụng</Text> và{' '}
            <Text style={styles.noticeLink}>Chính sách bảo mật</Text> của chúng tôi.
          </Text>
        </View>
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
  noticeBox: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: '#EAF1FF',
    borderRadius: 10,
  },
  noticeText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  noticeLink: {
    color: colors.primary,
  },
});