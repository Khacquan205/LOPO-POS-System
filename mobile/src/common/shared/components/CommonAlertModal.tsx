import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../../ui/theme';

export type CommonAlertVariant = 'success' | 'warning' | 'danger' | 'confirm';

export type CommonAlertModalProps = {
  visible: boolean;
  variant?: CommonAlertVariant;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
  iconName?: React.ComponentProps<typeof Ionicons>['name'];
  loading?: boolean;
};

type VariantConfig = {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  tintColor: string;
  textColor: string;
  iconBg: string;
  confirmBg: string;
};

const VARIANT_CONFIG: Record<CommonAlertVariant, VariantConfig> = {
  success: {
    iconName: 'checkmark',
    tintColor: colors.success,
    textColor: colors.success,
    iconBg: '#E8F6EF',
    confirmBg: colors.success,
  },
  warning: {
    iconName: 'alert-circle',
    tintColor: colors.warning,
    textColor: colors.warning,
    iconBg: '#FEF3C7',
    confirmBg: colors.warning,
  },
  danger: {
    iconName: 'close',
    tintColor: colors.error,
    textColor: colors.error,
    iconBg: '#FDECEC',
    confirmBg: colors.error,
  },
  confirm: {
    iconName: 'close',
    tintColor: colors.error,
    textColor: colors.error,
    iconBg: '#FDECEC',
    confirmBg: colors.error,
  },
};

export const CommonAlertModal: React.FC<CommonAlertModalProps> = ({
  visible,
  variant = 'success',
  title,
  message,
  confirmText = 'OK',
  cancelText = 'CANCEL',
  onConfirm,
  onCancel,
  showCancel,
  iconName,
  loading = false,
}) => {
  const [mounted, setMounted] = useState(visible);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    if (mounted) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.96,
          duration: 180,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible, mounted, opacity, scale]);

  const config = useMemo(() => VARIANT_CONFIG[variant], [variant]);
  const shouldShowCancel = showCancel ?? variant === 'confirm';
  const canPressConfirm = !loading;

  if (!mounted) return null;

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      onRequestClose={onCancel ?? onConfirm}
    >
      <Animated.View style={[styles.overlay, { opacity }]}>
        <Animated.View style={[styles.dialog, { transform: [{ scale }], opacity }]}> 
          <View style={[styles.iconCircle, { backgroundColor: config.iconBg }]}> 
            <Ionicons
              name={iconName ?? config.iconName}
              size={34}
              color={config.tintColor}
            />
          </View>

          {!!title && (
            <Text style={[styles.title, { color: config.textColor }]}>{title}</Text>
          )}
          {!!message && <Text style={styles.message}>{message}</Text>}

          <View style={[styles.actions, !shouldShowCancel && styles.actionsSingle]}>
            {shouldShowCancel && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onCancel}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                { backgroundColor: config.confirmBg },
                loading && styles.confirmButtonDisabled,
              ]}
              onPress={onConfirm}
              activeOpacity={canPressConfirm ? 0.85 : 1}
              disabled={!canPressConfirm}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.confirmText}>{confirmText}</Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  dialog: {
    backgroundColor: colors.background,
    borderRadius: 22,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  actionsSingle: {
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  confirmButtonDisabled: {
    opacity: 0.75,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
});
