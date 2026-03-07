import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../../../ui/theme";
import { formatPrice } from "../mock/productManagement.mock";

// ============================================================================
// TYPES
// ============================================================================

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  categoryColor: string;
  image?: string;
}

interface ProductItemProps {
  product: Product;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  return (
    <View>
      <View style={styles.productItem}>
        {/* Color Bar */}
        <View
          style={[styles.colorBar, { backgroundColor: product.categoryColor }]}
        />

        {/* Spacer */}
        <View style={{ width: spacing.md }} />

        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Ionicons
            name="cube-outline"
            size={32}
            color={colors.textSecondary}
          />
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: "#F6F6F6",
  },
  colorBar: {
    width: 3,
    height: 60,
    borderRadius: 2,
  },
  imageContainer: {
    width: 64,
    height: 64,
    backgroundColor: colors.white,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  productInfo: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: "center",
  },
  productName: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: 4,
  },
  productPrice: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#DDDDDD",
    marginLeft: spacing.md + 3 + spacing.md + 64 + spacing.md,
    marginRight: spacing.md,
  },
});
