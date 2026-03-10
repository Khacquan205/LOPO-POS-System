import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';

import { Screen, Button, TextField } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';
import {
  forgotPasswordPhoneSchema,
  ForgotPasswordPhoneFormData,
} from '../../../lib/validation/auth.schema';
import { sendOtp } from '../services/auth.mock';
import type { AuthScreenProps } from '../../../types/navigation';

type Props = AuthScreenProps<'ForgotPasswordPhone'>;

export const ForgotPasswordPhoneScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<keyof ForgotPasswordPhoneFormData | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
  } = useForm<ForgotPasswordPhoneFormData>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(forgotPasswordPhoneSchema),
    defaultValues: {
      phone: '',
    },
  });

  const showError = (fieldName: keyof ForgotPasswordPhoneFormData): string | undefined => {
    if (focusedField === fieldName) return undefined;
    const value = String(watch(fieldName) ?? '');
    const isTouched = touchedFields[fieldName];
    const hasValue = value.trim().length > 0;
    const shouldShow = submitted || (isTouched && hasValue);
    return shouldShow ? (errors[fieldName] as { message?: string } | undefined)?.message : undefined;
  };

  const makeHandlers = (
    fieldName: keyof ForgotPasswordPhoneFormData,
    rhfOnBlur: () => void,
  ) => ({
    onFocus: () => setFocusedField(fieldName),
    onBlur: () => {
      setFocusedField(null);
      rhfOnBlur();
    },
  });

  const onValid = async (data: ForgotPasswordPhoneFormData): Promise<void> => {
    setLoading(true);
    try {
      await sendOtp(data.phone);
      navigation.navigate('ForgotPasswordOtp', { phone: data.phone });
    } catch (err) {
      console.error(err);
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
        <Text style={styles.subtitle}>
          Nhập số điện thoại đã đăng ký để nhận mã xác thực
        </Text>

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
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
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
