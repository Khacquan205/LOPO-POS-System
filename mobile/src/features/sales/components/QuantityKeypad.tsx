import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../../ui/theme';

type KeyLabel =
  | '1' | '2' | '3'
  | '4' | '5' | '6'
  | '7' | '8' | '9'
  | '+/-' | '0' | '.'
  | 'SL' | '%' | 'GIA' | 'DEL';

const ROWS: KeyLabel[][] = [
  ['1', '2', '3', 'SL'],
  ['4', '5', '6', '%'],
  ['7', '8', '9', 'GIA'],
  ['+/-', '0', '.', 'DEL'],
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
    if (key === 'SL' || key === '%' || key === 'GIA') return; // mode keys — no-op for now
    if (key === '+/-') {
      // toggle negative — not needed for qty but keep the key
      return;
    }
    if (key === '.') return; // quantities are integers
    // Append digit
    const next = value === '0' ? key : value + key;
    if (next.length > 5) return; // cap at 99999
    onChange(next);
  };

  return (
    <View style={styles.container}>
      {ROWS.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((key) => {
            const isMode = key === 'SL' || key === '%' || key === 'GIA';
            const isDel = key === 'DEL';
            const isActive = key === 'SL'; // Số lượng is default active mode

            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.key,
                  isMode && styles.modeKey,
                  isActive && styles.modeKeyActive,
                ]}
                onPress={() => handleKey(key)}
                activeOpacity={0.6}
              >
                {isDel ? (
                  <Ionicons name="backspace-outline" size={22} color={colors.textPrimary} />
                ) : (
                  <Text style={[styles.keyText, isMode && styles.modeKeyText, isActive && styles.modeKeyTextActive]}>
                    {key === 'SL' ? 'Số lượng' : key === 'GIA' ? 'Giá' : key}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
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
  modeKey: {
    backgroundColor: '#EBF2FF',
  },
  modeKeyActive: {
    backgroundColor: colors.primary,
  },
  keyText: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  modeKeyText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  modeKeyTextActive: {
    color: '#FFFFFF',
  },
});
