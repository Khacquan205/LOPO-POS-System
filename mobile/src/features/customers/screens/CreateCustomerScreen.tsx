import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { MainStackScreenProps } from "../../../types/navigation";
import { CreateCustomerHeader } from "../components/CreateCustomerHeader";
import { CustomerFormFields } from "../components/CustomerFormFields";
import { StatusBottomSheet } from "../components/StatusBottomSheet";
import { FooterActions } from "../../products/components/createProduct/FooterActions";
import { useCustomersStore } from "../store/customers.store";
import type { CustomerStatus } from "../mock/customers.mock";
import { useToast } from "../../../ui/components";

type Props = MainStackScreenProps<"CreateCustomer">;

export const CreateCustomerScreen: React.FC<Props> = ({ navigation }) => {
  const addCustomer = useCustomersStore((state) => state.addCustomer);
  const getNextCustomerCode = useCustomersStore(
    (state) => state.getNextCustomerCode,
  );
  const { showSuccessToast } = useToast();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerStatus, setCustomerStatus] =
    useState<CustomerStatus>("Đang hoạt động");
  const [customerCode] = useState(() => getNextCustomerCode());
  const [isStatusSheetVisible, setIsStatusSheetVisible] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleStatusPress = () => {
    setIsStatusSheetVisible(true);
  };

  const handleSelectStatus = (status: CustomerStatus) => {
    setCustomerStatus(status);
  };

  const handlePhoneChange = (text: string) => {
    // Only allow digits
    const numericText = text.replace(/[^0-9]/g, "");

    // Limit to 10 digits
    const limitedText = numericText.slice(0, 10);

    setCustomerPhone(limitedText);

    // Validate
    if (limitedText.length === 0) {
      setPhoneError("");
    } else if (!limitedText.startsWith("0")) {
      setPhoneError("Số điện thoại phải bắt đầu bằng số 0");
    } else if (limitedText.length < 10) {
      setPhoneError("Số điện thoại phải có 10 chữ số");
    } else {
      setPhoneError("");
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleCreate = () => {
    // Validate before creating
    if (!customerName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên nhân viên");
      return;
    }

    if (!customerPhone.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập số điện thoại");
      return;
    }

    if (phoneError) {
      Alert.alert("Lỗi", "Vui lòng nhập số điện thoại hợp lệ");
      return;
    }

    console.log("Create customer pressed", {
      customerCode,
      customerName,
      customerPhone,
      customerStatus,
    });

    addCustomer({
      name: customerName.trim(),
      phone: customerPhone,
      code: customerCode,
      status: customerStatus,
    });

    // Show success toast and navigate back to customer management.
    showSuccessToast("Thêm mới thành công!");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      >
        {/* Header */}
        <CreateCustomerHeader
          onBackPress={handleBackPress}
          customerCode={customerCode}
        />

        {/* Form Fields */}
        <CustomerFormFields
          name={customerName}
          onChangeName={setCustomerName}
          phone={customerPhone}
          onChangePhone={handlePhoneChange}
          phoneError={phoneError}
          status={customerStatus}
          onPressStatus={handleStatusPress}
        />
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footerContainer}>
        <FooterActions
          onCancelPress={handleCancel}
          onPrimaryPress={handleCreate}
          primaryLabel="Tạo mới"
        />
      </View>

      {/* Status Bottom Sheet */}
      <StatusBottomSheet
        visible={isStatusSheetVisible}
        onClose={() => setIsStatusSheetVisible(false)}
        onSelectStatus={handleSelectStatus}
        currentStatus={customerStatus}
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
  footerContainer: {
    backgroundColor: "#F6F6F6",
    paddingTop: 0,
  },
});
