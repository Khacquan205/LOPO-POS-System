import React, { useEffect, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';

const STORAGE_KEY = '@lopo_settings';

type AfterLoginScreen = 'home' | 'sales';
type AfterPaymentScreen = 'home' | 'sales' | 'orders';

interface Settings {
  autoLogin: boolean;
  afterLogin: AfterLoginScreen;
  afterPayment: AfterPaymentScreen;
}

const DEFAULT_SETTINGS: Settings = {
  autoLogin: false,
  afterLogin: 'home',
  afterPayment: 'home',
};

const AFTER_LOGIN_OPTIONS: { value: AfterLoginScreen; label: string }[] = [
  { value: 'home', label: 'Trang chủ' },
  { value: 'sales', label: 'Bán hàng' },
];

const AFTER_PAYMENT_OPTIONS: { value: AfterPaymentScreen; label: string }[] = [
  { value: 'home', label: 'Trang chủ' },
  { value: 'sales', label: 'Bán hàng' },
  { value: 'orders', label: 'Đơn hàng' },
];

// ─── Custom Toggle ────────────────────────────────────────────────────────────
const TRACK_WIDTH = 50;
const TRACK_HEIGHT = 28;
const THUMB_SIZE = 22;
const THUMB_OFFSET = 3;

interface ToggleProps {
  value: boolean;
  onValueChange: (v: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ value, onValueChange }) => {
  const anim = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      bounciness: 4,
    }).start();
  }, [value]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [THUMB_OFFSET, TRACK_WIDTH - THUMB_SIZE - THUMB_OFFSET],
  });

  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary],
  });

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      hitSlop={8}
    >
      <Animated.View
        style={[styles.track, { backgroundColor: trackColor }]}
      >
        <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
      </Animated.View>
    </Pressable>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────
export const SettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  // Load từ storage khi mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
        } catch {}
      }
    });
  }, []);

  const save = (patch: Partial<Settings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Cài đặt" showBack />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Tự động đăng nhập */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={styles.labelGroup}>
              <View style={styles.iconWrap}>
                <Ionicons name="refresh-circle-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.sectionTitle}>Tự động đăng nhập</Text>
            </View>
            <Toggle
              value={settings.autoLogin}
              onValueChange={(v) => save({ autoLogin: v })}
            />
          </View>
          <Text style={styles.sectionDesc}>
            Tự động đăng nhập vào ứng dụng ở những lần mở app sau.
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Màn hình sau khi đăng nhập */}
        <View style={styles.card}>
          <View style={styles.labelGroup}>
            <View style={styles.iconWrap}>
              <Ionicons name="log-in-outline" size={18} color={colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Màn hình sau khi đăng nhập</Text>
          </View>
          <Text style={styles.sectionDesc}>
            Ứng dụng sẽ hiển thị màn hình nào sau khi{' '}
            <Text style={styles.bold}>đăng nhập</Text>
          </Text>
          <View style={styles.optionsRow}>
            {AFTER_LOGIN_OPTIONS.map((opt) => {
              const selected = settings.afterLogin === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  style={[styles.optionChip, selected && styles.optionChipSelected]}
                  onPress={() => save({ afterLogin: opt.value })}
                >
                  {selected && (
                    <Ionicons name="checkmark" size={14} color={colors.white} style={{ marginRight: 4 }} />
                  )}
                  <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Màn hình sau khi thanh toán */}
        <View style={styles.card}>
          <View style={styles.labelGroup}>
            <View style={styles.iconWrap}>
              <Ionicons name="card-outline" size={18} color={colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Màn hình sau khi thanh toán</Text>
          </View>
          <Text style={styles.sectionDesc}>
            Ứng dụng sẽ hiển thị màn hình nào sau khi{' '}
            <Text style={styles.bold}>thanh toán</Text>
          </Text>
          <View style={styles.optionsRow}>
            {AFTER_PAYMENT_OPTIONS.map((opt) => {
              const selected = settings.afterPayment === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  style={[styles.optionChip, selected && styles.optionChipSelected]}
                  onPress={() => save({ afterPayment: opt.value })}
                >
                  {selected && (
                    <Ionicons name="checkmark" size={14} color={colors.white} style={{ marginRight: 4 }} />
                  )}
                  <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },
  content: {
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: colors.primaryLight + '22',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  sectionTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  sectionDesc: {
    ...typography.caption ?? typography.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  bold: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  // Options (chip style)
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  optionChipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  optionLabel: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  optionLabelSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  // Toggle
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
});
