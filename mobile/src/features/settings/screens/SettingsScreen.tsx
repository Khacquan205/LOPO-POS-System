import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';

type AfterLoginScreen = 'home' | 'sales';
type AfterPaymentScreen = 'home' | 'sales' | 'orders';

const AFTER_LOGIN_OPTIONS: { value: AfterLoginScreen; label: string }[] = [
  { value: 'home', label: 'Trang chủ' },
  { value: 'sales', label: 'Bán hàng' },
];

const AFTER_PAYMENT_OPTIONS: { value: AfterPaymentScreen; label: string }[] = [
  { value: 'home', label: 'Trang chủ' },
  { value: 'sales', label: 'Bán hàng' },
  { value: 'orders', label: 'Đơn hàng' },
];

export const SettingsScreen: React.FC = () => {
  const [autoLogin, setAutoLogin] = useState(false);
  const [afterLogin, setAfterLogin] = useState<AfterLoginScreen>('home');
  const [afterPayment, setAfterPayment] = useState<AfterPaymentScreen>('home');

  return (
    <View style={styles.container}>
      <ScreenHeader title="Cài đặt" showBack />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Tự động đăng nhập */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="refresh-circle-outline" size={20} color={colors.primary} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Tự động đăng nhập</Text>
          </View>
          <Text style={styles.sectionDesc}>Tự động đăng nhập vào ứng dụng ở những lần mở app sau.</Text>
          <View style={styles.toggleRow}>
            <Switch
              value={autoLogin}
              onValueChange={setAutoLogin}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Màn hình sau khi đăng nhập */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="phone-portrait-outline" size={20} color={colors.primary} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Màn hình sau khi đăng nhập</Text>
          </View>
          <Text style={styles.sectionDesc}>
            Ứng dụng sẽ hiển thị màn hình nào sau khi <Text style={styles.bold}>đăng nhập</Text>
          </Text>
          {AFTER_LOGIN_OPTIONS.map((opt) => (
            <View key={opt.value} style={styles.checkRow}>
              <Ionicons
                name={afterLogin === opt.value ? 'checkbox' : 'square-outline'}
                size={20}
                color={afterLogin === opt.value ? colors.primary : colors.textSecondary}
                onPress={() => setAfterLogin(opt.value)}
              />
              <Text style={styles.checkLabel} onPress={() => setAfterLogin(opt.value)}>
                {opt.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Màn hình sau khi thanh toán */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="phone-portrait-outline" size={20} color={colors.primary} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Màn hình sau khi thanh toán</Text>
          </View>
          <Text style={styles.sectionDesc}>
            Ứng dụng sẽ hiển thị màn hình nào sau khi <Text style={styles.bold}>thanh toán</Text>
          </Text>
          {AFTER_PAYMENT_OPTIONS.map((opt) => (
            <View key={opt.value} style={styles.checkRow}>
              <Ionicons
                name={afterPayment === opt.value ? 'checkbox' : 'square-outline'}
                size={20}
                color={afterPayment === opt.value ? colors.primary : colors.textSecondary}
                onPress={() => setAfterPayment(opt.value)}
              />
              <Text style={styles.checkLabel} onPress={() => setAfterPayment(opt.value)}>
                {opt.label}
              </Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  section: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sectionIcon: {
    marginRight: spacing.sm,
  },
  sectionTitle: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  sectionDesc: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  bold: {
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  toggleRow: {
    alignItems: 'flex-end',
    marginTop: -spacing.xl,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  checkLabel: {
    ...typography.body,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
});
