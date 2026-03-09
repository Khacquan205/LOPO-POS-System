import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "../../../../ui/theme";

interface ImagePickerHeaderProps {
  onBackPress?: () => void;
  onSelectImagePress?: () => void;
  imageUri?: string;
}

export const ImagePickerHeader: React.FC<ImagePickerHeaderProps> = ({
  onBackPress,
  onSelectImagePress,
  imageUri,
}) => {
  return (
    <View style={styles.imageContainer}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : null}

      {/* Back Button */}
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Ionicons name="chevron-back" size={20} color={colors.primary} />
      </TouchableOpacity>

      {/* Select Image Button */}
      <TouchableOpacity
        onPress={onSelectImagePress}
        style={styles.selectImageButton}
      >
        <Text style={styles.selectImageText}>Chọn ảnh</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    height: 290,
    backgroundColor: "#EEEEEE",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: spacing.xxl,
    left: spacing.md,
    width: 40,
    height: 40,
    backgroundColor: colors.white,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  selectImageButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: 20,
  },
  selectImageText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
  },
});
