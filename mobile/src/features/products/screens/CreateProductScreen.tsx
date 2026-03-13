import React, { useState, useEffect } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ImagePickerHeader } from "../components/createProduct/ImagePickerHeader";
import { ProductForm } from "../components/createProduct/ProductForm";
import { FooterActions } from "../components/createProduct/FooterActions";
import {
  CategoryPickerBottomSheet,
  type PickerCategory,
} from "../components/CategoryPickerBottomSheet";
import { AddCategoryBottomSheet } from "../components/AddCategoryBottomSheet";
import { useToast } from "../../../ui/components";
import { useProductsStore } from "../store/products.store";
import { useAuthStore } from "../../../store/auth.store";
import { useCategoriesStore } from "../store/categories.store";
import { ApiError } from "../../../lib/api/client";

// ============================================================================
// MAIN SCREEN COMPONENT
// ============================================================================

export const CreateProductScreen: React.FC = () => {
  const navigation = useNavigation();
  const { showSuccessToast } = useToast();
  const createProduct = useProductsStore((state) => state.createProduct);
  const accessToken = useAuthStore((state) => state.accessToken);
  const categories = useCategoriesStore((state) => state.categories);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);
  const createCategory = useCategoriesStore((state) => state.createCategory);
  const [categoryList, setCategoryList] = useState<PickerCategory[]>([]);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [barcode, setBarcode] = useState("");
  const [manageInventory, setManageInventory] = useState(true);
  const [inventory, setInventory] = useState("");
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    void fetchCategories(accessToken);
  }, [accessToken, fetchCategories]);

  useEffect(() => {
    setCategoryList(
      categories.map((item) => ({
        id: item.id,
        name: item.name,
        color: item.color,
      })),
    );
  }, [categories]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSelectImage = () => {
    console.log("Select image pressed");
  };

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

  const handleScanBarcode = () => {
    console.log("Scan barcode pressed");
  };

  const handleChangeManageInventory = (value: boolean) => {
    setManageInventory(value);
    if (!value) {
      setInventory("0");
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleCreate = async () => {
    if (!accessToken) return;
    const trimmedName = productName.trim();
    const parsedPrice = Number(productPrice.replace(/[^0-9]/g, ""));
    const normalizedPrice = Number.isFinite(parsedPrice) ? parsedPrice : 0;
    const onHand = Number(inventory.replace(/[^0-9]/g, ""));
    const normalizedOnHand = Number.isFinite(onHand) ? onHand : 0;

    if (!trimmedName) {
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
      await createProduct(
        accessToken,
        {
          name: trimmedName,
          price: normalizedPrice,
          category_id: selectedCategoryId,
          barcode: barcode.trim() || undefined,
          image_url: undefined,
          track_inventory: manageInventory,
          on_hand: manageInventory ? normalizedOnHand : 0,
          is_active: true,
        },
        categoryLookup,
      );

      showSuccessToast("Tạo mới thành công!");
      navigation.goBack();
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert("Không thể tạo sản phẩm", error.getFieldErrors());
        return;
      }
      console.warn("Create product failed:", error);
      Alert.alert(
        "Không thể tạo sản phẩm",
        "Đã có lỗi xảy ra. Vui lòng thử lại.",
      );
    }
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
          onChangeManageInventory={handleChangeManageInventory}
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
