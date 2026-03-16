import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { CameraView, type BarcodeScanningResult, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../store/auth.store';
import { colors, spacing } from '../../../ui/theme';
import { getStorePreviewByQr } from '../services/scanQrJob.service';
import type { MainStackScreenProps } from '../../../types/navigation';

type Props = MainStackScreenProps<'ScanQrJob'>;

export const ScanQrJobScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const accessToken = useAuthStore((s) => s.accessToken);

  const [isHandling, setIsHandling] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scanLockRef = useRef(false);

  const resetScan = useCallback(() => {
    scanLockRef.current = false;
    setIsHandling(false);
    setErrorMsg(null);
  }, []);

  const handleBarcodeScanned = useCallback(
    async (scanResult: BarcodeScanningResult) => {
      if (scanLockRef.current || isHandling) return;
      scanLockRef.current = true;
      setIsHandling(true);
      setErrorMsg(null);

      const code = (scanResult.data ?? '').trim();
      if (!code || !accessToken) {
        resetScan();
        return;
      }

      try {
        // Gọi API preview — lấy thông tin cửa hàng mà KHÔNG gửi request
        const preview = await getStorePreviewByQr(accessToken, code);

        // Navigate sang màn hình xác nhận với đầy đủ thông tin
        navigation.navigate('QrJobConfirm', {
          qr_code: code,
          store_id: preview.store_id,
          store_name: preview.store_name,
          owner_name: preview.owner_name,
          owner_phone: preview.owner_phone,
        });

        // Reset để có thể quét lại khi back về
        scanLockRef.current = false;
        setIsHandling(false);
      } catch (err: any) {
        setErrorMsg(err?.message ?? 'Không thể đọc QR. Vui lòng thử lại.');
        setIsHandling(false);
        // Cho phép quét lại sau 2 giây
        setTimeout(() => {
          scanLockRef.current = false;
          setErrorMsg(null);
        }, 2000);
      }
    },
    [isHandling, accessToken, resetScan, navigation],
  );

  // ── Permission loading ───────────────────────────────────────
  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Ionicons name="camera-outline" size={56} color={colors.textSecondary} />
        <Text style={styles.permTitle}>Cần quyền camera</Text>
        <Text style={styles.permText}>
          Cho phép ứng dụng truy cập camera để quét QR cửa hàng.
        </Text>
        <TouchableOpacity style={styles.permBtn} onPress={() => requestPermission()}>
          <Text style={styles.permBtnText}>Cho phép camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera */}
      <CameraView
        style={StyleSheet.absoluteFill}
        onBarcodeScanned={isHandling ? undefined : handleBarcodeScanned}
      />

      {/* Scan frame overlay */}
      <View style={styles.overlay} pointerEvents="none">
        <Text style={styles.hintTop}>Quét mã QR của cửa hàng</Text>
        <View style={styles.frame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
        <Text style={styles.hintBottom}>Đưa mã QR vào khung để xem thông tin cửa hàng</Text>
      </View>

      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : undefined)}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={22} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Quét QR Xin Việc</Text>
        <View style={styles.topSpacer} />
      </View>

      {/* Loading badge */}
      {isHandling && (
        <View style={styles.loadingBadge}>
          <ActivityIndicator size="small" color={colors.white} />
          <Text style={styles.loadingText}>Đang tải thông tin cửa hàng...</Text>
        </View>
      )}

      {/* Error banner (tự ẩn sau 2s) */}
      {errorMsg !== null && (
        <View style={styles.errorBanner}>
          <Ionicons name="warning-outline" size={18} color={colors.white} />
          <Text style={styles.errorBannerText}>{errorMsg}</Text>
        </View>
      )}
    </View>
  );
};

// ── Styles ───────────────────────────────────────────────────
const CORNER = 24;
const CORNER_THICK = 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintTop: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: spacing.lg,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  frame: {
    width: 240,
    height: 240,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: colors.white,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_THICK,
    borderLeftWidth: CORNER_THICK,
    borderTopLeftRadius: 6,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_THICK,
    borderRightWidth: CORNER_THICK,
    borderTopRightRadius: 6,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_THICK,
    borderLeftWidth: CORNER_THICK,
    borderBottomLeftRadius: 6,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_THICK,
    borderRightWidth: CORNER_THICK,
    borderBottomRightRadius: 6,
  },
  hintBottom: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    textAlign: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
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
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  topSpacer: { width: 40 },
  loadingBadge: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: spacing.sm,
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
  errorBanner: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(220,38,38,0.85)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  errorBannerText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  iconSuccess: { backgroundColor: '#E8F5EE' },
  iconError: { backgroundColor: '#FDECEC' },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  modalMsg: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  modalBtnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  modalBtnSecondary: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  modalBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  permTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  permText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  permBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
  },
  permBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
