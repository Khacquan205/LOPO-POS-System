import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Modal, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';
import { useStaffStore } from '../store/staff.store';
import { useToast } from '../../../ui/components/ToastContext';
import type { MainStackScreenProps } from '../../../types/navigation';

type Props = MainStackScreenProps<'EditStaff'>;

export const EditStaffScreen: React.FC<Props> = ({ route, navigation }) => {
  const { staffId } = route.params;
  const staff = useStaffStore((s) => s.staffList.find((x) => x.id === staffId));
  const updateStaff = useStaffStore((s) => s.updateStaff);
  const { showSuccessToast } = useToast();

  const [name, setName] = useState(staff?.name ?? '');
  const [phone, setPhone] = useState(staff?.phone ?? '');
  const [phoneError, setPhoneError] = useState('');
  const [isActive, setIsActive] = useState(staff?.isActive ?? true);
  const [sheetVisible, setSheetVisible] = useState(false);

  const isPhoneValid = (val: string): boolean => /^\d{10}$/.test(val.trim());

  const handlePhoneChange = (val: string): void => {
    setPhone(val);
    if (val.trim() && !isPhoneValid(val)) {
      setPhoneError('Số điện thoại phải đủ 10 chữ số');
    } else {
      setPhoneError('');
    }
  };

  if (!staff) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Chỉnh sửa nhân viên" showBack />
        <Text style={styles.notFound}>Không tìm thấy nhân viên</Text>
      </View>
    );
  }

  const handleSave = (): void => {
    if (!name.trim() || !isPhoneValid(phone)) return;
    updateStaff(staffId, { name: name.trim(), phone: phone.trim(), isActive });
    showSuccessToast('Chỉnh sửa thành công!');
    navigation.navigate('Staff');
  };

  const handleCancel = (): void => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title={staff.staffCode} showBack />

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

        {/* Trạng thái */}
        <Text style={styles.label}>Trạng thái</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setSheetVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.dropdownText}>
            {isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
          </Text>
          <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Bottom sheet modal */}
        <Modal
          visible={sheetVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setSheetVisible(false)}
        >
          <Pressable style={styles.backdrop} onPress={() => setSheetVisible(false)} />
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>CHỌN TRẠNG THÁI</Text>
            {[true, false].map((val) => (
              <TouchableOpacity
                key={String(val)}
                style={styles.sheetOption}
                onPress={() => { setIsActive(val); setSheetVisible(false); }}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.sheetOptionText,
                  isActive === val && styles.sheetOptionActive,
                ]}>
                  {val ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} activeOpacity={0.7}>
          <Ionicons name="close-circle" size={18} color={colors.secondary} />
          <Text style={styles.cancelText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.saveBtn, (!name.trim() || !isPhoneValid(phone)) && styles.saveBtnDisabled]} onPress={handleSave} activeOpacity={0.8}>
          <Text style={styles.saveText}>Lưu</Text>
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
  notFound: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
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
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  dropdownText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  sheetTitle: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
    fontSize: 15,
    marginBottom: spacing.sm,
  },
  sheetOption: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sheetOptionText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  sheetOptionActive: {
    color: colors.primary,
    fontWeight: '600',
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
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
