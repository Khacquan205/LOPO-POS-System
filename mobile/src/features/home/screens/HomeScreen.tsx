import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
} from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Screen, IconSquare, GridButton, Badge } from "../../../ui/components";
import { colors, spacing, typography } from "../../../ui/theme";
import { useAuthStore } from "../../../store/auth.store";
import { useStoreStore } from "../store/store.store";
import type { MainStackParamList } from "../../../types/navigation";

// ── Types ──────────────────────────────────────────────────────

type FeatureKey =
  | "sales"
  | "orders"
  | "products"
  | "customers"
  | "staff"
  | "jobApplications"
  | "settings"
  | "support"
  | "notifications";

interface GridItem {
  key: FeatureKey;
  title: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  badge?: string;
}

// ── Constants ──────────────────────────────────────────────────

const GRID_ITEMS: GridItem[] = [
  { key: "sales", title: "Bán hàng", icon: "cart" },
  { key: "orders", title: "Đơn hàng", icon: "receipt" },
  { key: "products", title: "Sản phẩm", icon: "cube" },
  { key: "customers", title: "Khách hàng", icon: "people" },
  { key: "staff", title: "Nhân viên", icon: "person" },
  { key: "settings", title: "Cài đặt", icon: "settings" },
  { key: "support", title: "Hỗ trợ", icon: "headset" },
  { key: "notifications", title: "Thông báo", icon: "notifications", badge: "1" },
];

const ROUTE_MAP: Record<FeatureKey, keyof MainStackParamList> = {
  sales: "Sales",
  orders: "Orders",
  products: "Products",
  customers: "Customers",
  staff: "Staff",
  jobApplications: "JobApplications",
  settings: "Settings",
  support: "Support",
  notifications: "Notifications",
};

// ── Component ──────────────────────────────────────────────────

export const HomeScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const activeStore = useStoreStore((s) => s.stores.find((st) => st.is_active));
  const fetchMyStores = useStoreStore((s) => s.fetchMyStores);

  const [showNoStoreModal, setShowNoStoreModal] = useState(false);

  useEffect(() => {
    fetchMyStores();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const displayName = user?.name?.toUpperCase() || "NGƯỜI DÙNG";
  const isStaff = user?.role === "staff";
  // Staff chưa được approve vào cửa hàng nào (storeId === null)
  const staffHasNoStore = isStaff && !user?.storeId;

  const gridItems = GRID_ITEMS.map((item) =>
    item.key === "staff" && isStaff
      ? { ...item, key: "jobApplications" as FeatureKey, title: "Việc làm" }
      : item,
  );

  const handleLogout = (): void => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          await logout();
          navigation
            .getParent()
            ?.dispatch(
              CommonActions.reset({ index: 0, routes: [{ name: "Auth" }] }),
            );
        },
      },
    ]);
  };

  const handleGridPress = (key: FeatureKey): void => {
    // Nếu staff chưa có cửa hàng và không phải Việc làm → show modal cảnh báo
    if (staffHasNoStore && key !== "jobApplications") {
      setShowNoStoreModal(true);
      return;
    }
    const routeName = ROUTE_MAP[key];
    if (routeName) {
      navigation.navigate(routeName as never);
    }
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => navigation.navigate("Profile")}
            style={styles.storeIconButton}
          >
            <IconSquare icon="storefront" size={48} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Xin chào!</Text>
            <Text style={styles.userName}>{displayName}</Text>
          </View>
        </View>

        {/* Store selector link */}
        <TouchableOpacity
          onPress={() => navigation.navigate("StoreSelector")}
          activeOpacity={0.7}
          style={styles.storeSelectorWrapper}
        >
          <Text style={styles.storeLink}>
            {activeStore ? activeStore.name : "Chọn cửa hàng"}
            {"  ▸"}
          </Text>
        </TouchableOpacity>

        {/* Grid 2x4 */}
        <View style={styles.gridContainer}>
          {gridItems.map((item) => (
            <View key={item.key} style={styles.gridItemWrapper}>
              <GridButton
                title={item.title}
                iconName={item.icon}
                onPress={() => handleGridPress(item.key)}
                variant="card"
                style={styles.gridItem}
              />
              {item.badge && (
                <Badge
                  count={item.badge}
                  variant="error"
                  size="small"
                  style={styles.badge}
                />
              )}
            </View>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutRow}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out" size={20} color={colors.linkOrange} />
          <Text style={styles.logoutLink}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Modal: Chưa có cửa hàng ──────────────────────── */}
      <Modal
        visible={showNoStoreModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNoStoreModal(false)}
      >
        <View style={styles.modalBackdrop}>
          {/* Backdrop tap to close */}
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setShowNoStoreModal(false)}
          />

          <View style={styles.modalCard}>
            {/* Icon cam với hào quang */}
            <View style={styles.iconGlow}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>i</Text>
              </View>
            </View>

            <Text style={styles.modalTitle}>Chưa có cửa hàng</Text>

            <Text style={styles.modalDesc}>
              Bạn cần tham gia cửa hàng để có chức năng này
            </Text>

            {/* Nút chính */}
            <TouchableOpacity
              style={styles.btnJoin}
              activeOpacity={0.85}
              onPress={() => {
                setShowNoStoreModal(false);
                navigation.navigate("JobApplications");
              }}
            >
              <Text style={styles.btnJoinText}>Tham gia cửa hàng</Text>
            </TouchableOpacity>

            {/* Nút phụ */}
            <TouchableOpacity
              style={styles.btnDismiss}
              activeOpacity={0.85}
              onPress={() => setShowNoStoreModal(false)}
            >
              <Text style={styles.btnDismissText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Screen>
  );
};

// ── Styles ─────────────────────────────────────────────────────

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  headerText: {
    marginLeft: spacing.md,
  },
  storeIconButton: {
    borderRadius: 12,
  },
  greeting: {
    ...typography.body,
    color: colors.textSecondary,
  },
  userName: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: "700",
  },
  storeSelectorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  storeLink: {
    ...typography.body,
    color: colors.linkOrange,
    textAlign: "center",
  },
  storeSelectorWrapper: {
    alignItems: "center",
    marginLeft: spacing.xs,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: spacing.md,
  },
  gridItemWrapper: {
    width: "48%",
    position: "relative",
  },
  gridItem: {
    width: "100%",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  logoutLink: {
    ...typography.body,
    color: colors.linkOrange,
    marginLeft: spacing.xs,
  },

  // ── Modal ──────────────────────────────────────────────
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
    // Đảm bảo card nổi trên backdrop tap
    zIndex: 1,
  },
  // Hào quang màu cam nhạt bên ngoài
  iconGlow: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(239,164,66,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  // Vòng tròn màu cam đậm
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.linkOrange,
    alignItems: "center",
    justifyContent: "center",
  },
  // Chữ "i" in nghiêng màu trắng
  iconText: {
    fontSize: 30,
    fontWeight: "900",
    fontStyle: "italic",
    color: colors.white,
    lineHeight: 36,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.linkOrange,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  modalDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  btnJoin: {
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  btnJoinText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 15,
  },
  btnDismiss: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  btnDismissText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 15,
  },
});
