import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../../ui/theme';
import type { Product } from '../../products/mock/products.mock';
import { formatPrice } from '../../products/mock/products.mock';

interface ProductListItemProps {
  product: Product;
  selectedQty: number;
  onAdd: () => void;
  onRemove: () => void;
}

export const ProductListItem: React.FC<ProductListItemProps> = ({
  product,
  selectedQty,
  onAdd,
  onRemove,
}) => {
  return (
    <View style={styles.container}>
      {/* Thumbnail */}
      <View style={[styles.thumbnail, { backgroundColor: product.color }]}>
        <Ionicons name={product.icon as any} size={22} color={colors.textPrimary} />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.price}>{formatPrice(product.price)} / {product.unit}</Text>
      </View>

      {/* Stepper / Add button */}
      {selectedQty > 0 ? (
        <View style={styles.stepper}>
          <TouchableOpacity style={styles.stepBtn} onPress={onRemove} activeOpacity={0.7}>
            <Ionicons name="remove" size={18} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.stepQty}>{selectedQty}</Text>
          <TouchableOpacity style={styles.stepBtn} onPress={onAdd} activeOpacity={0.7}>
            <Ionicons name="add" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.addIcon} onPress={onAdd} activeOpacity={0.7}>
          <Ionicons name="add" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
  },
  thumbnail: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
    marginRight: spacing.sm,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  price: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepQty: {
    minWidth: 28,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  addIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
