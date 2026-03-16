import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';
import { useStaffStore } from '../store/staff.store';
import { useAuthStore } from '../../../store/auth.store';
import { useToast } from '../../../ui/components/ToastContext';
import type { MainStackScreenProps } from '../../../types/navigation';

type Props = MainStackScreenProps<'StaffDetail'>;

export const StaffDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { staffId } = route.params;
  const staff = useStaffStore((s) => s.staffList.find((x) => x.id === staffId));
  const deleteStaffApi = useStaffStore((s) => s.deleteStaffApi);
  const accessToken = useAuthStore((s) => s.accessToken);
  const { showSuccessToast, showErrorToast } = useToast();
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!staff) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Chi tiết nhân viên" showBack />
        <Text style={styles.notFound}>Không tìm thấy nhân viên</Text>
      </View>
    );
  }

  const handleDelete = (): void => {
    setDeleteVisible(true);
  };

  const confirmDelete = async (): Promise<void> => {
    if (!accessToken) {
      Alert.alert('Lỗi', 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.');
      return;
    }
    setIsDeleting(true);
    try {
      await deleteStaffApi(accessToken, staffId);
      setDeleteVisible(false);
      showSuccessToast(`Đã xóa nhân viên ${staff.name} khỏi hệ thống!`);
      navigation.navigate('Staff');
    } catch (err: unknown) {
      setDeleteVisible(false);
      const msg = err instanceof Error ? err.message : 'Xóa nhân viên thất bại';
      showErrorToast(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (): void => {
    navigation.navigate('EditStaff', { staffId: staff.id });
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title={staff.staffCode} showBack />

      <View style={styles.card}>
        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.btnEdit} onPress={handleEdit} activeOpacity={0.8}>
            <Ionicons name="pencil" size={14} color={colors.white} />
            <Text style={styles.btnEditText}>Chỉnh sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnDelete} onPress={handleDelete} activeOpacity={0.8}>
            <Ionicons name="close-circle" size={14} color={colors.white} />
            <Text style={styles.btnDeleteText}>Xóa</Text>
          </TouchableOpacity>
        </View>

        {/* Info rows */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Tên nhân viên</Text>
          <Text style={styles.value}>{staff.name}</Text>
        </View>
        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.label}>Số điện thoại</Text>
          <Text style={styles.value}>{staff.phone}</Text>
        </View>
        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.label}>Trạng thái</Text>
          <Text style={[styles.value, staff.isActive ? styles.active : styles.inactive]}>
            {staff.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
          </Text>
        </View>
      </View>

      {/* Delete confirmation modal */}
      <Modal visible={deleteVisible} transparent animationType="fade" onRequestClose={() => !isDeleting && setDeleteVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            {/* Icon */}
            <View style={styles.iconOuter}>
              <View style={styles.iconInner}>
                <Text style={styles.iconText}>!</Text>
              </View>
            </View>

            <Text style={styles.modalTitle}>Xác nhận xóa nhân viên!</Text>
            <Text style={styles.modalBody}>
              Bạn có chắc muốn xóa{'\n'}
              <Text style={styles.modalBold}>{staff.name}</Text>
              {'\n'}khỏi hệ thống?{'\n'}
              <Text style={styles.modalWarn}>Hành động này không thể hoàn tác.</Text>
            </Text>

            <View style={styles.modalDivider} />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setDeleteVisible(false)}
                activeOpacity={0.7}
                disabled={isDeleting}
              >
                <Text style={styles.modalBtnCancelText}>HỦY</Text>
              </TouchableOpacity>
              <View style={styles.modalBtnDivider} />
              <TouchableOpacity
                style={styles.modalBtnOk}
                onPress={confirmDelete}
                activeOpacity={0.7}
                disabled={isDeleting}
              >
                {isDeleting
                  ? <ActivityIndicator size="small" color={colors.error} />
                  : <Text style={styles.modalBtnOkText}>XÓA</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  card: {
    margin: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  btnEdit: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm + 2,
    borderRadius: 8,
  },
  btnEditText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
  btnDelete: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.error,
    paddingVertical: spacing.sm + 2,
    borderRadius: 8,
  },
  btnDeleteText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  label: {
    ...typography.body,
    color: colors.textPrimary,
  },
  value: {
    ...typography.body,
    color: colors.textPrimary,
  },
  active: {
    color: colors.success,
    fontWeight: '500',
  },
  inactive: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  // ── Delete modal ──────────────────────────────────────────
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  modalBox: {
    backgroundColor: colors.white,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    paddingTop: spacing.xl,
    overflow: 'hidden',
  },
  iconOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 32,
  },
  modalTitle: {
    ...typography.body,
    color: colors.error,
    fontWeight: '700',
    fontSize: 15,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  modalBody: {
    ...typography.body,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  modalBold: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalWarn: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  modalDivider: {
    height: 1,
    backgroundColor: colors.border,
    width: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
  },
  modalBtnCancel: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  modalBtnCancelText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalBtnDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  modalBtnOk: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  modalBtnOkText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.error,
  },
});
