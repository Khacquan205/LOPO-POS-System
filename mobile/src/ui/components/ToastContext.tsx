import React, { createContext, useContext, useState, useCallback } from "react";
import { SuccessToast } from "./SuccessToast";

// ============================================================================
// TYPES
// ============================================================================

interface ToastContextType {
  showSuccessToast: (message: string) => void;
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
  const [toastMessage, setToastMessage] = useState("");

  const showSuccessToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  }, []);

  const hideToast = useCallback(() => {
    setToastVisible(false);
  }, []);

  return (
    <ToastContext.Provider
      value={{ showSuccessToast, hideToast, toastVisible, toastMessage }}
    >
      {children}
      <SuccessToast
        visible={toastVisible}
        message={toastMessage}
        onHide={hideToast}
      />
    </ToastContext.Provider>
  );
};

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
