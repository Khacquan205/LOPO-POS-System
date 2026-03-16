import React, { useState, useEffect } from "react";
import {
  Alert,
  Modal,
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { CommonActions, useNavigation } from "@react-navigation/native";
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
import { uploadImageToCloudinary } from "../../../lib/cloudinary";
import { Camera, CameraView } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "../../../ui/theme";

// ============================================================================
// MAIN SCREEN COMPONENT
// ============================================================================

export const CreateProductScreen: React.FC = () => {
  const navigation = useNavigation();
  const createProduct = useProductsStore((state) => state.createProduct);
  const { showSuccessToast } = useToast();
  const products = useProductsStore((state) => state.products);
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
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isScanningBarcode, setIsScanningBarcode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleScanBarcode = async () => {
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

  const handleChangeManageInventory = (value: boolean) => {
    setManageInventory(value);
    if (!value) {
      setInventory("0");
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    navigation.goBack();
  };

  const handleCreate = async () => {
    if (isSubmitting) return;
    if (!accessToken) return;
    const trimmedName = productName.trim();
    const normalizedBarcode = barcode.trim();
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

    if (normalizedBarcode) {
      const duplicate = products.find(
        (p) => p.barcode != null && p.barcode === normalizedBarcode,
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
      setIsSubmitting(true);
      await createProduct(
        accessToken,
        {
          name: trimmedName,
          price: normalizedPrice,
          category_id: selectedCategoryId,
          barcode: normalizedBarcode || undefined,
          image_url: imageUrl,
          track_inventory: manageInventory,
          on_hand: manageInventory ? normalizedOnHand : 0,
          is_active: true,
        },
        categoryLookup,
      );

      showSuccessToast("Tạo mới sản phẩm thành công!");
      navigation.navigate("Products" as never);
    } catch (error) {
      if (error instanceof ApiError) {
        const rawMessage = error.getFieldErrors();
        const lower = rawMessage.toLowerCase();
        const isBarcodeError =
          lower.includes("barcode") || lower.includes("mã vạch");

        Alert.alert(
          "Không thể tạo sản phẩm",
          isBarcodeError
            ? "Mã vạch này đã được sử dụng cho một sản phẩm khác. Vui lòng nhập hoặc quét mã vạch khác."
            : rawMessage || "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.",
        );
        return;
      }
      console.warn("Create product failed:", error);
      Alert.alert(
        "Không thể tạo sản phẩm",
        "Đã có lỗi xảy ra. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
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
          imageUri={imageUrl}
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
        loading={isSubmitting}
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

      {/* Global submitting overlay */}
      {isSubmitting && (
        <View style={styles.submittingOverlay}>
          <View style={styles.submittingCard}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.submittingText}>Đang xử lý...</Text>
          </View>
        </View>
      )}

      <Modal
        visible={isScanningBarcode}
        animationType="slide"
        onRequestClose={() => setIsScanningBarcode(false)}
      >
        <View style={styles.scanContainer}>
          <CameraView
            style={styles.scanCamera}
            barcodeScannerSettings={{
              barcodeTypes: ["ean13", "ean8", "upc_e", "upc_a", "code128", "qr"],
            }}
            onBarcodeScanned={({ data }) => handleBarCodeScanned({ data })}
          />

          <View style={styles.scanOverlay} pointerEvents="none">
            <View style={styles.scanFrame} />
            <Text style={styles.scanHint}>Đưa mã vạch vào khung để quét</Text>
          </View>

          <View style={styles.scanTopBar}>
            <TouchableOpacity
              style={styles.scanBackButton}
              onPress={() => setIsScanningBarcode(false)}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={22} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.scanTopTitle}>Quét mã vạch</Text>
            <View style={styles.scanTopSpacer} />
          </View>
        </View>
      </Modal>
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
  submittingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  submittingCard: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  submittingText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
  },
  scanContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  scanCamera: {
    ...StyleSheet.absoluteFillObject,
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: "75%",
    height: 180,
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  scanHint: {
    marginTop: spacing.lg,
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  scanTopBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scanBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  scanTopTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  scanTopSpacer: {
    width: 40,
  },
});
