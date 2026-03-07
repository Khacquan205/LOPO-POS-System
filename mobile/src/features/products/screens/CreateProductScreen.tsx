import React, { useState } from "react";
import { View, ScrollView, SafeAreaView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ImagePickerHeader } from "../components/createProduct/ImagePickerHeader";
import { FormField } from "../components/createProduct/FormField";
import { SelectField } from "../components/createProduct/SelectField";
import { BarcodeField } from "../components/createProduct/BarcodeField";
import { InventoryCheckbox } from "../components/createProduct/InventoryCheckbox";
import { FooterActions } from "../components/createProduct/FooterActions";
import { CategoryPickerBottomSheet } from "../components/CategoryPickerBottomSheet";
import { useToast } from "../../../ui/components";
import { colors, spacing } from "../../../ui/theme";
import { categoriesMock, Category } from "../mock/productManagement.mock";

// ============================================================================
// MAIN SCREEN COMPONENT
// ============================================================================

export const CreateProductScreen: React.FC = () => {
  const navigation = useNavigation();
  const { showSuccessToast } = useToast();
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [barcode, setBarcode] = useState("");
  const [manageInventory, setManageInventory] = useState(true);
  const [inventory, setInventory] = useState("");
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

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
    console.log("Add new category pressed");
  };

  const handleScanBarcode = () => {
    console.log("Scan barcode pressed");
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleCreate = () => {
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

        {/* Form Section */}
        <View style={styles.formContainer}>
          {/* Product Name */}
          <FormField
            label="Tên sản phẩm"
            placeholder="Ví dụ: Bánh mì"
            value={productName}
            onChangeText={setProductName}
            required
          />

          {/* Product Price */}
          <FormField
            label="Giá sản phẩm"
            placeholder="Ví dụ: 4,000"
            value={productPrice}
            onChangeText={setProductPrice}
            keyboardType="decimal-pad"
            required
          />

          {/* Product Category */}
          <SelectField
            label="Loại sản phẩm"
            placeholder="Ví dụ: Bánh kẹo"
            value={productCategory}
            onPress={handleSelectCategory}
            required
          />

          {/* Barcode */}
          <BarcodeField
            label="Barcode"
            placeholder="Ví dụ: 12345678"
            value={barcode}
            onChangeText={setBarcode}
            onScanPress={handleScanBarcode}
            required
          />

          {/* Manage Inventory Checkbox */}
          <InventoryCheckbox
            value={manageInventory}
            onValueChange={setManageInventory}
            label="Quản lý tồn kho"
          />

          {/* Inventory */}
          {manageInventory && (
            <FormField
              label="Tồn kho"
              placeholder="Ví dụ: 67"
              value={inventory}
              onChangeText={setInventory}
              keyboardType="number-pad"
            />
          )}
        </View>

        {/* Footer Actions */}
        <FooterActions
          onCancelPress={handleCancel}
          onCreatePress={handleCreate}
        />
      </ScrollView>

      {/* Category Picker Bottom Sheet */}
      <CategoryPickerBottomSheet
        visible={showCategoryPicker}
        onClose={() => setShowCategoryPicker(false)}
        onSelectCategory={handleCategorySelected}
        onAddNewCategory={handleAddNewCategory}
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
  formContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
