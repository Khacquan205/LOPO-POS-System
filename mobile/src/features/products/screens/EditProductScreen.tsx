import React, { useMemo, useState, useEffect, useRef } from "react";
import { Alert, ScrollView, SafeAreaView, StyleSheet } from "react-native";
import { ImagePickerHeader } from "../components/createProduct/ImagePickerHeader";
import { ProductForm } from "../components/createProduct/ProductForm";
import { FooterActions } from "../components/createProduct/FooterActions";
import {
  CategoryPickerBottomSheet,
  type PickerCategory,
} from "../components/CategoryPickerBottomSheet";
import { AddCategoryBottomSheet } from "../components/AddCategoryBottomSheet";
import { useProductsStore } from "../store/products.store";
import { useAuthStore } from "../../../store/auth.store";
import { useCategoriesStore } from "../store/categories.store";
import { useInventoryStore } from "../store/inventory.store";
import type { MainStackScreenProps } from "../../../types/navigation";

const HERO_IMAGE_URI =
  "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=1200&q=80";

type Props = MainStackScreenProps<"EditProduct">;

export const EditProductScreen: React.FC<Props> = ({ route, navigation }) => {
  const products = useProductsStore((state) => state.products);
  const fetchProductById = useProductsStore((state) => state.fetchProductById);
  const updateProduct = useProductsStore((state) => state.updateProduct);
  const accessToken = useAuthStore((state) => state.accessToken);
  const categories = useCategoriesStore((state) => state.categories);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);
  const createCategory = useCategoriesStore((state) => state.createCategory);
  const fetchStockByProduct = useInventoryStore(
    (state) => state.fetchStockByProduct,
  );
  const [categoryList, setCategoryList] = useState<PickerCategory[]>([]);

  const editingProduct = useMemo(
    () => products.find((item) => item.id === route.params.productId),
    [products, route.params.productId],
  );

  const [productName, setProductName] = useState(
    editingProduct?.name ?? "Bánh mì",
  );
  const [productPrice, setProductPrice] = useState(
    editingProduct
      ? new Intl.NumberFormat("vi-VN").format(editingProduct.price)
      : "4,000",
  );
  const [productCategory, setProductCategory] = useState(
    editingProduct?.category ?? "Bánh kẹo",
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    editingProduct?.categoryId ?? null,
  );
  const [barcode, setBarcode] = useState(editingProduct?.barcode ?? "");
  const [manageInventory, setManageInventory] = useState(
    editingProduct?.trackInventory ?? true,
  );
  const [inventory, setInventory] = useState(
    String(editingProduct?.onHand ?? 0),
  );
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const hasHydratedFormRef = useRef(false);

  const categoryLookup = useMemo(
    () =>
      categories.map((item) => ({
        id: item.id,
        name: item.name,
        color: item.color,
      })),
    [categories],
  );

  useEffect(() => {
    if (!accessToken) return;
    void fetchCategories(accessToken);
  }, [accessToken, fetchCategories]);

  useEffect(() => {
    if (!accessToken) return;
    if (hasHydratedFormRef.current) return;
    void (async () => {
      try {
        const latest = await fetchProductById(
          accessToken,
          route.params.productId,
          categoryLookup,
        );

        if (!latest) return;

        setProductName(latest.name);
        setProductPrice(new Intl.NumberFormat("vi-VN").format(latest.price));
        setProductCategory(latest.category);
        setSelectedCategoryId(latest.categoryId);
        setBarcode(latest.barcode ?? "");
        setManageInventory(latest.trackInventory);
        setInventory(String(latest.onHand ?? 0));
        hasHydratedFormRef.current = true;
      } catch (error) {
        console.warn("Load product for edit failed:", error);
      }
    })();
  }, [accessToken, fetchProductById, route.params.productId, categoryLookup]);

  useEffect(() => {
    if (!accessToken) return;
    void (async () => {
      const onHand = await fetchStockByProduct(
        accessToken,
        route.params.productId,
      );
      if (typeof onHand === "number" && manageInventory) {
        setInventory(String(onHand));
      }
    })();
  }, [
    accessToken,
    fetchStockByProduct,
    route.params.productId,
    manageInventory,
  ]);

  const handleChangeManageInventory = (value: boolean) => {
    setManageInventory(value);
    if (!value) {
      setInventory("0");
    }
  };

  useEffect(() => {
    setCategoryList(
      categories.map((item) => ({
        id: item.id,
        name: item.name,
        color: item.color,
      })),
    );
  }, [categories]);

  const handleSelectCategory = () => {
    setShowCategoryPicker(true);
  };

  const handleCategorySelected = (category: PickerCategory) => {
    setProductCategory(category.name);
    setSelectedCategoryId(category.id);
  };

  const handleAddNewCategory = () => {
    setShowAddCategory(true);
  };

  const handleAddCategorySubmit = async (
    categoryName: string,
    _selectedColor: string,
  ) => {
    if (!accessToken) return;
    try {
      await createCategory(accessToken, {
        name: categoryName,
        is_active: true,
      });
    } catch (error) {
      console.warn("Create category failed:", error);
    }
    setShowAddCategory(false);
  };

  const handleSave = async () => {
    if (!accessToken) return;
    const parsedPrice = Number(productPrice.replace(/[^0-9]/g, ""));
    const normalizedPrice = Number.isFinite(parsedPrice) ? parsedPrice : 0;
    const onHand = Number(inventory.replace(/[^0-9]/g, ""));
    const normalizedOnHand = Number.isFinite(onHand) ? onHand : 0;

    if (!productName.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tên sản phẩm.");
      return;
    }

    if (normalizedPrice <= 0) {
      Alert.alert("Giá chưa hợp lệ", "Giá bán phải lớn hơn 0.");
      return;
    }

    if (manageInventory && normalizedOnHand <= 0) {
      Alert.alert(
        "Tồn kho chưa hợp lệ",
        "Khi bật quản lý tồn kho, bạn phải nhập số lượng tồn lớn hơn 0.",
      );
      return;
    }

    const categoryLookup = categoryList.map((item) => ({
      id: item.id,
      name: item.name,
      color: item.color,
    }));

    try {
      await updateProduct(
        accessToken,
        route.params.productId,
        {
          name: productName.trim(),
          price: normalizedPrice,
          category_id: selectedCategoryId,
          barcode: barcode.trim() || undefined,
          track_inventory: manageInventory,
          on_hand: manageInventory ? normalizedOnHand : 0,
        },
        categoryLookup,
      );
    } catch (error) {
      console.warn("Update product failed:", error);
      return;
    }

    // Navigate back with edited flag to trigger success toast
    navigation.navigate("ProductDetail", {
      productId: route.params.productId,
      edited: true,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <ImagePickerHeader
          imageUri={HERO_IMAGE_URI}
          onBackPress={() => navigation.goBack()}
          onSelectImagePress={() => console.log("Select image pressed")}
        />

        <ProductForm
          productName={productName}
          onChangeProductName={setProductName}
          productPrice={productPrice}
          onChangeProductPrice={setProductPrice}
          productCategory={productCategory}
          onPressSelectCategory={handleSelectCategory}
          barcode={barcode}
          onChangeBarcode={setBarcode}
          onPressScanBarcode={() => console.log("Scan barcode pressed")}
          manageInventory={manageInventory}
          onChangeManageInventory={handleChangeManageInventory}
          inventory={inventory}
          onChangeInventory={setInventory}
        />

        <FooterActions
          onCancelPress={() => navigation.goBack()}
          onPrimaryPress={handleSave}
          primaryLabel="Lưu"
        />
      </ScrollView>

      <CategoryPickerBottomSheet
        visible={showCategoryPicker}
        onClose={() => setShowCategoryPicker(false)}
        onSelectCategory={handleCategorySelected}
        onAddNewCategory={handleAddNewCategory}
        categories={categoryList}
      />

      {/* Add Category Bottom Sheet */}
      <AddCategoryBottomSheet
        visible={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        onSubmit={handleAddCategorySubmit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
});
