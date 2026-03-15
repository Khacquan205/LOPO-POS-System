import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../store/auth.store';
import { colors, spacing, typography } from '../../../ui/theme';
import { requestJoinStoreByQr } from '../services/scanQrJob.service';
import type { MainStackScreenProps } from '../../../types/navigation';

type Props = MainStackScreenProps<'QrJobConfirm'>;

export const QrJobConfirmScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { qr_code, store_name, owner_name, owner_phone } = route.params;

  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultModal, setResultModal] = useState<
    | { type: 'success' }
    | { type: 'error'; message: string }
    | null
  >(null);

  const handleConfirm = async () => {
    if (!accessToken || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await requestJoinStoreByQr(accessToken, qr_code);
      setResultModal({ type: 'success' });
    } catch (err: any) {
      setResultModal({ type: 'error', message: err?.message ?? 'Đã có lỗi xảy ra. Vui lòng thử lại.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleCancel}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>XÁC NHẬN NHÂN VIÊN</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section: Thông tin của bạn */}
        <Text style={styles.sectionLabel}>THÔNG TIN CỦA BẠN</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Tên ứng viên</Text>
            <Text style={styles.rowValue}>{user?.name ?? '—'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Số điện thoại</Text>
            <Text style={styles.rowValue}>{user?.phone ?? '—'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Muốn làm tại cửa hàng</Text>
            <Text style={[styles.rowValue, styles.rowValueHighlight]}>{store_name}</Text>
          </View>
        </View>

        {/* Section: Thông tin cửa hàng */}
        <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>THÔNG TIN CỬA HÀNG</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Tên cửa hàng</Text>
            <Text style={[styles.rowValue, styles.rowValueHighlight]}>{store_name}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Tên chủ cửa hàng</Text>
            <Text style={styles.rowValue}>{owner_name ?? '—'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Số điện thoại</Text>
            <Text style={styles.rowValue}>{owner_phone ?? '—'}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom action buttons */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.md }]}>
        <TouchableOpacity
          style={[styles.btnConfirm, isSubmitting && styles.btnDisabled]}
          onPress={handleConfirm}
          activeOpacity={0.85}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <Ionicons name="checkmark" size={18} color={colors.white} />
              <Text style={styles.btnConfirmText}>Xác nhận</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnCancel}
          onPress={handleCancel}
          activeOpacity={0.85}
          disabled={isSubmitting}
        >
          <Ionicons name="close" size={18} color={colors.textPrimary} />
          <Text style={styles.btnCancelText}>Hủy bỏ</Text>
        </TouchableOpacity>
      </View>

      {/* Result modal */}
      <Modal transparent visible={resultModal !== null} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {resultModal?.type === 'success' ? (
              <>
                <View style={[styles.iconWrap, styles.iconSuccess]}>
                  <Ionicons name="checkmark" size={36} color={colors.success} />
                </View>
                <Text style={styles.modalTitle}>Gửi yêu cầu thành công!</Text>
                <Text style={styles.modalMsg}>
                  Yêu cầu xin việc tại{' '}
                  <Text style={{ fontWeight: '700' }}>{store_name}</Text>
                  {'\n'}đã được gửi. Vui lòng chờ chủ cửa hàng duyệt.
                </Text>
                <TouchableOpacity
                  style={styles.modalBtnPrimary}
                  onPress={() => {
                    setResultModal(null);
                    // Quay về JobApplications để thấy yêu cầu vừa gửi
                    navigation.navigate('JobApplications');
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.modalBtnText}>Xem danh sách xin việc</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={[styles.iconWrap, styles.iconError]}>
                  <Ionicons name="close" size={36} color={colors.error} />
                </View>
                <Text style={styles.modalTitle}>Thất bại</Text>
                <Text style={styles.modalMsg}>{resultModal?.message}</Text>
                <TouchableOpacity
                  style={styles.modalBtnSecondary}
                  onPress={() => setResultModal(null)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.modalBtnText, { color: colors.primary }]}>OK</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },
  header: {
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 32,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    ...typography.h3,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  headerSpacer: {
    width: 32,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  sectionLabelSpaced: {
    marginTop: spacing.lg,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  rowLabel: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
  },
  rowValue: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
    flex: 1,
  },
  rowValueHighlight: {
    color: colors.linkOrange,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: -spacing.md,
  },
  bottomBar: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  btnConfirm: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: spacing.md,
    minHeight: 50,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnConfirmText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
  btnCancel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: spacing.md,
    minHeight: 50,
    backgroundColor: colors.background,
  },
  btnCancelText: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 15,
  },
  // ── Modal ──────────────────────────────────────────────────
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  iconSuccess: { backgroundColor: '#E8F5EE' },
  iconError: { backgroundColor: '#FDECEC' },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  modalMsg: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  modalBtnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  modalBtnSecondary: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  modalBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
});
