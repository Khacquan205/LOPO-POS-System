import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, Modal, Pressable, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';
import { useStaffStore } from '../store/staff.store';
import { useAuthStore } from '../../../store/auth.store';
import { useToast } from '../../../ui/components/ToastContext';
import type { MainStackScreenProps } from '../../../types/navigation';

type Props = MainStackScreenProps<'EditStaff'>;

export const EditStaffScreen: React.FC<Props> = ({ route, navigation }) => {
  const { staffId } = route.params;
  const staff = useStaffStore((s) => s.staffList.find((x) => x.id === staffId));
  const updateStaffStatusApi = useStaffStore((s) => s.updateStaffStatusApi);
  const accessToken = useAuthStore((s) => s.accessToken);
  const { showSuccessToast, showErrorToast } = useToast();

  const [isActive, setIsActive] = useState(staff?.isActive ?? true);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!staff) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Chỉnh sửa nhân viên" showBack />
        <Text style={styles.notFound}>Không tìm thấy nhân viên</Text>
      </View>
    );
  }

  const hasChanged = isActive !== staff.isActive;

  const handleSave = async (): Promise<void> => {
    if (!hasChanged) {
      navigation.goBack();
      return;
    }
    if (!accessToken) {
      showErrorToast('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.');
      return;
    }
    setIsSaving(true);
    try {
      await updateStaffStatusApi(accessToken, staffId, isActive ? 'active' : 'inactive');
      showSuccessToast('Cập nhật trạng thái thành công!');
      navigation.navigate('Staff');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Cập nhật thất bại';
      showErrorToast(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = (): void => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title={staff.staffCode} showBack />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* Tên nhân viên (read-only) */}
        <Text style={styles.label}>Tên nhân viên</Text>
        <View style={styles.readonlyBox}>
          <Text style={styles.readonlyText}>{staff.name}</Text>
        </View>

        {/* Số điện thoại (read-only) */}
        <Text style={styles.label}>Số điện thoại</Text>
        <View style={styles.readonlyBox}>
          <Text style={styles.readonlyText}>{staff.phone}</Text>
        </View>

        {/* Trạng thái — có thể thay đổi */}
        <Text style={styles.label}>Trạng thái</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setSheetVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={[styles.dropdownText, isActive ? styles.textActive : styles.textInactive]}>
            {isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
          </Text>
          <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Bottom sheet chọn trạng thái */}
        <Modal
          visible={sheetVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setSheetVisible(false)}
        >
          <Pressable style={styles.backdrop} onPress={() => setSheetVisible(false)} />
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>CHỌN TRẠNG THÁI</Text>
            {([true, false] as const).map((val) => (
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
                {isActive === val && (
                  <Ionicons name="checkmark" size={18} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Modal>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} activeOpacity={0.7} disabled={isSaving}>
          <Ionicons name="close-circle" size={18} color={colors.secondary} />
          <Text style={styles.cancelText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveBtn, (isSaving || !hasChanged) && styles.saveBtnDisabled]}
          onPress={handleSave}
          activeOpacity={0.8}
          disabled={isSaving || !hasChanged}
        >
          {isSaving
            ? <ActivityIndicator size="small" color={colors.white} />
            : <Text style={styles.saveText}>{hasChanged ? 'Lưu' : 'Không có thay đổi'}</Text>
          }
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
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  readonlyBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: '#F8F9FA',
  },
  readonlyText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  dropdownText: {
    ...typography.body,
  },
  textActive: {
    color: colors.success,
    fontWeight: '600',
  },
  textInactive: {
    color: colors.textSecondary,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    opacity: 0.45,
  },
  saveText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
