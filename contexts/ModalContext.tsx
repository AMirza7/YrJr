import React, { createContext, useContext, useState, ReactNode } from "react";
import PremiumModal from "@/components/ui/PremiumModal";

interface ModalAction {
  text: string;
  onPress: () => void;
  style?: "default" | "destructive" | "cancel" | "primary";
  disabled?: boolean;
}

interface ModalConfig {
  title?: string;
  message?: string;
  icon?: string;
  actions?: ModalAction[];
  children?: ReactNode;
  type?: "alert" | "confirm" | "custom";
  dismissible?: boolean;
  size?: "small" | "medium" | "large";
}

interface ModalContextType {
  showModal: (config: ModalConfig) => void;
  hideModal: () => void;
  showAlert: (
    title: string,
    message: string,
    onConfirm?: () => void,
    icon?: string,
  ) => void;
  showConfirm: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    options?: {
      confirmText?: string;
      cancelText?: string;
      destructive?: boolean;
      icon?: string;
    },
  ) => void;
  showSuccess: (title: string, message: string, onConfirm?: () => void) => void;
  showError: (title: string, message: string, onConfirm?: () => void) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [visible, setVisible] = useState(false);

  const showModal = (config: ModalConfig) => {
    setModalConfig(config);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setTimeout(() => setModalConfig(null), 300); // Wait for animation to complete
  };

  const showAlert = (
    title: string,
    message: string,
    onConfirm?: () => void,
    icon?: string,
  ) => {
    showModal({
      title,
      message,
      icon: icon || "ℹ️",
      actions: [
        {
          text: "OK",
          onPress: () => {
            hideModal();
            onConfirm?.();
          },
          style: "primary",
        },
      ],
      type: "alert",
    });
  };

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    options?: {
      confirmText?: string;
      cancelText?: string;
      destructive?: boolean;
      icon?: string;
    },
  ) => {
    showModal({
      title,
      message,
      icon: options?.icon || "❓",
      actions: [
        {
          text: options?.cancelText || "Cancel",
          onPress: () => {
            hideModal();
            onCancel?.();
          },
          style: "cancel",
        },
        {
          text: options?.confirmText || "Confirm",
          onPress: () => {
            hideModal();
            onConfirm();
          },
          style: options?.destructive ? "destructive" : "primary",
        },
      ],
      type: "confirm",
    });
  };

  const showSuccess = (
    title: string,
    message: string,
    onConfirm?: () => void,
  ) => {
    showAlert(title, message, onConfirm, "✅");
  };

  const showError = (
    title: string,
    message: string,
    onConfirm?: () => void,
  ) => {
    showAlert(title, message, onConfirm, "❌");
  };

  const value: ModalContextType = {
    showModal,
    hideModal,
    showAlert,
    showConfirm,
    showSuccess,
    showError,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {modalConfig && (
        <PremiumModal
          visible={visible}
          onClose={hideModal}
          title={modalConfig.title}
          message={modalConfig.message}
          icon={modalConfig.icon}
          actions={modalConfig.actions}
          type={modalConfig.type}
          dismissible={modalConfig.dismissible}
          size={modalConfig.size}
        >
          {modalConfig.children}
        </PremiumModal>
      )}
    </ModalContext.Provider>
  );
};
