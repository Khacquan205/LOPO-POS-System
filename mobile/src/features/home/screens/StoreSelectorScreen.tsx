import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Screen, ScreenHeader } from "../../../ui/components";
import { colors, spacing, typography } from "../../../ui/theme";
import { useStoreStore } from "../store/store.store";
import type { StoreItem } from "../services/store.service";

export const StoreSelectorScreen: React.FC = () => {
  const navigation = useNavigation();
  const { stores, isLoading, error, fetchMyStores, selectStore } =
    useStoreStore();

  useEffect(() => {
    fetchMyStores();
  }, []);

  const handleSelect = async (store: StoreItem) => {
    await selectStore(store.store_id);
    navigation.goBack();
  };

  const renderItem = ({ item }: { item: StoreItem }) => (
    <TouchableOpacity
      style={[styles.storeItem, item.is_active && styles.storeItemActive]}
      onPress={() => handleSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.storeIcon}>
        <Ionicons
          name="storefront-outline"
          size={28}
          color={item.is_active ? colors.primary : colors.textSecondary}
        />
      </View>
      <View style={styles.storeInfo}>
        <Text
          style={[styles.storeName, item.is_active && styles.storeNameActive]}
        >
          {item.name}
        </Text>
        <Text style={styles.storeRole}>
          {item.role === "owner" ? "Chủ cửa hàng" : "Nhân viên"}
        </Text>
      </View>
      {item.is_active && (
        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <Screen>
      <ScreenHeader title="Chọn cửa hàng" />
      <View style={styles.content}>
        {isLoading && stores.length === 0 ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Ionicons
              name="alert-circle-outline"
              size={48}
              color={colors.error}
            />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchMyStores}>
              <Text style={styles.retryText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : stores.length === 0 ? (
          <View style={styles.center}>
            <Ionicons
              name="storefront-outline"
              size={48}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>Bạn chưa thuộc cửa hàng nào</Text>
          </View>
        ) : (
          <FlatList
            data={stores}
            keyExtractor={(item) => item.store_id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            style={styles.flex}
          />
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  list: {
    paddingVertical: spacing.sm,
  },
  storeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  storeItemActive: {
    borderColor: colors.primary,
    backgroundColor: "#EBF2FE",
  },
  storeIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    ...typography.body,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  storeNameActive: {
    color: colors.primary,
  },
  storeRole: {
    ...typography.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  retryBtn: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  retryText: {
    ...typography.body,
    color: colors.white,
    fontWeight: "600",
  },
});
