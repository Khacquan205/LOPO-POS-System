import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Screen, Button, TextField, Divider } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';
import { loginSchema, LoginFormData } from '../../../lib/validation/auth.schema';
import { useAuthStore } from '../../../store/auth.store';
import { login } from '../services/auth.service';
import { ApiError } from '../../../lib/api/client';
import type { AuthScreenProps } from '../../../types/navigation';

type Props = AuthScreenProps<'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<keyof LoginFormData | null>(null);
  const { setAuth } = useAuthStore();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
  } = useForm<LoginFormData>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  });

  const showError = (fieldName: keyof LoginFormData): string | undefined => {
    if (focusedField === fieldName) return undefined;
    const value = watch(fieldName) || '';
    const isTouched = touchedFields[fieldName];
    const hasValue = value.trim().length > 0;
    const shouldShow = submitted || (isTouched && hasValue);
    return shouldShow ? errors[fieldName]?.message : undefined;
  };

  const makeHandlers = (
    fieldName: keyof LoginFormData,
    rhfOnBlur: () => void,
  ) => ({
    onFocus: () => setFocusedField(fieldName),
    onBlur: () => {
      setFocusedField(null);
      rhfOnBlur();
    },
  });

  const onValid = async (data: LoginFormData): Promise<void> => {
    setLoading(true);
    try {
      const result = await login(data.phone, data.password);
      await setAuth(result);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' as any }],
      });
    } catch (error: any) {
      console.error('Login error:', error);
      if (error instanceof ApiError) {
        if (error.statusCode === 401) {
          Alert.alert('Đăng nhập thất bại', 'Số điện thoại hoặc mật khẩu không đúng');
        } else if (error.statusCode === 403) {
          Alert.alert('Tài khoản bị khóa', error.message || 'Tài khoản của bạn đã bị vô hiệu hóa hoặc bị khóa');
        } else if (error.statusCode === 422) {
          Alert.alert('Dữ liệu không hợp lệ', 'Vui lòng kiểm tra lại thông tin');
        } else {
          Alert.alert('Đăng nhập thất bại', error.message || 'Có lỗi xảy ra');
        }
      } else {
        Alert.alert('Đăng nhập thất bại', error.message || 'Không thể kết nối đến máy chủ');
      }
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = (): void => {
    setSubmitted(true);
  };

  const handleCallSupport = (): void => {
    Linking.openURL('tel:1900123456');
  };

  return (
    <Screen scroll keyboardAvoiding style={styles.screen}>
      <View style={styles.header}>
        <Image
          source={require('../../../../assets/IconLopo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.title}>ĐĂNG NHẬP</Text>
      </View>

      <View style={styles.form}>
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
              error={showError('phone')}
              {...makeHandlers('phone', onBlur)}
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
              error={showError('password')}
              {...makeHandlers('password', onBlur)}
            />
          )}
        />

        <Button
          title="Đăng nhập"
          onPress={handleSubmit(onValid, onInvalid)}
          loading={loading}
          style={styles.submitButton}
        />

        <View style={styles.linksRow}>
          <TouchableOpacity onPress={() => navigation.navigate('RegisterSelectRole')}>
            <Text style={styles.linkOrange}>Đăng ký ngay</Text>
          </TouchableOpacity>

          <Divider
            vertical
            thickness={1}
            spacing={spacing.md}
            style={styles.linkDivider}
          />

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordPhone')}>
            <Text style={styles.linkOrange}>Lấy lại mật khẩu</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleCallSupport}>
          <Text style={styles.supportLink}>Gọi trung tâm hỗ trợ</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  logoImage: {
    width: 90,
    height: 90,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.screenTitle,
    color: colors.primary,
  },
  form: {
    flex: 1,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  linkOrange: {
    ...typography.bodyMedium,
    color: colors.linkOrange,
  },
  linkDivider: {
    height: 16,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  supportLink: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
});