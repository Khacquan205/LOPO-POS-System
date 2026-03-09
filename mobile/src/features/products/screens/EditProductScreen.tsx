import React, { useMemo, useState } from "react";
import { ScrollView, SafeAreaView, StyleSheet } from "react-native";
import { ImagePickerHeader } from "../components/createProduct/ImagePickerHeader";
import { ProductForm } from "../components/createProduct/ProductForm";
import { FooterActions } from "../components/createProduct/FooterActions";
import { CategoryPickerBottomSheet } from "../components/CategoryPickerBottomSheet";
import { AddCategoryBottomSheet } from "../components/AddCategoryBottomSheet";
import { Category } from "../mock/productManagement.mock";
import { useProductsStore } from "../store/products.store";
import type { MainStackScreenProps } from "../../../types/navigation";

const HERO_IMAGE_URI =
  "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=1200&q=80";

type Props = MainStackScreenProps<"EditProduct">;

export const EditProductScreen: React.FC<Props> = ({ route, navigation }) => {
  const products = useProductsStore((state) => state.products);
  const updateProduct = useProductsStore((state) => state.updateProduct);

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
  const [barcode, setBarcode] = useState("6756756800");
  const [manageInventory, setManageInventory] = useState(true);
  const [inventory, setInventory] = useState("67");
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const handleSelectCategory = () => {
    setShowCategoryPicker(true);
  };

  const handleCategorySelected = (category: Category) => {
    setProductCategory(category.name);
  };

  const handleAddNewCategory = () => {
    setShowAddCategory(true);
  };

  const handleAddCategorySubmit = (
    categoryName: string,
    selectedColor: string,
  ) => {
    console.log("Add category submitted", { categoryName, selectedColor });
    // TODO: Add the new category to the store or list
    // For now, just close the bottom sheet
    setShowAddCategory(false);
  };

  const handleSave = () => {
    const parsedPrice = Number(productPrice.replace(/[^0-9]/g, ""));

    updateProduct(route.params.productId, {
      name: productName,
      price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
      category: productCategory,
    });

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
          onChangeManageInventory={setManageInventory}
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
