import React from "react";
import { DeleteConfirmModal } from "../../../ui/components";

interface DeleteCustomerConfirmModalProps {
  visible: boolean;
  customerName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteCustomerConfirmModal: React.FC<
  DeleteCustomerConfirmModalProps
> = ({ visible, customerName = "khách hàng", onConfirm, onCancel }) => {
  return (
    <DeleteConfirmModal
      visible={visible}
      title="Xác nhận xóa khách hàng!"
      message={`Bạn có chắc muốn xóa ${customerName} không?\nHành động này không thể hoàn tác`}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};
