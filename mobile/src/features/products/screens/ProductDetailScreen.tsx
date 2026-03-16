import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  Animated,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CommonActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { MainStackScreenProps } from "../../../types/navigation";
import { DeleteConfirmModal } from "../../../ui/components";
import { colors, spacing, typography, radius, shadow } from "../../../ui/theme";
import { ApiError } from "../../../lib/api/client";
import { useProductsStore } from "../store/products.store";
import { useAuthStore } from "../../../store/auth.store";
import { useCategoriesStore } from "../store/categories.store";
import { useInventoryStore } from "../store/inventory.store";

const FALLBACK_HERO_IMAGE_URI =
  "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=1200&q=80";

type Props = MainStackScreenProps<"ProductDetail">;

interface DetailRowProps {
  label: string;
  value: string;
  valueStyle?: object;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, valueStyle }) => {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, valueStyle]}>{value}</Text>
    </View>
  );
};

// ============================================================================
// SUCCESS TOAST COMPONENT
// ============================================================================

interface SuccessToastProps {
  visible: boolean;
  message: string;
}

const SuccessToast: React.FC<SuccessToastProps> = ({ visible, message }) => {
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 100,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, translateY, opacity]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={styles.toastIconContainer}>
        <Ionicons name="checkmark" size={18} color={colors.white} />
      </View>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

// ============================================================================
// PRODUCT ACTION BOTTOM SHEET
// ============================================================================

interface ProductActionBottomSheetProps {
  visible: boolean;
  isProductActive: boolean;
  onClose: () => void;
  onDeleteProduct: () => void;
  onToggleProductStatus: () => void;
}

