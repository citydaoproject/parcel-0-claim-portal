import { createContext, useState, ReactNode } from 'react';

//TODO trkaplan refactor this
interface ModalContextData {
  isClaimModalOpen: boolean;
  handleOpenClaimModal(): void;
  handleCloseClaimModal(): void;
  isClaimSuccessModalOpen: boolean;
  handleOpenClaimSuccessModal(): void;
  handleCloseClaimSuccessModal(): void;
  isNotEligibleModalOpen: boolean;
  handleOpenNotEligibleModal(): void;
  handleCloseNotEligibleModal(): void;
}
interface ModalProviderProps {
  children: ReactNode;
}

export const ModalContext = createContext({} as ModalContextData);

export function ModalProvider({ children }: ModalProviderProps) {
  const [isClaimModalOpen, setisClaimModalOpen] = useState(false);
  const [isClaimSuccessModalOpen, setisClaimSuccessModalOpen] = useState(false);
  const [isNotEligibleModalOpen, setisNotEligibleModalOpen] = useState(false);

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

  function handleOpenNotEligibleModal() {
    setisNotEligibleModalOpen(true);
  }

  function handleCloseNotEligibleModal() {
    setisNotEligibleModalOpen(false);
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
        handleOpenNotEligibleModal,
        handleCloseNotEligibleModal,
        isNotEligibleModalOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}
