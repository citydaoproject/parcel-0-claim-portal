import { FC } from 'react';
import Modal from 'react-modal';

import { useModal } from '../../hooks/useModal';

type ClaimSuccessModalProps = {
  eligibleNftsCount: number;
};
export const ClaimSuccessModal: FC<ClaimSuccessModalProps> = ({ eligibleNftsCount }) => {
  const { isClaimSuccessModalOpen, handleCloseClaimSuccessModal } = useModal();
  return (
    <Modal
      isOpen={isClaimSuccessModalOpen}
      onRequestClose={handleCloseClaimSuccessModal}
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
      <div className="claim-popup">
        <img className="parcel-0-logo-md" src="/citydao-parcel-0-logo-md.png" alt="Parcel Zero NFT" />
        <div className="popup-title">Parcel 0 Claim</div>
        <div className="popup-content">
          Success! You just claimed
          <span className="text-primary">
            {` ${eligibleNftsCount}`} Parcel 0 NFT{eligibleNftsCount > 1 ? 's' : ''}.
          </span>
          <p>
            NFT location will be revealed after parcel minting
            <br /> closes on <b>Friday, July 1st, 12:00pm MDT (GMT -6).</b>
          </p>
        </div>
        <button className="btn-close" onClick={handleCloseClaimSuccessModal}>
          Close
        </button>
      </div>
    </Modal>
  );
};
