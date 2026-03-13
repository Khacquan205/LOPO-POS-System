import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STATUS_LABELS, STATUS_COLORS, STATUS_BG_COLORS, type OrderStatusApi } from '../types/order.types';

interface OrderStatusChipProps {
  status: OrderStatusApi;
}

export const OrderStatusChip: React.FC<OrderStatusChipProps> = ({ status }) => {
  const label = STATUS_LABELS[status] ?? status;
  const color = STATUS_COLORS[status] ?? '#9CA3AF';
  const bgColor = STATUS_BG_COLORS[status] ?? '#F3F4F6';
  return (
    <View style={[styles.chip, { backgroundColor: bgColor }]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
});
