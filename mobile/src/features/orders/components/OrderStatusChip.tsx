import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STATUS_LABELS, STATUS_COLORS, STATUS_BG_COLORS, OrderStatusType } from '../mock/orders.mock';

interface OrderStatusChipProps {
  status: OrderStatusType;
}

export const OrderStatusChip: React.FC<OrderStatusChipProps> = ({ status }) => {
  return (
    <View style={[styles.chip, { backgroundColor: STATUS_BG_COLORS[status] }]}>
      <Text style={[styles.label, { color: STATUS_COLORS[status] }]}>
        {STATUS_LABELS[status]}
      </Text>
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
