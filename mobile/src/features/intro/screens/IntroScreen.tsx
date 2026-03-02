import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { Screen, Button } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';
import { useAppStore } from '../../../store/app.store';
import type { RootScreenProps } from '../../../types/navigation';

type Props = RootScreenProps<'Intro'>;

export const IntroScreen: React.FC<Props> = ({ navigation }) => {
  const { setHasLaunchedTrue } = useAppStore();

  const handleLogin = async (): Promise<void> => {
    await setHasLaunchedTrue();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      }),
    );
  };

  const handleRegister = async (): Promise<void> => {
    await setHasLaunchedTrue();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Auth',
            state: {
              routes: [{ name: 'Login' }, { name: 'RegisterSelectRole' }],
              index: 1,
            },
          },
        ],
      }),
    );
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.smallText}>Bắt đầu nào</Text>
        <Text style={styles.title}>LOPO XIN CHÀO!</Text>
      </View>

      <View style={styles.footer}>
        <Button title="Đăng ký ngay" onPress={handleRegister} />

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Bạn đã có tài khoản? </Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginLink}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.screenTitle,
    color: colors.primary,
    fontSize: 28,
    textAlign: 'center',
  },
  footer: {
    paddingBottom: spacing.xl,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  loginText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  loginLink: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
});
