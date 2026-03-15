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
  const { stores, isLoading, error, fetchMyStores, createStore } =
    useStoreStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showStoreInfoModal, setShowStoreInfoModal] = useState(false);
  const [showQrInStoreSheet, setShowQrInStoreSheet] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreItem | null>(null);
  const [storeName, setStoreName] = useState("");

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
      <ScreenHeader title="Profile" showBack />

      <View style={styles.card}>
        <Text style={styles.name}>{displayName}</Text>
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

      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
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
        </View>
      </Modal>

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
            <Text style={styles.infoTitle}>THÔNG TIN CỬA HÀNG</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tên cửa hàng</Text>
              <Text style={styles.infoValue}>{selectedStore?.name || "-"}</Text>
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
  infoTitle: {
    ...typography.h3,
    color: colors.primary,
    textTransform: "uppercase",
    marginBottom: spacing.md,
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
});