const ProductActionBottomSheet: React.FC<ProductActionBottomSheetProps> = ({
  visible,
  isProductActive,
  onClose,
  onDeleteProduct,
  onToggleProductStatus,
}) => {
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={sheetStyles.overlay} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Animated.View
            style={[
              sheetStyles.bottomSheet,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={sheetStyles.title}>CHỌN CHỨC NĂNG</Text>

            <View style={sheetStyles.actionsContainer}>
              <TouchableOpacity
                style={sheetStyles.actionRow}
                activeOpacity={0.7}
                onPress={() => {
                  onDeleteProduct();
                  onClose();
                }}
              >
                <Text style={sheetStyles.actionText}>Xóa sản phẩm</Text>
              </TouchableOpacity>

              <View style={sheetStyles.divider} />

              <TouchableOpacity
                style={sheetStyles.actionRow}
                activeOpacity={0.7}
                onPress={() => {
                  onToggleProductStatus();
                  onClose();
                }}
              >
                <Text style={sheetStyles.actionText}>
                  {isProductActive ? "Ngừng hoạt động" : "Hoạt động"}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={sheetStyles.closeButton}
              activeOpacity={0.85}
              onPress={onClose}
            >
              <Text style={sheetStyles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const sheetStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md + spacing.xs,
    paddingBottom: spacing.md + spacing.xs,
  },
  title: {
    ...typography.body,
    fontSize: 17,
    fontWeight: "600",
    color: colors.primary,
    textTransform: "uppercase",
    marginBottom: spacing.md,
  },
  actionsContainer: {
    marginBottom: spacing.md,
  },
  actionRow: {
    paddingVertical: spacing.md - spacing.xs,
  },
  actionText: {
    ...typography.body,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: "400",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  closeButton: {
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    ...typography.body,
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
});

export const ProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const products = useProductsStore((state) => state.products);
  const fetchProductById = useProductsStore((state) => state.fetchProductById);
  const setProductStatus = useProductsStore((state) => state.setProductStatus);
  const deleteProduct = useProductsStore((state) => state.deleteProduct);
  const accessToken = useAuthStore((state) => state.accessToken);
  const categories = useCategoriesStore((state) => state.categories);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);
  const stockByProductId = useInventoryStore((state) => state.stockByProductId);
  const fetchStockByProduct = useInventoryStore(
    (state) => state.fetchStockByProduct,
  );
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [serverProduct, setServerProduct] = useState<
    (typeof products)[number] | null
  >(null);

  const navigateToProducts = useCallback(
    (showDeleteSuccessToast?: boolean) => {
      navigation.dispatch(
        CommonActions.navigate({
          name: "Products",
          params: { showDeleteSuccessToast },
          merge: true,
        }),
      );
    },
    [navigation],
  );

  const categoryLookup = useMemo(
    () =>
      categories.map((item) => ({
        id: item.id,
        name: item.name,
        color: item.color,
      })),
    [categories],
  );

  const product = useMemo(
    () => products.find((item) => item.id === route.params.productId),
    [products, route.params.productId],
  );

  const reloadProductDetail = useCallback(async () => {
    if (!accessToken) return;

    // Ensure categories are loaded so category name can be resolved in detail.
    try {
      await fetchCategories(accessToken);
    } catch {
      // If category fetch fails, detail can still render with fallback values.
    }

    const latestCategoryLookup = useCategoriesStore
      .getState()
      .categories.map((item) => ({
        id: item.id,
        name: item.name,
        color: item.color,
      }));

    try {
      const latest = await fetchProductById(
        accessToken,
        route.params.productId,
        latestCategoryLookup,
      );
      if (latest) {
        setServerProduct(latest);
      }
    } catch (error) {
      // Network/offline or 404 are expected in some navigation states; avoid log spam.
      if (
        !(error instanceof ApiError) ||
        (error.statusCode !== 0 && error.statusCode !== 404)
      ) {
        console.warn("Load product detail failed:", error);
      }
    }

    try {
      await fetchStockByProduct(accessToken, route.params.productId);
    } catch {
      // Inventory load failures should not break detail rendering.
    }
  }, [
    accessToken,
    fetchCategories,
    fetchProductById,
    fetchStockByProduct,
    route.params.productId,
  ]);

  useEffect(() => {
    void (async () => {
      await reloadProductDetail();
    })();
  }, [reloadProductDetail]);

  const displaySource = serverProduct ?? product;
  const heroImageUri = displaySource?.image ?? FALLBACK_HERO_IMAGE_URI;

  const displayProduct = {
    name: displaySource?.name ?? "Bánh mì",
    price: displaySource?.price ?? 4000,
    category: displaySource?.category ?? "Bánh kẹo",
    stock:
      displaySource?.onHand ?? stockByProductId[route.params.productId] ?? 0,
    status: displaySource?.status ?? "active",
  };

  const isProductActive = displayProduct.status === "active";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: heroImageUri }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Ionicons name="chevron-back" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <TouchableOpacity
            style={styles.menuButton}
            activeOpacity={0.7}
            hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
            onPress={() => setShowActionMenu(true)}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={22}
              color={colors.primary}
            />
          </TouchableOpacity>

          <Text style={styles.title}>{displayProduct.name}</Text>

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate("EditProduct", {
                  productId: route.params.productId,
                })
              }
            >
              <Ionicons name="create-outline" size={14} color={colors.white} />
              <Text style={styles.actionButtonText}>Chỉnh sửa</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailsContainer}>
            <DetailRow
              label="Giá bán"
              value={new Intl.NumberFormat("vi-VN").format(
                displayProduct.price,
              )}
              valueStyle={styles.priceValue}
            />
            <DetailRow label="Loại sản phẩm" value={displayProduct.category} />
            <DetailRow label="Tồn kho" value={`${displayProduct.stock}`} />
            <DetailRow
              label="Trạng thái"
              value={isProductActive ? "Đang hoạt động" : "Ngừng hoạt động"}
              valueStyle={[
                styles.statusValue,
                !isProductActive && styles.inactiveStatusValue,
              ]}
            />
          </View>
        </View>

        {/* Product Action Bottom Sheet */}
        <ProductActionBottomSheet
          visible={showActionMenu}
          isProductActive={isProductActive}
          onClose={() => setShowActionMenu(false)}
          onDeleteProduct={() => setIsDeleteConfirmVisible(true)}
          onToggleProductStatus={async () => {
            if (!accessToken) return;
            try {
              await setProductStatus(
                accessToken,
                route.params.productId,
                isProductActive ? "inactive" : "active",
                categoryLookup,
              );
              await reloadProductDetail();
            } catch (error) {
              console.warn("Update product status failed:", error);
            }
          }}
        />

        <DeleteConfirmModal
          visible={isDeleteConfirmVisible}
          title="Xác nhận xóa sản phẩm!"
          message="Bạn có chắc muốn xóa sản phẩm này không?\nHành động này không thể hoàn tác"
          onCancel={() => setIsDeleteConfirmVisible(false)}
          onConfirm={async () => {
            if (!accessToken) return;
            setIsDeleteConfirmVisible(false);
            try {
              await deleteProduct(
                accessToken,
                route.params.productId,
                categoryLookup,
              );
              navigateToProducts(true);
            } catch (error) {
              Alert.alert(
                "Xóa thất bại",
                error instanceof Error
                  ? error.message
                  : "Không thể xóa sản phẩm. Vui lòng thử lại.",
                [
                  {
                    text: "OK",
                    onPress: () => navigateToProducts(false),
                  },
                ],
              );
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  heroContainer: {
    height: 220,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top:
      Platform.OS === "android"
        ? (StatusBar.currentHeight ?? 0) + spacing.sm
        : spacing.md,
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    ...shadow.sm,
  },
  infoCard: {
    marginHorizontal: spacing.md,
    marginTop: -22,
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    paddingHorizontal: spacing.md + spacing.xs,
    paddingTop: spacing.md + spacing.xs,
    paddingBottom: spacing.lg,
    ...shadow.sm,
  },
  menuButton: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    elevation: 10,
  },
  title: {
    ...typography.screenTitle,
    color: colors.primary,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xxl,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm + spacing.xs,
    marginBottom: spacing.lg,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  actionButtonText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: "600",
  },
  detailsContainer: {
    gap: spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  detailValue: {
    ...typography.body,
    color: colors.textPrimary,
    textAlign: "right",
    fontWeight: "500",
  },
  priceValue: {
    color: colors.linkOrange,
  },
  statusValue: {
    color: colors.success,
  },
  inactiveStatusValue: {
    color: colors.error,
  },
  // Toast styles
  toastContainer: {
    position: "absolute",
    bottom: spacing.lg + spacing.md,
    left: spacing.md + spacing.xs,
    right: spacing.md + spacing.xs,
    backgroundColor: "#D1FAE5",
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm + spacing.xs,
    ...shadow.md,
  },
  toastIconContainer: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },
  toastText: {
    ...typography.bodySmall,
    fontSize: 14,
    color: "#065F46",
    fontWeight: "500",
    flex: 1,
  },
});
