import React from "react";
import { View, StyleSheet } from "react-native";
import { FormField } from "./FormField";
import { SelectField } from "./SelectField";
import { BarcodeField } from "./BarcodeField";
import { InventoryCheckbox } from "./InventoryCheckbox";
import { spacing } from "../../../../ui/theme";

interface ProductFormProps {
  productName: string;
  onChangeProductName: (value: string) => void;
  productPrice: string;
  onChangeProductPrice: (value: string) => void;
  productCategory: string;
  onPressSelectCategory: () => void;
  barcode: string;
  onChangeBarcode: (value: string) => void;
  onPressScanBarcode: () => void;
  manageInventory: boolean;
  onChangeManageInventory: (value: boolean) => void;
  inventory: string;
  onChangeInventory: (value: string) => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  productName,
  onChangeProductName,
  productPrice,
  onChangeProductPrice,
  productCategory,
  onPressSelectCategory,
  barcode,
  onChangeBarcode,
  onPressScanBarcode,
  manageInventory,
  onChangeManageInventory,
  inventory,
  onChangeInventory,
}) => {
  return (
    <View style={styles.formContainer}>
      <FormField
        label="Tên sản phẩm"
        placeholder="Ví dụ: Bánh mì"
        value={productName}
        onChangeText={onChangeProductName}
        required
      />

      <FormField
        label="Giá sản phẩm"
        placeholder="Ví dụ: 4,000"
        value={productPrice}
        onChangeText={onChangeProductPrice}
        keyboardType="decimal-pad"
        required
      />

      <SelectField
        label="Loại sản phẩm"
        placeholder="Ví dụ: Bánh kẹo"
        value={productCategory}
        onPress={onPressSelectCategory}
        required
      />

      <BarcodeField
        label="Barcode"
        placeholder="Ví dụ: 12345678"
        value={barcode}
        onChangeText={onChangeBarcode}
        onScanPress={onPressScanBarcode}
        required
      />

      <InventoryCheckbox
        value={manageInventory}
        onValueChange={onChangeManageInventory}
        label="Quản lý tồn kho"
      />

      {manageInventory && (
        <FormField
          label="Tồn kho"
          placeholder="Ví dụ: 67"
          value={inventory}
          onChangeText={onChangeInventory}
          keyboardType="number-pad"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
