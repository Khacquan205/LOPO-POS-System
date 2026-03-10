import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../../../ui/theme';
import { customersMock, createCustomer, type Customer } from '../mock/customers.mock';
import { CustomerListItem } from './CustomerListItem';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (customer: Customer) => void;
}

export const CustomerPickerBottomSheet: React.FC<Props> = ({ visible, onClose, onSelect }) => {
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [localCustomers, setLocalCustomers] = useState<Customer[]>([...customersMock]);

  // Reset when opened
  useEffect(() => {
    if (visible) {
      setSearch('');
      setShowAddForm(false);
      setNewName('');
      setNewPhone('');
      setSuccessMsg('');
      setLocalCustomers([...customersMock]);
    }
  }, [visible]);

  // Auto-dismiss success message
  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(''), 2500);
    return () => clearTimeout(t);
  }, [successMsg]);

  const filteredCustomers = useMemo(() => {
    if (!search.trim()) return localCustomers;
    const q = search.toLowerCase();
    return localCustomers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q),
    );
  }, [search, localCustomers]);

  const canSave = newName.trim().length > 0 && newPhone.trim().length > 0;

  const handleSave = useCallback(() => {
    if (!canSave) return;
    const newCustomer = createCustomer(newName.trim(), newPhone.trim());
    setLocalCustomers((prev) => [...prev, newCustomer]);
    setSuccessMsg('Thêm khách hàng thành công');
    setNewName('');
    setNewPhone('');
    setShowAddForm(false);
  }, [newName, newPhone, canSave]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Dim backdrop – tapping outside closes the sheet */}
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.sheetWrapper}
        >
          <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.sm }]}>

            {showAddForm ? (
              /* ─── ADD CUSTOMER FORM ──────────────────────────── */
              <>
                <View style={styles.header}>
                  <TouchableOpacity onPress={() => setShowAddForm(false)} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color={colors.primary} />
                  </TouchableOpacity>
                  <Text style={styles.title}>THÊM KHÁCH HÀNG</Text>
                  {/* Spacer to center title */}
                  <View style={styles.backBtn} />
                </View>

                <View style={styles.formBody}>
                  <Text style={styles.fieldLabel}>Tên khách hàng</Text>
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="Nhập tên khách hàng"
                    placeholderTextColor={colors.textSecondary}
                    value={newName}
                    onChangeText={setNewName}
                    autoFocus
                  />

                  <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>Số điện thoại</Text>
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="Nhập số điện thoại"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="phone-pad"
                    value={newPhone}
                    onChangeText={setNewPhone}
                  />

                  <TouchableOpacity
                    style={[styles.actionBtn, !canSave && styles.actionBtnDisabled]}
                    onPress={handleSave}
                    activeOpacity={0.8}
                    disabled={!canSave}
                  >
                    <Text style={styles.actionBtnText}>Lưu khách hàng</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              /* ─── CUSTOMER LIST ──────────────────────────────── */
              <>
                <View style={styles.header}>
                  <Text style={styles.title}>CHỌN KHÁCH HÀNG</Text>
                  <TouchableOpacity onPress={() => setShowAddForm(true)} activeOpacity={0.7}>
                    <Ionicons name="add-circle-outline" size={26} color={colors.primary} />
                  </TouchableOpacity>
                </View>

                {/* Success toast */}
                {successMsg ? (
                  <View style={styles.successBanner}>
                    <Ionicons name="checkmark-circle" size={16} color="#fff" />
                    <Text style={styles.successText}>{successMsg}</Text>
                  </View>
                ) : null}

                {/* Search bar */}
                <View style={styles.searchBox}>
                  <Ionicons name="search-outline" size={16} color={colors.textSecondary} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Nhập tên khách hàng hoặc số điện thoại"
                    placeholderTextColor={colors.textSecondary}
                    value={search}
                    onChangeText={setSearch}
                  />
                  {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch('')} activeOpacity={0.7}>
                      <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Customer list */}
                <FlatList
                  data={filteredCustomers}
                  keyExtractor={(c) => c.id}
                  renderItem={({ item }) => (
                    <CustomerListItem customer={item} onPress={() => onSelect(item)} />
                  )}
                  ItemSeparatorComponent={() => <View style={styles.divider} />}
                  style={styles.list}
                  keyboardShouldPersistTaps="handled"
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>Không tìm thấy khách hàng</Text>
                  }
                />

                {/* Close button */}
                <TouchableOpacity style={styles.actionBtn} onPress={onClose} activeOpacity={0.8}>
                  <Text style={styles.actionBtnText}>Đóng</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheetWrapper: {
    width: '100%',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    // visual drag handle
    borderTopWidth: 4,
    borderTopColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  backBtn: {
    width: 32,
    alignItems: 'flex-start',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#22C55E',
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  successText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceSecondary,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 10,
    paddingHorizontal: spacing.sm + 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: spacing.sm + 2,
  },
  list: {
    maxHeight: 320,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    paddingVertical: spacing.xl,
  },
  actionBtn: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: spacing.sm + 4,
    alignItems: 'center',
  },
  actionBtnDisabled: {
    backgroundColor: '#9CA3AF',
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  // ── Add form ──
  formBody: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs ?? 4,
  },
  fieldInput: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 15,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
