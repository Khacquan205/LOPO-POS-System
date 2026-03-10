import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../../ui/theme';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const CashConfirmModal: React.FC<Props> = ({ visible, onCancel, onConfirm }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
    <View style={styles.overlay}>
      <View style={styles.dialog}>
        {/* Orange icon circle */}
        <View style={styles.iconCircle}>
          <Ionicons name="cash-outline" size={30} color="#ffffff" />
        </View>

        <Text style={styles.title}>Xác nhận nhận tiền mặt!</Text>
        <Text style={styles.body}>
          Bạn có chắc chắn rằng đã nhận đủ tiền mặt của khách hàng không?
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={onCancel} activeOpacity={0.7}>
            <Text style={styles.cancelText}>CANCEL</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.okBtn]} onPress={onConfirm} activeOpacity={0.8}>
            <Text style={styles.okText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  dialog: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.xl + spacing.lg,
    alignItems: 'center',
    width: '100%',
  },
  iconCircle: {
    position: 'absolute',
    top: -(spacing.lg + spacing.sm),
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.linkOrange,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: colors.linkOrange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  btn: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelBtn: {
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  okBtn: {
    backgroundColor: colors.primary,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  okText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
