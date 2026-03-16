import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing } from '../../../ui/theme';

type KeyLabel =
  | '1' | '2' | '3'
  | '4' | '5' | '6'
  | '7' | '8' | '9'
  | 'DEL';

const ROWS: KeyLabel[][] = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['DEL'],
];

interface QuantityKeypadProps {
  value: string;
  onChange: (val: string) => void;
}

export const QuantityKeypad: React.FC<QuantityKeypadProps> = ({ value, onChange }) => {
  const handleKey = (key: KeyLabel) => {
    if (key === 'DEL') {
      onChange(value.length > 1 ? value.slice(0, -1) : '0');
      return;
    }

    const next = value === '0' ? key : value + key;
    if (next.length > 5) return;
    onChange(next);
  };

  return (
    <View style={styles.container}>
      {ROWS.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((key) => (
            <TouchableOpacity
              key={key}
              style={[styles.key, key === 'DEL' && styles.deleteKey]}
              onPress={() => handleKey(key)}
              activeOpacity={0.6}
            >
              <Text style={[styles.keyText, key === 'DEL' && styles.deleteText]}>
                {key === 'DEL' ? 'Xóa' : key}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
    gap: spacing.xs,
  },
  key: {
    flex: 1,
    height: 56,
    borderRadius: 10,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  keyText: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  deleteKey: {
    marginBottom: spacing.sm,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.error,
  },
});
