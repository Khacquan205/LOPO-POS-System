import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../../ui/components';
import { colors, spacing } from '../../../ui/theme';
import { CommonAlertModal } from '../../../common/shared/components/CommonAlertModal';
import { useCommonAlert } from '../../../common/shared/hooks/useCommonAlert';
import { ProductListItem } from '../components';
import { CategoryChips } from '../../products/components/CategoryChips';
import { useProductsStore } from '../../products/store/products.store';
import { useCategoriesStore } from '../../products/store/categories.store';
import { useAuthStore } from '../../../store/auth.store';
import { usePosStore } from '../store/pos.store';
import type { ProductItemViewModel } from '../../products/store/products.store';
import type { MainStackScreenProps } from '../../../types/navigation';
import type { PickedItem } from '../../../types/navigation';

type Props = MainStackScreenProps<'ProductPicker'>;

export const ProductPickerScreen: React.FC<Props> = ({ navigation, route }) => {
  const { orderId, returnScreen } = route.params;
  const insets = useSafeAreaInsets();
  const orderCode = usePosStore((s) => s.orderCode);

  // ── Real product & category data ─────────────────────────────
  const accessToken = useAuthStore((s) => s.accessToken);
  const products = useProductsStore((s) => s.products);
  const fetchProducts = useProductsStore((s) => s.fetchProducts);
  const storeCategories = useCategoriesStore((s) => s.categories);
  const fetchCategories = useCategoriesStore((s) => s.fetchCategories);

  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { alertProps, showAlert } = useCommonAlert();

  useEffect(() => {
    if (!accessToken) return;
    setIsLoading(true);
    setLoadError(null);
    (async () => {
      try {
        await fetchCategories(accessToken);
        const cats = useCategoriesStore.getState().categories;
        await fetchProducts(accessToken, cats);
      } catch {
        setLoadError('Không thể tải danh sách sản phẩm');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [accessToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  // Map: productId → quantity selected
  const [selectedMap, setSelectedMap] = useState<Record<string, number>>({});

  // Category list: "Tất cả" + real categories
  const categoryChips = useMemo(() => [
    { id: 'all', name: 'Tất cả', color: colors.linkOrange },
    ...storeCategories.map((c) => ({ id: c.id, name: c.name, color: c.color })),
  ], [storeCategories]);

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => p.status === 'active');
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.categoryId === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [products, selectedCategory, search]);

  const handleProductAdd = useCallback((product: ProductItemViewModel) => {
    // Enforce inventory cap
    if (!product.trackInventory || product.onHand <= 0) {
      showAlert({
        variant: 'warning',
        title: 'Hết hàng',
        message: 'Sản phẩm tạm hết hàng',
      });
      return;
    }

    setSelectedMap((prev) => {
      const current = prev[product.id] ?? 0;
      if (product.trackInventory && current >= product.onHand) return prev;
      return { ...prev, [product.id]: current + 1 };
    });
  }, [showAlert]);

  const handleProductRemove = useCallback((product: ProductItemViewModel) => {
    setSelectedMap((prev) => {
      const next = { ...prev };
      if ((next[product.id] ?? 0) <= 1) {
        delete next[product.id];
      } else {
        next[product.id] -= 1;
      }

      <CommonAlertModal {...alertProps} />
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

    const routes = navigation.getState().routes;
    const previous = routes[routes.length - 2];
    if (previous) {
      navigation.dispatch({
        ...CommonActions.setParams({
          ...((returnScreen === 'Sales')
            ? { pickedItems }
            : { orderId, pickedItems }),
        }),
        source: previous.key,
      });
      navigation.goBack();
      return;
    }

    if (returnScreen === 'Sales') {
      navigation.navigate('Sales', { pickedItems });
    } else {
      navigation.navigate('DraftOrderDetail', { orderId, pickedItems });
    }
  }, [selectedMap, returnScreen, navigation, orderId, products]);

  const renderItem = ({ item }: { item: ProductItemViewModel }) => (
    <ProductListItem
      product={item}
      selectedQty={selectedMap[item.id] ?? 0}
      onAdd={() => handleProductAdd(item)}
      onRemove={() => handleProductRemove(item)}
    />
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Đơn mới"
        subtitle={orderCode ?? (orderId !== 'new' ? orderId : undefined)}
        showBack
      />

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

      {/* Category chips */}
      <CategoryChips
        categories={categoryChips}
        selectedId={selectedCategory}
        onSelectCategory={(id) => setSelectedCategory(id ?? 'all')}
        compact
      />

      {/* Product list */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : loadError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{loadError}</Text>
        </View>
      ) : (
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
      )}

      {/* Done footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <TouchableOpacity
          style={[styles.doneButton, totalSelected === 0 && styles.doneButtonDisabled]}
          onPress={totalSelected > 0 ? handleDone : undefined}
          activeOpacity={totalSelected > 0 ? 0.8 : 1}
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
  doneButtonDisabled: {
    backgroundColor: colors.textDisabled,
  },
  doneText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
  },
});
