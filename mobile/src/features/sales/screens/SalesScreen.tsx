import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenHeader, Button } from '../../../ui/components';
import { colors, spacing, typography } from '../../../ui/theme';

export const SalesScreen: React.FC = () => {
  const handleCreateOrder = (): void => {
    // TODO: Navigate to create order flow
    console.log('Create new order');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Bán hàng" showBack />
      
      <View style={styles.content}>
        <Text style={styles.placeholder}>
          Màn hình bán hàng sẽ được phát triển sau
        </Text>
        
        <Button
          title="Tạo đơn mới"
          onPress={handleCreateOrder}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  placeholder: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    width: '80%',
  },
});
