import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TextInput, TouchableOpacity, Modal, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';
import { StaffApproval } from '../mock/staff.mock';
import { useStaffStore } from '../store/staff.store';
import { useToast } from '../../../ui/components/ToastContext';
import type { MainStackScreenProps } from '../../../types/navigation';

type Props = MainStackScreenProps<'StaffApproval'>;

export const StaffApprovalScreen: React.FC<Props> = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmName, setConfirmName] = useState('');
  const [rejectConfirmId, setRejectConfirmId] = useState<string | null>(null);
  const [rejectConfirmName, setRejectConfirmName] = useState('');
  const [blockConfirmId, setBlockConfirmId] = useState<string | null>(null);
  const [blockConfirmName, setBlockConfirmName] = useState('');
  const [blockConfirmCount, setBlockConfirmCount] = useState(0);
  const approvalList = useStaffStore((s) => s.approvalList);
  const setApprovalStatus = useStaffStore((s) => s.setApprovalStatus);
  const blockApproval = useStaffStore((s) => s.blockApproval);
  const { showSuccessToast, showErrorToast, showWarningToast } = useToast();

  const filtered = approvalList.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.phone.includes(search),
  );

  const handleApprove = (id: string, name: string): void => {
    setConfirmId(id);
    setConfirmName(name);
  };

  const confirmApprove = (): void => {
    if (!confirmId) return;
    setApprovalStatus(confirmId, 'approved');
    showSuccessToast('Duyệt thành công!');
    setConfirmId(null);
  };

  const handleReject = (id: string, name: string): void => {
    setRejectConfirmId(id);
    setRejectConfirmName(name);
  };

  const confirmReject = (): void => {
    if (!rejectConfirmId) return;
    setApprovalStatus(rejectConfirmId, 'rejected');
    showErrorToast('Từ chối thành công!');
    setRejectConfirmId(null);
  };

  const handleBlock = (id: string, name: string, count: number): void => {
    setBlockConfirmId(id);
    setBlockConfirmName(name);
    setBlockConfirmCount(count);
  };

  const confirmBlock = (): void => {
    if (!blockConfirmId) return;
    blockApproval(blockConfirmId);
    showWarningToast('Chặn thành công!');
    setBlockConfirmId(null);
  };

  const renderItem = ({ item }: { item: StaffApproval }) => {
    const isWarnedPending = item.status === 'pending' && item.rejectedCount >= 3;
    const isPending = item.status === 'pending';

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('StaffApprovalDetail', { approvalId: item.id })}
      >
        {/* Row 1: date + warned badge row */}
        <View style={styles.topRow}>
          <Text style={styles.createdAt}>{item.createdAt}</Text>
          {isWarnedPending && (
            <TouchableOpacity
              style={styles.blockBtn}
              onPress={(e) => { e.stopPropagation?.(); handleBlock(item.id, item.name, item.rejectedCount); }}
              activeOpacity={0.7}
            >
              <Text style={styles.blockBtnText}>Chặn người dùng</Text>
            </TouchableOpacity>
          )}
          {!isPending && (
            <Text style={[
              styles.statusText,
              item.status === 'approved' && styles.approved,
              item.status === 'rejected' && styles.rejected,
              item.status === 'blocked'  && styles.blocked,
            ]}>
              {item.status === 'approved' ? 'Đã duyệt'
                : item.status === 'rejected' ? 'Đã từ chối'
                : 'Đã bị chặn'}
            </Text>
          )}
        </View>

        {/* Warned label */}
        {isWarnedPending && (
          <Text style={styles.warnedText}>
            Đã bị từ chối {item.rejectedCount} lần
          </Text>
        )}

        {/* Row 2: name */}
        <Text style={styles.staffName}>{item.name}</Text>

        {/* Row 3: code + phone */}
        <View style={styles.infoRow}>
          <Text style={styles.staffCode}>{item.staffCode}</Text>
          <View style={styles.phoneRow}>
            <Ionicons name="call-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.staffPhone}> {item.phone}</Text>
          </View>
        </View>

        {/* Action buttons for pending */}
        {isPending && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.approveBtn}
              onPress={(e) => { e.stopPropagation?.(); handleApprove(item.id, item.name); }}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark" size={16} color={colors.white} />
              <Text style={styles.approveBtnText}>Duyệt</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={(e) => { e.stopPropagation?.(); handleReject(item.id, item.name); }}
              activeOpacity={0.8}
            >
              <Ionicons name="close-circle-outline" size={16} color={colors.primary} />
              <Text style={styles.rejectBtnText}>Từ chối</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="DUYỆT NHÂN VIÊN"
        showBack
        rightIcon="options-outline"
      />

      {/* Search bar */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Nhập tên người dùng hoặc số điện thoại"
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
      />

      {/* Approve confirmation modal */}
      <Modal visible={!!confirmId} transparent animationType="fade" onRequestClose={() => setConfirmId(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setConfirmId(null)}>
          <Pressable style={styles.modalBox} onPress={() => {}}>
            {/* Green checkmark */}
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark" size={40} color={colors.white} />
            </View>
            <Text style={styles.modalTitle}>Xác nhận duyệt nhân viên!</Text>
            <Text style={styles.modalMessage}>
              Bạn có chắn muốn duyệt{' '}
              <Text style={styles.modalName}>"{confirmName}"</Text>{' '}
              làm nhân viên không?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setConfirmId(null)} activeOpacity={0.7}>
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
      <Modal visible={!!rejectConfirmId} transparent animationType="fade" onRequestClose={() => setRejectConfirmId(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setRejectConfirmId(null)}>
          <Pressable style={styles.modalBox} onPress={() => {}}>
            <View style={[styles.iconCircle, styles.iconCircleRed]}>
              <Ionicons name="close" size={40} color={colors.white} />
            </View>
            <Text style={[styles.modalTitle, styles.modalTitleRed]}>Xác nhận từ chối duyệt nhân viên!</Text>
            <Text style={styles.modalMessage}>
              Bạn có chắn muốn từ chối{' '}
              <Text style={styles.modalName}>"{rejectConfirmName}"</Text>{' '}
              làm nhân viên không?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setRejectConfirmId(null)} activeOpacity={0.7}>
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
      <Modal visible={!!blockConfirmId} transparent animationType="fade" onRequestClose={() => setBlockConfirmId(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setBlockConfirmId(null)}>
          <Pressable style={styles.modalBox} onPress={() => {}}>
            <View style={[styles.iconCircle, styles.iconCircleOrange]}>
              <Text style={styles.iconI}>i</Text>
            </View>
            <Text style={[styles.modalTitle, styles.modalTitleOrange]}>
              Người dùng này đã bị từ chối {blockConfirmCount} lần. Bạn có muốn chặn họ khỏi yêu cầu không?
            </Text>
            <Text style={styles.modalMessage}>
              Bạn có chắn muốn chặn{' '}
              <Text style={styles.modalName}>"{blockConfirmName}"</Text>{' '}
              làm nhân viên không?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setBlockConfirmId(null)} activeOpacity={0.7}>
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
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.background,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.textPrimary,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  card: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  createdAt: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  warnedText: {
    ...typography.caption,
    color: colors.error,
    marginBottom: 2,
  },
  staffName: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  staffCode: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  staffPhone: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '600',
  },
  approved: {
    color: '#22c55e',
  },
  rejected: {
    color: colors.error,
  },
  blocked: {
    color: colors.secondary,
  },
  blockBtn: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  blockBtnText: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    gap: 4,
  },
  approveBtnText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    gap: 4,
  },
  rejectBtnText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
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
