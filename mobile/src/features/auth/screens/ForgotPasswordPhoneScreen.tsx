import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
    const value = watch(fieldName) || '';
    const isTouched = touchedFields[fieldName];
    const hasValue = value.trim().length > 0;
    const shouldShow = submitted || (isTouched && hasValue);
    return shouldShow ? errors[fieldName]?.message : undefined;
  };

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
            <Text style={styles.subtitle}>
              Nhập số điện thoại đã đăng ký để nhận mã xác thực
            </Text>
          </View>

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
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  buttonWrapper: {
    marginTop: spacing.lg,
  },
});
