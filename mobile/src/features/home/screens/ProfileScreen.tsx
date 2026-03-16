import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { ScreenHeader } from "../../../ui/components";
import { colors, spacing, typography } from "../../../ui/theme";
import { useAuthStore } from "../../../store/auth.store";
import { useStoreStore } from "../store/store.store";
import type { StoreItem } from "../services/store.service";

export const ProfileScreen: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const {
    stores,
    isLoading,
    error,
    fetchMyStores,
    createStore,
    updateStoreName,
    deleteStore,
  } = useStoreStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showStoreInfoModal, setShowStoreInfoModal] = useState(false);
  const [showQrInStoreSheet, setShowQrInStoreSheet] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreItem | null>(null);
  const [storeName, setStoreName] = useState("");

  // ── Chọn thao tác sheet ──
  const [showActionSheet, setShowActionSheet] = useState(false);
  // ── Chỉnh sửa cửa hàng sheet ──
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [editName, setEditName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchMyStores();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const displayName = useMemo(
    () => user?.name?.toUpperCase() ?? "NGƯỜI DÙNG",
    [user?.name],
  );
  const displayPhone = useMemo(() => user?.phone ?? "", [user?.phone]);

  const handleCreateStore = async () => {
    const trimmed = storeName.trim();
    if (!trimmed) {
      Alert.alert("Lỗi", "Vui lòng nhập tên cửa hàng");
      return;
    }

    const ok = await createStore(trimmed);
    if (ok) {
      setStoreName("");
      setShowAddModal(false);
      Alert.alert("Thành công", "Thêm cửa hàng mới thành công");
    }
  };

  const handleSelectStore = (store: StoreItem) => {
    setSelectedStore(store);
    setShowQrInStoreSheet(false);
    setShowStoreInfoModal(true);
  };

  const handleShowQr = () => {
    if (!joinCode) {
      Alert.alert("Thông báo", "Cửa hàng chưa có mã nhận việc");
      return;
    }
    setShowQrInStoreSheet(true);
  };

  // ── Mở "Chọn thao tác" từ icon 3 chấm ──
  const handleOpenActionSheet = () => {
    setShowStoreInfoModal(false);
    setTimeout(() => setShowActionSheet(true), 250);
  };

  // ── Chỉnh sửa cửa hàng ──
  const handleOpenEdit = () => {
    setShowActionSheet(false);
    setEditName(selectedStore?.name ?? "");
    setTimeout(() => setShowEditSheet(true), 250);
  };

  const handleSaveEdit = async () => {
    if (!selectedStore) return;
    const trimmed = editName.trim();
    if (!trimmed) {
      Alert.alert("Lỗi", "Tên cửa hàng không được để trống");
      return;
    }
    setIsEditing(true);
    const ok = await updateStoreName(selectedStore.store_id, trimmed);
    setIsEditing(false);
    if (ok) {
      setShowEditSheet(false);
      // Cập nhật selectedStore local
      setSelectedStore((prev) => (prev ? { ...prev, name: trimmed } : prev));
      Alert.alert("Thành công", "Đã đổi tên cửa hàng");
    } else {
      Alert.alert("Lỗi", error || "Đổi tên cửa hàng thất bại");
    }
  };

  // ── Xóa cửa hàng ──
  const handleDeleteStore = () => {
    setShowActionSheet(false);
    setTimeout(() => {
      Alert.alert(
        "Xác nhận xóa",
        `Bạn có chắc chắn muốn xóa cửa hàng "${selectedStore?.name}"?\nHành động này không thể hoàn tác.`,
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Xóa",
            style: "destructive",
            onPress: async () => {
              if (!selectedStore) return;
              const ok = await deleteStore(selectedStore.store_id);
              if (ok) {
                setSelectedStore(null);
                Alert.alert("Thành công", "Đã xóa cửa hàng");
              } else {
                Alert.alert("Lỗi", error || "Xóa cửa hàng thất bại");
              }
            },
          },
        ],
      );
    }, 250);
  };

  const renderStore = ({ item }: { item: StoreItem }) => (
    <TouchableOpacity
      style={styles.storeRow}
      activeOpacity={0.75}
      onPress={() => handleSelectStore(item)}
    >
      <Text style={styles.storeName}>{item.name}</Text>
      <View style={styles.storeRowRight}>
        {item.is_active && (
          <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
        )}
        <Ionicons
          name="chevron-forward"
          size={16}
          color={colors.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );

  const joinCode =
    selectedStore?.store_qr_code?.trim() || selectedStore?.store_id || "";

  return (
    <View style={styles.container}>
      <ScreenHeader title="THÔNG TIN CỬA HÀNG" showBack />

      <View style={styles.card}>
        <View style={styles.cardRow}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.name}>{displayName}</Text>
          </View>
          {/* Icon 3 chấm xanh */}
          {selectedStore && (
            <TouchableOpacity
              style={styles.moreBtn}
              activeOpacity={0.7}
              onPress={handleOpenActionSheet}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="ellipsis-vertical"
                size={18}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.phonePill}>
          <Ionicons name="call" size={12} color={colors.textSecondary} />
          <Text style={styles.phone}>{displayPhone}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Danh sách cửa hàng</Text>
          <TouchableOpacity
            style={styles.addBtn}
            activeOpacity={0.8}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add" size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {isLoading && stores.length === 0 ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={stores}
            keyExtractor={(item) => item.store_id}
            renderItem={renderStore}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {error || "Chưa có cửa hàng nào"}
              </Text>
            }
          />
        )}
      </View>

      {/* ── Modal: Thêm cửa hàng ── */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => setShowAddModal(false)}
          />
          <View style={styles.bottomSheet}>
            <Text style={styles.sheetTitle}>Thêm cửa hàng</Text>
            <Text style={styles.fieldLabel}>Tên cửa hàng</Text>
            <TextInput
              style={styles.input}
              placeholder="Ví dụ: Hồng Phát"
              placeholderTextColor={colors.textSecondary}
              value={storeName}
              onChangeText={setStoreName}
            />
            <TouchableOpacity
              style={styles.submitBtn}
              activeOpacity={0.85}
              onPress={handleCreateStore}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.submitText}>Hoàn tất</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Modal: Thông tin cửa hàng ── */}
      <Modal
        visible={showStoreInfoModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStoreInfoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => setShowStoreInfoModal(false)}
          />
          <View style={styles.storeInfoSheet}>
            <View style={styles.infoTitleRow}>
              <Text style={styles.infoTitle}>THÔNG TIN CỬA HÀNG</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleOpenActionSheet}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="ellipsis-vertical"
                  size={18}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tên cửa hàng</Text>
              <Text style={styles.infoValue}>
                {selectedStore?.name || "-"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mã nhận việc</Text>
              <Text style={styles.infoValue}>{joinCode || "-"}</Text>
            </View>

            <View style={styles.joinCodeButton}>
              <TouchableOpacity
                style={styles.joinCodeIconButton}
                activeOpacity={0.8}
                onPress={handleShowQr}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="qr-code-outline"
                  size={16}
                  color={colors.linkOrange}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.joinCodeTextButton}
                activeOpacity={0.8}
                onPress={handleShowQr}
              >
                <Text style={styles.joinCodeText}>Mã nhận việc</Text>
              </TouchableOpacity>
            </View>

            {showQrInStoreSheet && !!joinCode && (
              <View style={styles.qrBox}>
                <QRCode value={joinCode} size={220} />
              </View>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              activeOpacity={0.85}
              onPress={() => setShowStoreInfoModal(false)}
            >
              <Text style={styles.closeButtonText}>ĐÓNG</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Modal: Chọn thao tác ── */}
      <Modal
        visible={showActionSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowActionSheet(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.backdrop}
            onPress={() => setShowActionSheet(false)}
          />
          <View style={styles.actionSheet}>
            <Text style={styles.actionSheetTitle}>CHỌN THAO TÁC</Text>

            <TouchableOpacity
              style={styles.actionOption}
              activeOpacity={0.7}
              onPress={handleOpenEdit}
            >
              <Text style={styles.actionOptionText}>Chỉnh sửa cửa hàng</Text>
            </TouchableOpacity>

            <View style={styles.actionSep} />

            <TouchableOpacity
              style={styles.actionOption}
              activeOpacity={0.7}
              onPress={handleDeleteStore}
            >
              <Text style={styles.actionOptionText}>Xóa cửa hàng</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCloseBtn}
              activeOpacity={0.85}
              onPress={() => setShowActionSheet(false)}
            >
              <Text style={styles.actionCloseBtnText}>ĐÓNG</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Modal: Chỉnh sửa cửa hàng ── */}
      <Modal
        visible={showEditSheet}
        transparent
        animationType="slide"
        onRequestClose={() => !isEditing && setShowEditSheet(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable
            style={styles.backdrop}
            onPress={() => !isEditing && setShowEditSheet(false)}
          />
          <View style={styles.bottomSheet}>
            <Text style={styles.sheetTitle}>CHỈNH SỬA CỬA HÀNG</Text>
            <Text style={styles.fieldLabel}>
              Tên cửa hàng <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tên cửa hàng"
              placeholderTextColor={colors.textSecondary}
              value={editName}
              onChangeText={setEditName}
              editable={!isEditing}
            />
            <TouchableOpacity
              style={[
                styles.submitBtn,
                (!editName.trim() || isEditing) && styles.submitBtnDisabled,
              ]}
              activeOpacity={0.85}
              onPress={handleSaveEdit}
              disabled={!editName.trim() || isEditing}
            >
              {isEditing ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.submitText}>Hoàn tất</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },
  card: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: spacing.md,
  },
  moreBtn: {
    padding: 4,
  },
  name: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: "700",
  },
  phonePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.surface,
  },
  phone: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 12,
  },
  section: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.body,
    color: colors.primary,
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  addBtn: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  storeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
  },
  storeRowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  storeName: {
    ...typography.body,
    color: colors.textPrimary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  centerBox: {
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    paddingVertical: spacing.md,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  bottomSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  sheetTitle: {
    ...typography.h3,
    color: colors.primary,
    textTransform: "uppercase",
    marginBottom: spacing.md,
  },
  fieldLabel: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    color: colors.textPrimary,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    minHeight: 48,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitText: {
    ...typography.body,
    color: "#ffffff",
    fontWeight: "700",
  },
  storeInfoSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  infoTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  infoTitle: {
    ...typography.h3,
    color: colors.primary,
    textTransform: "uppercase",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  infoLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  infoValue: {
    ...typography.body,
    color: colors.textSecondary,
  },
  joinCodeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  joinCodeIconButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  joinCodeText: {
    ...typography.body,
    color: colors.linkOrange,
    textAlign: "center",
    fontWeight: "600",
  },
  joinCodeTextButton: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  qrBox: {
    alignSelf: "center",
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  closeButton: {
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    minHeight: 48,
  },
  closeButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: "700",
  },

  // ── Chọn thao tác sheet ──
  actionSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  actionSheetTitle: {
    ...typography.h3,
    color: colors.primary,
    textTransform: "uppercase",
    marginBottom: spacing.md,
  },
  actionOption: {
    paddingVertical: spacing.md,
  },
  actionOptionText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  actionSep: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  actionCloseBtn: {
    marginTop: spacing.md,
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    minHeight: 48,
  },
  actionCloseBtnText: {
    ...typography.body,
    color: colors.white,
    fontWeight: "700",
  },
});
