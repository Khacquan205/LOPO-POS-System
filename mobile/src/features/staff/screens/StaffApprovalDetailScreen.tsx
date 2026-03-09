import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';
import { useStaffStore } from '../store/staff.store';
import { useToast } from '../../../ui/components/ToastContext';
import type { MainStackScreenProps } from '../../../types/navigation';

type Props = MainStackScreenProps<'StaffApprovalDetail'>;

export const StaffApprovalDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { approvalId } = route.params;
  const item = useStaffStore((s) => s.approvalList.find((a) => a.id === approvalId));
  const setApprovalStatus = useStaffStore((s) => s.setApprovalStatus);
  const blockApproval = useStaffStore((s) => s.blockApproval);
  const { showSuccessToast, showErrorToast, showWarningToast } = useToast();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [rejectVisible, setRejectVisible] = useState(false);
  const [blockVisible, setBlockVisible] = useState(false);

  if (!item) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Chi tiết" showBack />
        <Text style={styles.notFound}>Không tìm thấy dữ liệu</Text>
      </View>
    );
  }

  const isPending = item.status === 'pending';
  const isWarnedPending = isPending && item.rejectedCount >= 3;

  const statusLabel =
    item.status === 'pending'  ? 'Chờ duyệt'
    : item.status === 'approved' ? 'Đã duyệt'
    : item.status === 'rejected' ? 'Đã từ chối'
    : 'Đã bị chặn';

  const statusColor =
    item.status === 'pending'  ? colors.secondary
    : item.status === 'approved' ? '#22c55e'
    : item.status === 'rejected' ? colors.error
    : colors.secondary;

  const handleApprove = (): void => {
    setConfirmVisible(true);
  };

  const confirmApprove = (): void => {
    setApprovalStatus(item.id, 'approved');
    showSuccessToast('Duyệt thành công!');
    setConfirmVisible(false);
    navigation.goBack();
  };

  const handleReject = (): void => {
    setRejectVisible(true);
  };

  const confirmReject = (): void => {
    setApprovalStatus(item.id, 'rejected');
    showErrorToast('Từ chối thành công!');
    setRejectVisible(false);
    navigation.goBack();
  };

  const handleBlock = (): void => {
    setBlockVisible(true);
  };

  const confirmBlock = (): void => {
    blockApproval(item.id);
    showWarningToast('Chặn thành công!');
    setBlockVisible(false);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title={item.staffCode} showBack />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Action buttons — only for pending */}
        {isPending && (
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.approveBtn} onPress={handleApprove} activeOpacity={0.8}>
              <Ionicons name="checkmark" size={16} color={colors.white} />
              <Text style={styles.approveBtnText}>Duyệt</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectBtn} onPress={handleReject} activeOpacity={0.8}>
              <Ionicons name="close-circle-outline" size={16} color={colors.primary} />
              <Text style={styles.rejectBtnText}>Từ chối</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Info card */}
        <View style={styles.card}>
          {/* Created at */}
          <Text style={styles.createdAt}>{item.createdAt}</Text>

          <View style={styles.divider} />

          {/* Rows */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tên nhân viên</Text>
            <Text style={styles.infoValue}>{item.name}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số điện thoại</Text>
            <Text style={styles.infoValue}>{item.phone}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Trạng thái</Text>
            <Text style={[styles.infoValue, { color: statusColor }]}>{statusLabel}</Text>
          </View>

          {/* Rejected count — only show if > 0 */}
          {item.rejectedCount > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Đã bị từ chối</Text>
                <Text style={[styles.infoValue, styles.rejectedCount]}>
                  {item.rejectedCount} lần
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Block button — only show for warned pending */}
        {isWarnedPending && (
          <TouchableOpacity style={styles.blockBtn} onPress={handleBlock} activeOpacity={0.8}>
            <Ionicons name="close-circle-outline" size={18} color={colors.white} />
            <Text style={styles.blockBtnText}>Chặn người dùng</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Approve confirmation modal */}
      <Modal visible={confirmVisible} transparent animationType="fade" onRequestClose={() => setConfirmVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setConfirmVisible(false)}>
          <Pressable style={styles.modalBox} onPress={() => {}}>
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark" size={40} color={colors.white} />
            </View>
            <Text style={styles.modalTitle}>Xác nhận duyệt nhân viên!</Text>
            <Text style={styles.modalMessage}>
              Bạn có chắn muốn duyệt{' '}
              <Text style={styles.modalName}>"{item.name}"</Text>{' '}
              làm nhân viên không?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setConfirmVisible(false)} activeOpacity={0.7}>
                <Text style={styles.modalCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalOk} onPress={confirmApprove} activeOpacity={0.7}>
                <Text style={styles.modalOkText}>OK</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Reject confirmation modal */}
      <Modal visible={rejectVisible} transparent animationType="fade" onRequestClose={() => setRejectVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setRejectVisible(false)}>
          <Pressable style={styles.modalBox} onPress={() => {}}>
            <View style={[styles.iconCircle, styles.iconCircleRed]}>
              <Ionicons name="close" size={40} color={colors.white} />
            </View>
            <Text style={[styles.modalTitle, styles.modalTitleRed]}>Xác nhận từ chối duyệt nhân viên!</Text>
            <Text style={styles.modalMessage}>
              Bạn có chắn muốn từ chối{' '}
              <Text style={styles.modalName}>"{item.name}"</Text>{' '}
              làm nhân viên không?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setRejectVisible(false)} activeOpacity={0.7}>
                <Text style={styles.modalCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalOk} onPress={confirmReject} activeOpacity={0.7}>
                <Text style={styles.modalOkText}>OK</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Block confirmation modal */}
      <Modal visible={blockVisible} transparent animationType="fade" onRequestClose={() => setBlockVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setBlockVisible(false)}>
          <Pressable style={styles.modalBox} onPress={() => {}}>
            <View style={[styles.iconCircle, styles.iconCircleOrange]}>
              <Text style={styles.iconI}>i</Text>
            </View>
            <Text style={[styles.modalTitle, styles.modalTitleOrange]}>
              Người dùng này đã bị từ chối {item.rejectedCount} lần. Bạn có muốn chặn họ khỏi yêu cầu không?
            </Text>
            <Text style={styles.modalMessage}>
              Bạn có chắn muốn chặn{' '}
              <Text style={styles.modalName}>"{item.name}"</Text>{' '}
              làm nhân viên không?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setBlockVisible(false)} activeOpacity={0.7}>
                <Text style={styles.modalCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalOk} onPress={confirmBlock} activeOpacity={0.7}>
                <Text style={styles.modalOkText}>OK</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
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
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.sm + 2,
    gap: 6,
  },
  approveBtnText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '700',
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.sm + 2,
    gap: 6,
  },
  rejectBtnText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    overflow: 'hidden',
  },
  createdAt: {
    ...typography.caption,
    color: colors.textSecondary,
    paddingVertical: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
  },
  infoLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  infoValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
    textAlign: 'right',
    flexShrink: 1,
    marginLeft: spacing.sm,
  },
  rejectedCount: {
    color: colors.error,
  },
  blockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 10,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
    gap: 8,
  },
  blockBtnText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  // ── Confirm modal ──────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalBox: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.xl,
    alignItems: 'center',
    width: '100%',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconCircleRed: {
    backgroundColor: colors.error,
  },
  iconCircleOrange: {
    backgroundColor: colors.secondary,
  },
  iconI: {
    color: colors.white,
    fontSize: 36,
    fontWeight: '700',
    fontStyle: 'italic',
  },
  modalTitle: {
    ...typography.body,
    fontWeight: '700',
    fontSize: 16,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  modalTitleRed: {
    color: colors.error,
  },
  modalTitleOrange: {
    color: colors.secondary,
  },
  modalMessage: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  modalName: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  modalCancel: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  modalCancelText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  modalOk: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  modalOkText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
  },
});
