import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, type BarcodeScanningResult, useCameraPermissions } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../../../ui/theme';
import { CommonAlertModal } from '../../../common/shared/components/CommonAlertModal';
import { useCommonAlert } from '../../../common/shared/hooks/useCommonAlert';
import { useProductsStore } from '../../products/store/products.store';
import { useCategoriesStore } from '../../products/store/categories.store';
import { useAuthStore } from '../../../store/auth.store';
import { usePosStore } from '../store/pos.store';
import type { MainStackScreenProps } from '../../../types/navigation';

const normalizeBarcode = (value: string) => value.trim();

type Props = MainStackScreenProps<'ScanProduct'>;

export const ScanProductScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const { returnScreen, orderId } = route.params;

  const accessToken = useAuthStore((s) => s.accessToken);
  const products = useProductsStore((s) => s.products);
  const fetchProducts = useProductsStore((s) => s.fetchProducts);
  const fetchCategories = useCategoriesStore((s) => s.fetchCategories);
  const addPickedItems = usePosStore((s) => s.addPickedItems);
  const clearPosError = usePosStore((s) => s.clearError);

  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isHandlingScan, setIsHandlingScan] = useState(false);
  const scanLockRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { alertProps, showAlert, hideAlert } = useCommonAlert();

  const hasPermission = permission?.granted ?? false;

  const ensureProductsLoaded = useCallback(async () => {
    if (!accessToken || products.length > 0 || isLoadingProducts) return;
    setIsLoadingProducts(true);
    try {
      await fetchCategories(accessToken);
      const cats = useCategoriesStore.getState().categories;
      await fetchProducts(accessToken, cats);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [accessToken, products.length, isLoadingProducts, fetchCategories, fetchProducts]);

  useEffect(() => {
    if (accessToken && products.length === 0) {
      ensureProductsLoaded();
    }
  }, [accessToken, products.length, ensureProductsLoaded]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const resetScanState = useCallback(() => {
    scanLockRef.current = false;
    setIsHandlingScan(false);
    hideAlert();
  }, [hideAlert]);

  const navigateToOrderScreen = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    if (returnScreen === 'DraftOrderDetail' && orderId) {
      navigation.navigate('DraftOrderDetail', { orderId });
      return;
    }
    navigation.navigate('Sales');
  }, [navigation, orderId, returnScreen]);

  const openResultModal = useCallback(
    (type: 'success' | 'error', title: string, message: string, withAction: boolean) => {
      showAlert({
        variant: type === 'success' ? 'success' : 'danger',
        title,
        message,
        confirmText: 'OK',
        showCancel: false,
        loading: !withAction && type === 'success',
        onConfirm: withAction ? resetScanState : undefined,
      });
    },
    [resetScanState, showAlert],
  );

  const handleNotFound = useCallback(() => {
    openResultModal(
      'error',
      'Không tìm thấy sản phẩm',
      'Mã vạch không tồn tại trong hệ thống. Vui lòng thử lại.',
      true,
    );
  }, [openResultModal]);

  const handleBarcodeScanned = useCallback(async (result: BarcodeScanningResult) => {
    if (scanLockRef.current || isHandlingScan) return;
    scanLockRef.current = true;
    setIsHandlingScan(true);

    const code = normalizeBarcode(result.data ?? '');
    if (!code) {
      setIsHandlingScan(false);
      return;
    }

    if (!accessToken) {
      scanLockRef.current = false;
      setIsHandlingScan(false);
      showAlert({
        variant: 'warning',
        title: 'Không thể quét',
        message: 'Vui lòng đăng nhập lại để tiếp tục.',
        confirmText: 'OK',
        onConfirm: () => navigation.replace('Sales'),
      });
      return;
    }

    if (products.length === 0) {
      await ensureProductsLoaded();
    }

    const latestProducts = useProductsStore.getState().products;
    const matched = latestProducts.find((p) => p.barcode && normalizeBarcode(p.barcode) === code);

    if (!matched) {
      handleNotFound();
      return;
    }

    if (!matched.trackInventory || matched.onHand <= 0) {
      openResultModal(
        'error',
        'Hết hàng',
        'Sản phẩm tạm hết hàng',
        true,
      );
      return;
    }

    openResultModal(
      'success',
      'Quét thành công',
      'Sản phẩm đã được nhận diện. Đang thêm vào đơn hàng...',
      false,
    );

    timerRef.current = setTimeout(async () => {
      await addPickedItems(accessToken, [
        {
          productId: matched.id,
          productName: matched.name,
          unitPrice: matched.price,
          quantity: 1,
          trackInventory: matched.trackInventory,
          onHand: matched.onHand,
        },
      ]);

      const error = usePosStore.getState().error;
      if (error) {
        clearPosError();
        openResultModal(
          'error',
          'Không thể thêm sản phẩm',
          error,
          true,
        );
        return;
      }

      hideAlert();
      navigateToOrderScreen();
    }, 1000);
  }, [
    isHandlingScan,
    scanLockRef,
    accessToken,
    products.length,
    ensureProductsLoaded,
    handleNotFound,
    addPickedItems,
    clearPosError,
    openResultModal,
    navigateToOrderScreen,
    showAlert,
    hideAlert,
  ]);

  const cameraOverlay = useMemo(() => (
    <View style={styles.overlay} pointerEvents="none">
      <View style={styles.scanFrame} />
      <Text style={styles.scanHint}>Đưa mã vạch vào khung để quét</Text>
    </View>
  ), []);

  if (!permission) {
    return (
      <View style={styles.permissionWrap}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.permissionWrap}>
        <Text style={styles.permissionTitle}>Cần quyền camera</Text>
        <Text style={styles.permissionText}>
          Vui lòng cho phép ứng dụng truy cập camera để quét mã sản phẩm.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={() => requestPermission()}
          activeOpacity={0.8}
        >
          <Text style={styles.permissionButtonText}>Cho phép camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={isHandlingScan ? undefined : handleBarcodeScanned}
      />

      {cameraOverlay}

      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.replace('Sales'))}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={22} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Quét sản phẩm</Text>
        <View style={styles.topSpacer} />
      </View>

      {isLoadingProducts && (
        <View style={styles.loadingBadge}>
          <ActivityIndicator size="small" color={colors.white} />
          <Text style={styles.loadingText}>Dang tai san pham...</Text>
        </View>
      )}

      <CommonAlertModal {...alertProps} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: '75%',
    height: 180,
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  scanHint: {
    marginTop: spacing.lg,
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  topSpacer: {
    width: 40,
  },
  loadingBadge: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  permissionWrap: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  permissionText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
  },
  permissionButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
