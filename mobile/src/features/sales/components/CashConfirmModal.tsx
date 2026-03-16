import React from 'react';
import { CommonAlertModal } from '../../../common/shared/components/CommonAlertModal';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const CashConfirmModal: React.FC<Props> = ({ visible, onCancel, onConfirm }) => (
  <CommonAlertModal
    visible={visible}
    variant="warning"
    title="Xác nhận nhận tiền mặt!"
    message="Bạn có chắc chắn rằng đã nhận đủ tiền mặt của khách hàng không?"
    confirmText="OK"
    cancelText="CANCEL"
    showCancel
    onConfirm={onConfirm}
    onCancel={onCancel}
    iconName="cash-outline"
  />
);
