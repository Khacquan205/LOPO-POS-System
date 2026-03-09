import React, { useState } from "react";
import { ScrollView, SafeAreaView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ImagePickerHeader } from "../components/createProduct/ImagePickerHeader";
import { ProductForm } from "../components/createProduct/ProductForm";
import { FooterActions } from "../components/createProduct/FooterActions";
import { CategoryPickerBottomSheet } from "../components/CategoryPickerBottomSheet";
import { AddCategoryBottomSheet } from "../components/AddCategoryBottomSheet";
import { useToast } from "../../../ui/components";
import { Category } from "../mock/productManagement.mock";
import { useProductsStore } from "../store/products.store";

// ============================================================================
// MAIN SCREEN COMPONENT
// ============================================================================

export const CreateProductScreen: React.FC = () => {
  const navigation = useNavigation();
  const { showSuccessToast } = useToast();
  const addProduct = useProductsStore((state) => state.addProduct);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [barcode, setBarcode] = useState("");
  const [manageInventory, setManageInventory] = useState(true);
  const [inventory, setInventory] = useState("");
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSelectImage = () => {
    console.log("Select image pressed");
  };

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

  const handleScanBarcode = () => {
    console.log("Scan barcode pressed");
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleCreate = () => {
    const parsedPrice = Number(productPrice.replace(/[^0-9]/g, ""));

    addProduct({
      name: productName,
      price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
      category: productCategory,
    });

    console.log("Create product pressed", {
      productName,
      productPrice,
      productCategory,
      barcode,
      manageInventory,
      inventory,
    });

    // Show success toast and navigate back
    showSuccessToast("Tạo mới thành công!");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Picker Header */}
        <ImagePickerHeader
          onBackPress={handleBackPress}
          onSelectImagePress={handleSelectImage}
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
          onPressScanBarcode={handleScanBarcode}
          manageInventory={manageInventory}
          onChangeManageInventory={setManageInventory}
          inventory={inventory}
          onChangeInventory={setInventory}
        />

        {/* Footer Actions */}
        <FooterActions
          onCancelPress={handleCancel}
          onPrimaryPress={handleCreate}
          primaryLabel="Tạo mới"
        />
      </ScrollView>

      {/* Category Picker Bottom Sheet */}
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

// ============================================================================
// STYLES
// ============================================================================

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
