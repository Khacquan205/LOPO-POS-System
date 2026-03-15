import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../../ui/theme';
import type { ProductItemViewModel } from '../../products/store/products.store';
import { formatPrice } from '../../../lib/format';

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
  const outOfStock = product.trackInventory && product.onHand <= 0;

  return (
    <Pressable
      style={styles.container}
      onPress={outOfStock ? undefined : onAdd}
      disabled={outOfStock}
    >
      <View style={[styles.colorBar, { backgroundColor: product.categoryColor ?? colors.border }]} />

      <View style={styles.imageContainer}>
        {product.image ? (
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="cube-outline" size={26} color={colors.textSecondary} />
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <Text style={styles.stock}>Tồn: {product.onHand}</Text>
        {outOfStock && <Text style={styles.outOfStock}>Hết hàng</Text>}
      </View>

      {/* Stepper / Add button — disabled when out of stock */}
      {selectedQty > 0 ? (
        <View style={styles.stepper}>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="remove" size={18} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.stepQty}>{selectedQty}</Text>
          <TouchableOpacity
            style={[styles.stepBtn, outOfStock && styles.stepBtnDisabled]}
            onPress={(e) => {
              e.stopPropagation();
              if (!outOfStock) onAdd();
            }}
            activeOpacity={outOfStock ? 1 : 0.7}
          >
            <Ionicons name="add" size={18} color={outOfStock ? colors.textDisabled : colors.primary} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.addIcon, outOfStock && styles.stepBtnDisabled]}
          onPress={(e) => {
            e.stopPropagation();
            if (!outOfStock) onAdd();
          }}
          activeOpacity={outOfStock ? 1 : 0.7}
        >
          <Ionicons name="add" size={20} color={outOfStock ? colors.textDisabled : colors.textSecondary} />
        </TouchableOpacity>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: '#F6F6F6',
    gap: spacing.sm,
  },
  colorBar: {
    width: 3,
    height: 60,
    borderRadius: 2,
  },
  imageContainer: {
    width: 56,
    height: 56,
    backgroundColor: colors.white,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
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
  stock: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  outOfStock: {
    fontSize: 12,
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
