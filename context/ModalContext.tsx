import { createContext, useState, ReactNode } from 'react';

interface ModalContextData {
  isClaimModalOpen: boolean;
  handleOpenClaimModal(): void;
  handleCloseClaimModal(): void;
  isClaimSuccessModalOpen: boolean;
  handleOpenClaimSuccessModal(): void;
  handleCloseClaimSuccessModal(): void;
}
interface ModalProviderProps {
  children: ReactNode;
}

export const ModalContext = createContext({} as ModalContextData);

export function ModalProvider({ children }: ModalProviderProps) {
  const [isClaimModalOpen, setisClaimModalOpen] = useState(false);
  const [isClaimSuccessModalOpen, setisClaimSuccessModalOpen] = useState(false);

  function handleOpenClaimModal() {
    setisClaimModalOpen(true);
  }

  function handleCloseClaimModal() {
    setisClaimModalOpen(false);
  }

  function handleOpenClaimSuccessModal() {
    setisClaimSuccessModalOpen(true);
  }

  function handleCloseClaimSuccessModal() {
    setisClaimSuccessModalOpen(false);
  }

  return (
    <ModalContext.Provider
      value={{
        isClaimModalOpen,
        handleOpenClaimModal,
        handleCloseClaimModal,
        isClaimSuccessModalOpen,
        handleOpenClaimSuccessModal,
        handleCloseClaimSuccessModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}
