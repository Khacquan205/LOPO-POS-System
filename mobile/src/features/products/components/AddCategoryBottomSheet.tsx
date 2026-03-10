import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  ScrollView,
  AccessibilityInfo,
} from "react-native";
import { colors, spacing, typography, radius, shadow } from "../../../ui/theme";

// ============================================================================
// TYPES
// ============================================================================

interface AddCategoryBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (categoryName: string, selectedColor: string) => void;
}

interface ColorOption {
  id: string;
  label: string;
  hex: string;
}

// ============================================================================
// COLOR PALETTE (10 COLORS AS SPECIFIED)
// ============================================================================

const COLOR_OPTIONS: ColorOption[] = [
  { id: "orange", label: "Cam vàng", hex: "#EFA442" }, // cam vàng
  { id: "coral", label: "Đỏ coral", hex: "#FF6B6B" }, // đỏ coral
  { id: "blue-light", label: "Xanh dương nhạt", hex: "#87CEEB" }, // xanh dương nhạt
  { id: "purple", label: "Tím", hex: "#9B59B6" }, // tím
  { id: "yellow", label: "Vàng", hex: "#F1C40F" }, // vàng
  { id: "brown", label: "Nâu", hex: "#A0522D" }, // nâu
  { id: "black", label: "Đen", hex: "#000000" }, // đen
  { id: "gray", label: "Xám", hex: "#808080" }, // xám
  { id: "pink-dark", label: "Hồng đỏ đậm", hex: "#E91E63" }, // hồng/đỏ đậm
  { id: "green", label: "Xanh lá", hex: "#4CAF50" }, // xanh lá
];

// ============================================================================
// COLOR SWATCH COMPONENT
// ============================================================================

const ColorSwatch: React.FC<{
  hex: string;
  selected: boolean;
  onPress: () => void;
}> = ({ hex, selected, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.colorSwatch,
        { backgroundColor: hex },
        selected && styles.colorSwatchSelected,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      accessible={true}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    />
  );
};

// ============================================================================
// COLOR PICKER SECTION
// ============================================================================

const ColorPickerSection: React.FC<{
  selectedColor: string;
  onSelectColor: (colorHex: string) => void;
}> = ({ selectedColor, onSelectColor }) => {
  return (
    <View style={styles.colorPickerSection}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Màu loại</Text>
        <Text style={styles.required}>*</Text>
      </View>
      <View style={styles.colorSwatchContainer}>
        {COLOR_OPTIONS.map((color) => (
          <ColorSwatch
            key={color.id}
            hex={color.hex}
            selected={selectedColor === color.hex}
            onPress={() => onSelectColor(color.hex)}
          />
        ))}
      </View>
    </View>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const AddCategoryBottomSheet: React.FC<AddCategoryBottomSheetProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [categoryName, setCategoryName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].hex);

  const handleSubmit = () => {
    if (categoryName.trim()) {
      onSubmit?.(categoryName, selectedColor);
      // Reset state
      setCategoryName("");
      setSelectedColor(COLOR_OPTIONS[0].hex);
      onClose();
    }
  };

  const handleClose = () => {
    // Reset state
    setCategoryName("");
    setSelectedColor(COLOR_OPTIONS[0].hex);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      {/* OVERLAY */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}
      />

      {/* BOTTOM SHEET CONTAINER */}
      <View style={styles.bottomSheetContainer}>
        <View style={styles.bottomSheet}>
          {/* TITLE */}
          <Text style={styles.title}>THÊM LOẠI SẢN PHẨM</Text>

          {/* NAME INPUT SECTION */}
          <View style={styles.inputSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Tên loại</Text>
              <Text style={styles.required}>*</Text>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Ví dụ: Đồ dùng"
              placeholderTextColor={colors.textSecondary}
              value={categoryName}
              onChangeText={setCategoryName}
              returnKeyType="next"
              accessible={true}
              accessibilityLabel="Tên loại sản phẩm"
              accessibilityHint="Nhập tên cho loại sản phẩm mới"
            />
          </View>

          {/* COLOR PICKER SECTION */}
          <ColorPickerSection
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
          />

          {/* SUBMIT BUTTON */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={!categoryName.trim()}
            activeOpacity={0.8}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Hoàn tất"
            accessibilityHint="Lưu loại sản phẩm mới"
          >
            <Text style={styles.submitButtonText}>Hoàn tất</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const { height: screenHeight } = Dimensions.get("window");

const styles = StyleSheet.create({
  // OVERLAY
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Dark overlay with opacity ~0.4
  },

  // BOTTOM SHEET CONTAINER
  bottomSheetContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "flex-end",
  },

  bottomSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xxl, // 24
    borderTopRightRadius: radius.xxl, // 24
    paddingHorizontal: spacing.md, // 16
    paddingTop: spacing.md + spacing.sm, // 18-22 (16 + 8 = 24, but let's use 20 which is approximately)
    paddingBottom: spacing.md + spacing.sm, // 16-20
    ...shadow.lg,
  },

  // TITLE
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.primary,
    textTransform: "uppercase",
    marginBottom: spacing.lg, // 24
    letterSpacing: 0.5,
  },

  // INPUT SECTION
  inputSection: {
    marginBottom: spacing.lg, // 24
  },

  // LABEL CONTAINER
  labelContainer: {
    flexDirection: "row",
    marginBottom: spacing.sm, // 8
    alignItems: "center",
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
  },

  required: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.error, // Red
    marginLeft: spacing.xs, // 4
  },

  // TEXT INPUT
  textInput: {
    backgroundColor: colors.surfaceSecondary, // Very light gray (#F5F5F5)
    borderWidth: 1,
    borderColor: colors.border, // Light border
    borderRadius: radius.input, // 8
    paddingHorizontal: spacing.md, // 16
    paddingVertical: spacing.sm + spacing.xs, // ~12
    height: 48,
    fontSize: 16,
    fontWeight: "400",
    color: colors.textPrimary,
  },

  // COLOR PICKER SECTION
  colorPickerSection: {
    marginBottom: spacing.lg, // 24
  },

  colorSwatchContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: spacing.md, // 16 gap between colors
  },

  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    borderWidth: 0,
  },

  colorSwatchSelected: {
    borderWidth: 3,
    borderColor: colors.primary,
    opacity: 1,
  },

  // SUBMIT BUTTON
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md, // 16
    paddingHorizontal: spacing.md,
    borderRadius: radius.button, // 8
    marginTop: spacing.md, // 16
    marginBottom: 0,
    minHeight: 52,
    justifyContent: "center",
    alignItems: "center",
  },

  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
    textTransform: "capitalize",
  },
});
