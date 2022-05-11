import { FC, useState } from 'react';
import Modal from 'react-modal';

import { useModal } from '../../hooks/useModal';

type ClaimModalProps = {
  eligibleNftsCount: number;
  onButtonClick: () => void;
  onClose: () => void;
};
export const ClaimModal: FC<ClaimModalProps> = ({ eligibleNftsCount, onButtonClick }) => {
  const { isClaimModalOpen, handleCloseClaimModal } = useModal();
  const [isTermsAccepted, setIsTermsAccepted] = useState<boolean>(false);
  return (
    <Modal
      isOpen={isClaimModalOpen}
      onRequestClose={handleCloseClaimModal}
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
      <div className="claim-popup">
        <img src="/citydao-parcel-0-logo.png" alt="Parcel Zero NFT" />
        <div className="popup-title">Parcel 0 Claim</div>
        You are eligible to claim
        <span className="text-primary">
          {` ${eligibleNftsCount}`} Parcel 0 NFT{eligibleNftsCount > 1 ? 's' : ''}.
        </span>
        <img className="parcel-art" src={'/citydao-parcel-0-NFT-Art-sm.png'} alt="" />
        <div className="terms">
          <input
            id="cb1"
            type="checkbox"
            checked={isTermsAccepted}
            onChange={(e) => setIsTermsAccepted(e.target.checked)}
          />
          <label htmlFor="cb1">
            Accept Parcel 0 <span className="text-primary">Terms & Conditions</span>
          </label>
        </div>
        <button className="btn-accept" disabled={!isTermsAccepted} onClick={onButtonClick}>
          AGREE & CLAIM
        </button>
      </div>
    </Modal>
  );
};
