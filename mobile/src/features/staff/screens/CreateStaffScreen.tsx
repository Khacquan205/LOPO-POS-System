import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';
import { ApiError } from '../../../lib/api/client';
import { useAuthStore } from '../../../store/auth.store';
import { useStaffStore } from '../store/staff.store';
import { createOwnerStaff } from '../services/staff.service';
import { useToast } from '../../../ui/components/ToastContext';
import type { MainStackScreenProps } from '../../../types/navigation';

type Props = MainStackScreenProps<'CreateStaff'>;

export const CreateStaffScreen: React.FC<Props> = ({ navigation }) => {
  const fetchStaffList = useStaffStore((s) => s.fetchStaffList);
  const accessToken = useAuthStore((s) => s.accessToken);
  const { showSuccessToast, showErrorToast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPhoneValid = (val: string): boolean => /^0\d{9}$/.test(val.trim());
  const isPasswordValid = (val: string): boolean =>
    /[A-Z]/.test(val) && /[a-z]/.test(val) && /[0-9]/.test(val) && /[^A-Za-z0-9]/.test(val);

  const handlePhoneChange = (val: string): void => {
    setPhone(val);
    if (val.trim() && !isPhoneValid(val)) {
      setPhoneError('Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0');
    } else {
      setPhoneError('');
    }
  };

  const handleConfirmPasswordChange = (val: string): void => {
    setConfirmPassword(val);
    if (val && val !== password) {
      setConfirmPasswordError('Mật khẩu xác nhận không khớp');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleCreate = async (): Promise<void> => {
    if (!accessToken) {
      showErrorToast('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
      return;
    }

    if (!name.trim() || !isPhoneValid(phone)) return;
    if (!isPasswordValid(password)) {
      showErrorToast('Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt');
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsSubmitting(true);
    try {
      await createOwnerStaff(accessToken, {
        full_name: name.trim(),
        phone_number: phone.trim(),
        password,
        confirm_password: confirmPassword,
      });

      await fetchStaffList(accessToken);
      showSuccessToast('Tạo tài khoản nhân viên thành công!');
      navigation.navigate('Staff');
    } catch (error) {
      if (error instanceof ApiError) {
        showErrorToast(error.getFieldErrors() || error.message);
      } else if (error instanceof Error) {
        showErrorToast(error.message);
      } else {
        showErrorToast('Không thể tạo tài khoản nhân viên');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (): void => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="TẠO MỚI NHÂN VIÊN" showBack />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* Tên nhân viên */}
        <Text style={styles.label}>
          Tên nhân viên <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nhập tên nhân viên"
          placeholderTextColor={colors.textSecondary}
        />

        {/* Số điện thoại */}
        <Text style={styles.label}>
          Số điện thoại <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, phoneError ? styles.inputError : null]}
          value={phone}
          onChangeText={handlePhoneChange}
          placeholder="Nhập số điện thoại"
          placeholderTextColor={colors.textSecondary}
          keyboardType="phone-pad"
          maxLength={10}
        />
        {!!phoneError && <Text style={styles.errorText}>{phoneError}</Text>}

        <Text style={styles.label}>
          Mật khẩu <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Nhập mật khẩu"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          autoCapitalize="none"
        />

        <Text style={styles.label}>
          Xác nhận mật khẩu <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, confirmPasswordError ? styles.inputError : null]}
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          placeholder="Nhập lại mật khẩu"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          autoCapitalize="none"
        />
        {!!confirmPasswordError && <Text style={styles.errorText}>{confirmPasswordError}</Text>}

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} activeOpacity={0.7}>
          <Ionicons name="close-circle" size={18} color={colors.secondary} />
          <Text style={styles.cancelText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.createBtn,
            (!name.trim() || !isPhoneValid(phone) || !password || !confirmPassword || isSubmitting)
              && styles.createBtnDisabled,
          ]}
          onPress={handleCreate}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          <Text style={styles.createText}>{isSubmitting ? 'Đang tạo...' : 'Tạo mới'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  label: {
    ...typography.caption,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  required: {
    color: colors.error,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  cancelText: {
    ...typography.body,
    color: colors.secondary,
    fontWeight: '500',
  },
  createBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  createBtnDisabled: {
    opacity: 0.5,
  },
  createText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
