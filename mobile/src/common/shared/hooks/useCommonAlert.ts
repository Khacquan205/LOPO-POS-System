import { useCallback, useRef, useState } from 'react';
import type { CommonAlertModalProps } from '../components/CommonAlertModal';

type AlertState = Omit<CommonAlertModalProps, 'onConfirm' | 'onCancel'>;

type CommonAlertOptions = Omit<CommonAlertModalProps, 'visible' | 'onConfirm' | 'onCancel'> & {
  title: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const defaultState: AlertState = {
  visible: false,
  variant: 'success',
  title: '',
  message: '',
  confirmText: 'OK',
  cancelText: 'CANCEL',
  showCancel: false,
  iconName: undefined,
  loading: false,
};

export const useCommonAlert = () => {
  const [state, setState] = useState<AlertState>(defaultState);
  const confirmRef = useRef<(() => void) | undefined>(undefined);
  const cancelRef = useRef<(() => void) | undefined>(undefined);

  const showAlert = useCallback((options: CommonAlertOptions) => {
    confirmRef.current = options.onConfirm;
    cancelRef.current = options.onCancel;
    setState({
      ...defaultState,
      ...options,
      visible: true,
    });
  }, []);

  const hideAlert = useCallback(() => {
    setState((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleConfirm = useCallback(() => {
    const callback = confirmRef.current;
    hideAlert();
    if (callback) callback();
  }, [hideAlert]);

  const handleCancel = useCallback(() => {
    const callback = cancelRef.current;
    hideAlert();
    if (callback) callback();
  }, [hideAlert]);

  const alertProps: CommonAlertModalProps = {
    ...state,
    onConfirm: handleConfirm,
    onCancel: handleCancel,
  };

  return { alertProps, showAlert, hideAlert };
};
