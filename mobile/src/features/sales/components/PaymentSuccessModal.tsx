import React from 'react';
import { CommonAlertModal } from '../../../common/shared/components/CommonAlertModal';

interface Props {
  visible: boolean;
  orderCode: string;
  formattedTotal: string;
  onOk: () => void;
  title?: string;
  message?: string;
}

export const PaymentSuccessModal: React.FC<Props> = ({
  visible,
  orderCode,
  formattedTotal,
  onOk,
  title,
  message,
}) => (
  <CommonAlertModal
    visible={visible}
    variant="success"
    title="Thanh toán thành công!"
    message={`Đã thanh toán thành công ${formattedTotal} cho đơn hàng ${orderCode}`}
    confirmText="OK"
    onConfirm={onOk}
  />
);
