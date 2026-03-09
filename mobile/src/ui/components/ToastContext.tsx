import React, { createContext, useContext, useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { SuccessToast } from "./SuccessToast";

// ============================================================================
// TYPES
// ============================================================================

interface ToastContextType {
  showSuccessToast: (message: string) => void;
  showErrorToast: (message: string) => void;
  showWarningToast: (message: string) => void;
  hideToast: () => void;
  toastVisible: boolean;
  toastMessage: string;
}

interface ToastProviderProps {
  children: React.ReactNode;
}

// ============================================================================
// CONTEXT
// ============================================================================

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'error' | 'warning'>('success');

  const showSuccessToast = useCallback((message: string) => {
    setToastVariant('success');
    setToastMessage(message);
    setToastVisible(true);
  }, []);

  const showErrorToast = useCallback((message: string) => {
    setToastVariant('error');
    setToastMessage(message);
    setToastVisible(true);
  }, []);

  const showWarningToast = useCallback((message: string) => {
    setToastVariant('warning');
    setToastMessage(message);
    setToastVisible(true);
  }, []);

  const hideToast = useCallback(() => {
    setToastVisible(false);
  }, []);

  return (
    <ToastContext.Provider
      value={{ showSuccessToast, showErrorToast, showWarningToast, hideToast, toastVisible, toastMessage }}
    >
      {children}
      <View style={styles.toastWrapper} pointerEvents="none">
        <SuccessToast
          visible={toastVisible}
          message={toastMessage}
          duration={3000}
          onHide={hideToast}
          variant={toastVariant}
        />
      </View>
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
});

// ============================================================================
// HOOK
// ============================================================================

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
