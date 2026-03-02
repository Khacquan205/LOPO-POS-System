import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';
import type { AuthScreenProps } from '../../../types/navigation';

type Props = AuthScreenProps<'RegisterSelectRole'>;

export const RegisterSelectRoleScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>ĐĂNG KÝ</Text>
        <Text style={styles.subtitle}>Bạn muốn đăng ký làm:</Text>
      </View>

      <View style={styles.options}>
        <Card onPress={() => navigation.navigate('RegisterOwner')} style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="storefront-outline" size={48} color={colors.primary} />
            </View>
            <Text style={styles.cardTitle}>Chủ cửa hàng</Text>
            <Text style={styles.cardDescription}>
              Tạo và quản lý cửa hàng của riêng bạn
            </Text>
          </View>
        </Card>

        <Card onPress={() => navigation.navigate('RegisterStaff')} style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="person-outline" size={48} color={colors.primary} />
            </View>
            <Text style={styles.cardTitle}>Nhân viên bán hàng</Text>
            <Text style={styles.cardDescription}>
              Tham gia cửa hàng với vai trò nhân viên
            </Text>
          </View>
        </Card>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backLink}>Quay lại đăng nhập</Text>
      </TouchableOpacity>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    ...typography.screenTitle,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  options: {
    flex: 1,
    gap: spacing.md,
  },
  card: {
    paddingVertical: spacing.xl,
  },
  cardContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  cardDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  backLink: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
});
