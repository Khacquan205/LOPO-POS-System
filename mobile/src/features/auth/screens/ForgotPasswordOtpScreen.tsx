import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { Screen, Button } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';
import { OtpInput } from '../components/OtpInput';
import { Ionicons } from '@expo/vector-icons';
import { verifyOtp, sendOtp } from '../services/auth.mock';
import type { AuthScreenProps } from '../../../types/navigation';

const RESEND_TIMEOUT = 90;

type Props = AuthScreenProps<'ForgotPasswordOtp'>;

export const ForgotPasswordOtpScreen: React.FC<Props> = ({ navigation, route }) => {
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const phone = route?.params?.phone || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_TIMEOUT);
  const [error, setError] = useState('');

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}s`;
  }, []);

  const handleResend = async (): Promise<void> => {
    if (countdown > 0) return;
    try {
      await sendOtp(phone);
      setCountdown(RESEND_TIMEOUT);
      setOtp('');
      setError('');
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = async (): Promise<void> => {
    if (otp.length !== 6) {
      setError('Vui lòng nhập đủ 6 số');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await verifyOtp(phone, otp);
      navigation.navigate('ForgotPasswordReset', { phone, otp });
    } catch (err: any) {
      setError(err.message || 'Mã OTP không đúng');
    } finally {
      setLoading(false);
    }
  };

  const isValid = otp.length === 6;

  return (
    <Screen scroll>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.form}>
        <Text style={styles.title}>QUÊN MẬT KHẨU</Text>
        <Text style={styles.subtitle}>
          Mã xác thực đã được gửi đến số{' '}
          <Text style={styles.phoneHighlight}>{phone}</Text>
        </Text>

        <View style={styles.otpWrapper}>
          <OtpInput value={otp} onChange={setOtp} error={!!error} />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <Text
          style={[
            styles.resendText,
            countdown > 0 ? styles.resendDisabled : styles.resendActive,
          ]}
          onPress={handleResend}
        >
          {countdown > 0
            ? `Gửi lại mã xác thực (${formatTime(countdown)})`
            : 'Gửi lại mã xác thực'}
        </Text>

        <Button
          title="Xác nhận"
          onPress={onSubmit}
          loading={loading}
          disabled={loading || !isValid}
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
  phoneHighlight: {
    color: colors.primary,
    fontWeight: '600',
  },
  otpWrapper: {
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  resendText: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  resendDisabled: {
    color: colors.textSecondary,
  },
  resendActive: {
    color: colors.linkOrange,
  },
  submitButton: {
    marginTop: spacing.md,
  },
});
