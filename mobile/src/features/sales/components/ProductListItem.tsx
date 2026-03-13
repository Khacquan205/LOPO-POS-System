import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../../ui/theme';
import type { ProductItemViewModel } from '../../products/store/products.store';
import { formatPrice } from '../../products/mock/products.mock';

interface ProductListItemProps {
  product: ProductItemViewModel;
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
  // Show stock warning if tracking is enabled and stock is low
  const showLowStock = product.trackInventory && product.onHand <= 5;
  const outOfStock = product.trackInventory && product.onHand <= 0;

  return (
    <View style={styles.container}>
      {/* Thumbnail — uses category color as background */}
      <View style={[styles.thumbnail, { backgroundColor: product.categoryColor ?? colors.surfaceSecondary }]}>
        <Ionicons name="pricetag-outline" size={20} color={colors.textPrimary} />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        {showLowStock && !outOfStock && (
          <Text style={styles.lowStock}>Còn {product.onHand} trong kho</Text>
        )}
        {outOfStock && (
          <Text style={styles.outOfStock}>Hết hàng</Text>
        )}
      </View>

      {/* Stepper / Add button — disabled when out of stock */}
      {selectedQty > 0 ? (
        <View style={styles.stepper}>
          <TouchableOpacity style={styles.stepBtn} onPress={onRemove} activeOpacity={0.7}>
            <Ionicons name="remove" size={18} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.stepQty}>{selectedQty}</Text>
          <TouchableOpacity
            style={[styles.stepBtn, outOfStock && styles.stepBtnDisabled]}
            onPress={outOfStock ? undefined : onAdd}
            activeOpacity={outOfStock ? 1 : 0.7}
          >
            <Ionicons name="add" size={18} color={outOfStock ? colors.textDisabled : colors.primary} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.addIcon, outOfStock && styles.stepBtnDisabled]}
          onPress={outOfStock ? undefined : onAdd}
          activeOpacity={outOfStock ? 1 : 0.7}
        >
          <Ionicons name="add" size={20} color={outOfStock ? colors.textDisabled : colors.textSecondary} />
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
  lowStock: {
    fontSize: 11,
    color: colors.warning,
    marginTop: 2,
  },
  outOfStock: {
    fontSize: 11,
    color: colors.error,
    marginTop: 2,
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
  stepBtnDisabled: {
    opacity: 0.4,
  },
});
