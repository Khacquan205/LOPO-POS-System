import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../../ui/components';
import { colors, spacing } from '../../../ui/theme';
import { ProductCategoryChip, ProductListItem } from '../components';
import {
  products,
  categories,
  getProductsByCategory,
  type PickedItem,
  type Product,
} from '../../products/mock/products.mock';
import type { MainStackScreenProps } from '../../../types/navigation';

type Props = MainStackScreenProps<'ProductPicker'>;

export const ProductPickerScreen: React.FC<Props> = ({ navigation, route }) => {
  const { orderId, returnScreen } = route.params;
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  // Map: productId → quantity selected
  const [selectedMap, setSelectedMap] = useState<Record<string, number>>({});

  const filteredProducts = useMemo(() => {
    let list: Product[] = getProductsByCategory(selectedCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [selectedCategory, search]);

  const handleProductAdd = useCallback((product: Product) => {
    setSelectedMap((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] ?? 0) + 1,
    }));
  }, []);

  const handleProductRemove = useCallback((product: Product) => {
    setSelectedMap((prev) => {
      const next = { ...prev };
      if ((next[product.id] ?? 0) <= 1) {
        delete next[product.id];
      } else {
        next[product.id] -= 1;
      }
      return next;
    });
  }, []);

  const totalSelected = Object.values(selectedMap).reduce((s, q) => s + q, 0);

  const handleDone = useCallback(() => {
    const pickedItems: PickedItem[] = Object.entries(selectedMap)
      .filter(([, qty]) => qty > 0)
      .map(([productId, quantity]) => {
        const product = products.find((p) => p.id === productId)!;
        return {
          productId,
          productName: product.name,
          unitPrice: product.price,
          quantity,
        };
      });

    if (returnScreen === 'Sales') {
      navigation.navigate('Sales', { pickedItems });
    } else {
      navigation.navigate('DraftOrderDetail', { orderId, pickedItems });
    }
  }, [selectedMap, returnScreen, navigation, orderId]);

  const renderItem = ({ item }: { item: Product }) => (
    <ProductListItem
      product={item}
      selectedQty={selectedMap[item.id] ?? 0}
      onAdd={() => handleProductAdd(item)}
      onRemove={() => handleProductRemove(item)}
    />
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title={`Đơn ${orderId}`} showBack />

      {/* Search bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Nhập tên sản phẩm"
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
        </View>
      </View>

      {/* Category chips - horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
        style={styles.categoryBar}
      >
        {categories.map((cat) => (
          <ProductCategoryChip
            key={cat.id}
            label={cat.name}
            isSelected={selectedCategory === cat.id}
            onPress={() => setSelectedCategory(cat.id)}
          />
        ))}
      </ScrollView>

      {/* Product list */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(p) => p.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        style={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
          </View>
        }
      />

      {/* Done footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={handleDone}
          activeOpacity={0.8}
        >
          <Text style={styles.doneText}>
            Xong{totalSelected > 0 ? `  (${totalSelected} món)` : ''}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 0,
    marginRight: spacing.xs,
  },
  categoryBar: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    maxHeight: 50,
  },
  categoryScroll: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.md,
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  footer: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  doneButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  doneText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
