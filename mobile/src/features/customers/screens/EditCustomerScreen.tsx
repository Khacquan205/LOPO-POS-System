import React, { useMemo, useState } from "react";
import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
} from "react-native";
import type { MainStackScreenProps } from "../../../types/navigation";
import { CreateCustomerHeader } from "../components/CreateCustomerHeader";
import { CustomerFormFields } from "../components/CustomerFormFields";
import { StatusBottomSheet } from "../components/StatusBottomSheet";
import { FooterActions } from "../../products/components/createProduct/FooterActions";
import { useCustomersStore } from "../store/customers.store";
import type { Customer, CustomerStatus } from "../mock/customers.mock";
import { useToast } from "../../../ui/components";

type Props = MainStackScreenProps<"EditCustomer">;

export const EditCustomerScreen: React.FC<Props> = ({ navigation, route }) => {
  const customers = useCustomersStore((state) => state.customers);
  const updateCustomer = useCustomersStore((state) => state.updateCustomer);
  const { showSuccessToast } = useToast();

  const customer = useMemo(() => {
    const found = customers.find((item) => item.id === route.params.customerId);

    const fallbackCustomer: Customer = {
      id: route.params.customerId,
      code: "CUS00000035",
      name: "Nguyễn Văn Thành",
      phone: "0365416503",
      status: "Đang hoạt động",
    };

    return found ?? fallbackCustomer;
  }, [customers, route.params.customerId]);

  const [customerName, setCustomerName] = useState(customer.name);
  const [customerPhone, setCustomerPhone] = useState(customer.phone);
  const [customerStatus, setCustomerStatus] = useState<CustomerStatus>(
    customer.status,
  );
  const [isStatusSheetVisible, setIsStatusSheetVisible] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const handleStatusPress = () => {
    setIsStatusSheetVisible(true);
  };

  const handleSelectStatus = (status: CustomerStatus) => {
    setCustomerStatus(status);
  };

  const handlePhoneChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, "");
    const limitedText = numericText.slice(0, 10);

    setCustomerPhone(limitedText);

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

  const handleSave = () => {
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

    updateCustomer({
      id: customer.id,
      name: customerName.trim(),
      phone: customerPhone,
      status: customerStatus,
    });

    console.log("Save customer pressed", {
      id: customer.id,
      code: customer.code,
      customerName,
      customerPhone,
      customerStatus,
    });

    showSuccessToast("Lưu khách hàng thành công!");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      >
        <CreateCustomerHeader
          onBackPress={() => navigation.goBack()}
          customerCode={customer.code}
        />

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

      <View style={styles.footerContainer}>
        <FooterActions
          onCancelPress={handleCancel}
          onPrimaryPress={handleSave}
          primaryLabel="Lưu"
        />
      </View>

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
