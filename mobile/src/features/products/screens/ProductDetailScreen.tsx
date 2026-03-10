import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
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
import { CommonActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { MainStackScreenProps } from "../../../types/navigation";
import { colors, spacing, typography, radius, shadow } from "../../../ui/theme";
import { useProductsStore } from "../store/products.store";

const HERO_IMAGE_URI =
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

interface DeleteConfirmModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  visible,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={confirmStyles.overlay} onPress={onCancel}>
        <Pressable
          style={confirmStyles.dialog}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={confirmStyles.iconOuterCircle}>
            <View style={confirmStyles.iconInnerCircle}>
              <Ionicons name="information" size={24} color={colors.white} />
            </View>
          </View>

          <Text style={confirmStyles.title}>Xác nhận xóa sản phẩm!</Text>

          <Text style={confirmStyles.message}>
            Bạn có chắc muốn xóa sản phẩm này không?{"\n"}
            Hành động này không thể hoàn tác.
          </Text>

          <View style={confirmStyles.actionsRow}>
            <TouchableOpacity activeOpacity={0.8} onPress={onCancel}>
              <Text style={confirmStyles.cancelText}>CANCEL</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} onPress={onConfirm}>
              <Text style={confirmStyles.okText}>OK</Text>
            </TouchableOpacity>
          </View>
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

const confirmStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  dialog: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md + spacing.xs,
    alignItems: "center",
    ...shadow.md,
  },
  iconOuterCircle: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: "#FDE7CC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  iconInnerCircle: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    ...typography.body,
    fontSize: 17,
    fontWeight: "600",
    color: colors.secondary,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  message: {
    ...typography.bodySmall,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  actionsRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.xs,
  },
  cancelText: {
    ...typography.body,
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  okText: {
    ...typography.body,
    fontSize: 15,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 0.3,
  },
});

export const ProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const products = useProductsStore((state) => state.products);
  const setProductStatus = useProductsStore((state) => state.setProductStatus);
  const removeProducts = useProductsStore((state) => state.removeProducts);
  const [toastVisible, setToastVisible] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);

  const product = useMemo(
    () => products.find((item) => item.id === route.params.productId),
    [products, route.params.productId],
  );

  // Listen for navigation focus to show toast after editing
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (route.params?.edited) {
        setToastVisible(true);
        // Clear the flag
        navigation.setParams({ edited: undefined });
        // Auto hide after 3 seconds
        setTimeout(() => {
          setToastVisible(false);
        }, 3000);
      }
    });

    return unsubscribe;
  }, [navigation, route.params]);

  const displayProduct = {
    name: product?.name ?? "Bánh mì",
    price: product?.price ?? 4000,
    category: product?.category ?? "Bánh kẹo",
    stock: 0,
    status: product?.status ?? "active",
  };

  const isProductActive = displayProduct.status === "active";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: HERO_IMAGE_URI }}
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
            activeOpacity={0.75}
            onPress={() => setShowActionMenu(true)}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={18}
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

        {/* Success Toast */}
        <SuccessToast visible={toastVisible} message="Chỉnh sửa thành công!" />

        {/* Product Action Bottom Sheet */}
        <ProductActionBottomSheet
          visible={showActionMenu}
          isProductActive={isProductActive}
          onClose={() => setShowActionMenu(false)}
          onDeleteProduct={() => setIsDeleteConfirmVisible(true)}
          onToggleProductStatus={() =>
            setProductStatus(
              route.params.productId,
              isProductActive ? "inactive" : "active",
            )
          }
        />

        <DeleteConfirmModal
          visible={isDeleteConfirmVisible}
          onCancel={() => setIsDeleteConfirmVisible(false)}
          onConfirm={() => {
            removeProducts([route.params.productId]);
            setIsDeleteConfirmVisible(false);
            navigation.dispatch(
              CommonActions.navigate({
                name: "Products",
                params: { showDeleteSuccessToast: true },
                merge: true,
              }),
            );
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
    top: spacing.md - spacing.xs,
    right: spacing.md - spacing.xs,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    ...typography.screenTitle,
    color: colors.primary,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: spacing.md,
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
