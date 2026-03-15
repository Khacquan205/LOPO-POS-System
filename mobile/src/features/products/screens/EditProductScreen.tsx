import React, { useMemo, useState, useEffect, useRef } from "react";
import { Alert, Modal, View, ScrollView, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { CommonActions } from "@react-navigation/native";
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
import { uploadImageToCloudinary } from "../../../lib/cloudinary";
import { Camera, CameraView } from "expo-camera";
import { ApiError } from "../../../lib/api/client";
import { useToast } from "../../../ui/components";

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
  const { showSuccessToast } = useToast();
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
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    editingProduct?.image,
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isScanningBarcode, setIsScanningBarcode] = useState(false);

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
      // Sau khi tạo thành công, mở lại bottom sheet chọn loại để thấy category mới
      setShowCategoryPicker(true);
    } catch (error) {
      console.warn("Create category failed:", error);
    }
    setShowAddCategory(false);
  };

  const handleScanBarcodePress = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Không có quyền dùng camera",
          "Ứng dụng cần quyền truy cập camera để quét barcode.",
        );
        return;
      }
      setIsScanningBarcode(true);
    } catch (error) {
      console.warn("Request camera permission for barcode failed:", error);
      Alert.alert(
        "Không thể dùng camera",
        "Đã có lỗi xảy ra khi xin quyền camera. Vui lòng thử lại.",
      );
    }
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!data) return;
    setIsScanningBarcode(false);
    setBarcode(data);
  };

  const pickImageFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Không có quyền truy cập ảnh",
        "Ứng dụng cần quyền truy cập thư viện ảnh để chọn ảnh sản phẩm.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return;
    }

    const localUri = result.assets[0]?.uri;
    if (!localUri) return;

    setImageUrl(localUri);
    setIsUploadingImage(true);

    try {
      const uploadedUrl = await uploadImageToCloudinary(localUri);
      setImageUrl(uploadedUrl);
    } catch (error) {
      console.warn("Upload image failed:", error);
      Alert.alert(
        "Không thể upload ảnh",
        "Đã có lỗi xảy ra khi upload ảnh lên Cloudinary. Vui lòng thử lại.",
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

  const captureImageWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Không có quyền dùng camera",
        "Ứng dụng cần quyền truy cập camera để chụp ảnh sản phẩm.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return;
    }

    const localUri = result.assets[0]?.uri;
    if (!localUri) return;

    setImageUrl(localUri);
    setIsUploadingImage(true);

    try {
      const uploadedUrl = await uploadImageToCloudinary(localUri);
      setImageUrl(uploadedUrl);
    } catch (error) {
      console.warn("Upload image failed:", error);
      Alert.alert(
        "Không thể upload ảnh",
        "Đã có lỗi xảy ra khi upload ảnh lên Cloudinary. Vui lòng thử lại.",
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSelectImage = () => {
    Alert.alert(
      "Chọn ảnh sản phẩm",
      "Bạn muốn lấy ảnh từ đâu?",
      [
        {
          text: "Chụp ảnh",
          onPress: () => {
            void captureImageWithCamera();
          },
        },
        {
          text: "Chọn từ thư viện",
          onPress: () => {
            void pickImageFromLibrary();
          },
        },
        {
          text: "Hủy",
          style: "cancel",
        },
      ],
      { cancelable: true },
    );
  };

  const handleSave = async () => {
    if (!accessToken) return;
    const parsedPrice = Number(productPrice.replace(/[^0-9]/g, ""));
    const normalizedPrice = Number.isFinite(parsedPrice) ? parsedPrice : 0;
    const onHand = Number(inventory.replace(/[^0-9]/g, ""));
    const normalizedOnHand = Number.isFinite(onHand) ? onHand : 0;
    const normalizedBarcode = barcode.trim();

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

    if (normalizedBarcode) {
      const duplicate = products.find(
        (p) =>
          p.id !== route.params.productId &&
          p.barcode != null &&
          p.barcode === normalizedBarcode,
      );
      if (duplicate) {
        Alert.alert(
          "Mã vạch đã tồn tại",
          "Mã vạch này đã được sử dụng cho một sản phẩm khác. Vui lòng nhập hoặc quét mã vạch khác.",
        );
        return;
      }
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
          barcode: normalizedBarcode || undefined,
          image_url: imageUrl,
          track_inventory: manageInventory,
          on_hand: manageInventory ? normalizedOnHand : 0,
        },
        categoryLookup,
      );
    } catch (error) {
      if (error instanceof ApiError) {
        const rawMessage = error.getFieldErrors();
        const lower = rawMessage.toLowerCase();
        const isBarcodeError =
          lower.includes("barcode") || lower.includes("mã vạch");

        Alert.alert(
          "Không thể lưu sản phẩm",
          isBarcodeError
            ? "Mã vạch này đã được sử dụng cho một sản phẩm khác. Vui lòng nhập hoặc quét mã vạch khác."
            : rawMessage || "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.",
        );
        return;
      }
      console.warn("Update product failed:", error);
      Alert.alert(
        "Không thể lưu sản phẩm",
        "Đã có lỗi xảy ra. Vui lòng thử lại.",
      );
      return;
    }

    showSuccessToast("Cập nhật sản phẩm thành công!");
    navigation.navigate("Products");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <ImagePickerHeader
          imageUri={imageUrl}
          onBackPress={() => navigation.goBack()}
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
          onPressScanBarcode={handleScanBarcodePress}
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

      <Modal
        visible={isScanningBarcode}
        animationType="slide"
        onRequestClose={() => setIsScanningBarcode(false)}
      >
        <View style={{ flex: 1, backgroundColor: "black" }}>
          <CameraView
            style={{ flex: 1 }}
            barcodeScannerSettings={{
              barcodeTypes: ["ean13", "ean8", "upc_e", "upc_a", "code128", "qr"],
            }}
            onBarcodeScanned={({ data }) => handleBarCodeScanned({ data })}
          />
        </View>
      </Modal>
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
