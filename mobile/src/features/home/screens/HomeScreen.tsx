import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Screen, IconSquare, GridButton, Badge } from "../../../ui/components";
import { colors, spacing, typography } from "../../../ui/theme";
import { useAuthStore } from "../../../store/auth.store";
import { useStoreStore } from "../store/store.store";
import type { MainStackParamList } from "../../../types/navigation";

type FeatureKey =
  | "sales"
  | "orders"
  | "products"
  | "customers"
  | "staff"
  | "settings"
  | "support"
  | "notifications";

interface GridItem {
  key: FeatureKey;
  title: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  badge?: string;
}

const GRID_ITEMS: GridItem[] = [
  { key: "sales", title: "Bán hàng", icon: "cart" },
  { key: "orders", title: "Đơn hàng", icon: "receipt" },
  { key: "products", title: "Sản phẩm", icon: "cube" },
  { key: "customers", title: "Khách hàng", icon: "people" },
  { key: "staff", title: "Nhân viên", icon: "person" },
  { key: "settings", title: "Cài đặt", icon: "settings" },
  { key: "support", title: "Hỗ trợ", icon: "headset" },
  {
    key: "notifications",
    title: "Thông báo",
    icon: "notifications",
    badge: "1",
  },
];

const ROUTE_MAP: Record<FeatureKey, keyof MainStackParamList> = {
  sales: "Sales",
  orders: "Orders",
  products: "Products",
  customers: "Customers",
  staff: "Staff",
  settings: "Settings",
  support: "Support",
  notifications: "Notifications",
};

export const HomeScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const activeStore = useStoreStore((s) => s.stores.find((st) => st.is_active));
  const fetchMyStores = useStoreStore((s) => s.fetchMyStores);

  useEffect(() => {
    fetchMyStores();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const displayName = user?.name?.toUpperCase() || "NGƯỜI DÙNG";

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
          {GRID_ITEMS.map((item) => (
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
    </Screen>
  );
};

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
});
