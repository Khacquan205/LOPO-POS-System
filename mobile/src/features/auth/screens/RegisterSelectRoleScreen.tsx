import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../../ui/components';
import { colors, spacing, typography, radius } from '../../../ui/theme';
import type { AuthScreenProps } from '../../../types/navigation';

type Props = AuthScreenProps<'RegisterSelectRole'>;

export const RegisterSelectRoleScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <Screen scroll style={styles.screen}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={colors.primary} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>ĐĂNG KÝ</Text>
        <Text style={styles.subtitle}>Bạn muốn đăng ký làm:</Text>
      </View>

      <View style={styles.options}>
        <TouchableOpacity
          style={styles.roleCard}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('RegisterOwner')}
        >
          <Image
            source={require('../../../../assets/Owner.png')}
            style={styles.roleImage}
            resizeMode="cover"
          />
          <View style={styles.roleLabelWrapper}>
            <Text style={styles.roleLabel}>Chủ cửa hàng</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roleCard}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('RegisterStaff')}
        >
          <Image
            source={require('../../../../assets/Staff.jpg')}
            style={styles.roleImage}
            resizeMode="cover"
          />
          <View style={styles.roleLabelWrapper}>
            <Text style={styles.roleLabel}>Nhân viên bán hàng</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingTop: spacing.md,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
    padding: spacing.xs,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.screenTitle,
    color: colors.primary,
    marginBottom: spacing.sm,
    textAlign: 'left',
  },
  subtitle: {
    ...typography.body,
    color: colors.textPrimary,
    textAlign: 'left',
  },
  options: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  roleCard: {
    backgroundColor: '#F8EFDf',
    borderRadius: 18,
    padding: spacing.md,
    alignItems: 'center',
  },
  roleImage: {
    width: '100%',
    height: 230,
    borderRadius: 16,
  },
  roleLabelWrapper: {
    marginTop: -18,
    backgroundColor: colors.background,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 20,
    minWidth: 180,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  roleLabel: {
    ...typography.body,
    color: colors.textPrimary,
    fontSize: 18,
  },
});