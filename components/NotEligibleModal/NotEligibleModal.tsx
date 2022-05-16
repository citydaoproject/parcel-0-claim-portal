import { FC } from 'react';
import Modal from 'react-modal';

import { useModal } from '../../hooks/useModal';

export const NotEligibleModal: FC = () => {
  const { isNotEligibleModalOpen, handleCloseNotEligibleModal } = useModal();
  return (
    <Modal
      isOpen={isNotEligibleModalOpen}
      onRequestClose={handleCloseNotEligibleModal}
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
      <div className="claim-popup">
        <img className="parcel-0-logo-md" src="/citydao-parcel-0-logo-md.png" alt="Parcel Zero NFT" />
        <div className="popup-title">Parcel 0 Claim</div>
        <div className="popup-content">
          This wallet is not eligible to claim any NFTs
          <div className="note">
            Parcel 0 plots can only be claimed by{' '}
            <a target="_blank" href="https://citydao.io/" rel="noreferrer">
              CityDAO Citizen
            </a>{' '}
            NFT holders at the time of snapshot (May 16th, 12pm MDT, 2022)
          </div>
        </div>
        <button className="btn-close" onClick={handleCloseNotEligibleModal}>
          Close
        </button>
      </div>
    </Modal>
  );
};
