import { FC, useState } from 'react';
import Modal from 'react-modal';

import { useModal } from '../../hooks/useModal';
import { AGREEMENT_IPFS_URL } from '../../constants/other';

type ClaimModalProps = {
  eligibleNftsCount: number;
  onClaim: () => void;
  onCancel: () => void;
};
export const ClaimModal: FC<ClaimModalProps> = ({ eligibleNftsCount, onClaim, onCancel }) => {
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
        <div className="close-icon" onClick={onCancel}>
          X
        </div>
        <img className="parcel-0-logo-md" src="/citydao-parcel-0-logo-md.png" alt="Parcel Zero NFT" />
        <div className="popup-title">Parcel 0 Claim</div>
        You are eligible to claim
        <span className="text-primary">
          {` ${eligibleNftsCount} Parcel 0 NFT${eligibleNftsCount > 1 ? 's' : ''}. `}
        </span>
        for
        <br /> free. You just need to pay the gas.
        <div className="parcel-art-container">
          <img className="parcel-art" src={'/citydao-parcel-0-claimed-NFT-art.png'} alt="" />
        </div>
        <div className="terms">
          <input
            id="cb1"
            type="checkbox"
            style={{ display: 'none' }}
            checked={isTermsAccepted}
            onChange={(e) => setIsTermsAccepted(e.target.checked)}
          />
          <label htmlFor="cb1" className="checkbox-label">
            {isTermsAccepted ? (
              <img className="checkbox-icon" src="/icons/icon_check.png" alt="Checked" />
            ) : (
              <img className="checkbox-icon" src="/icons/icon_unchecked.png" alt="Unchecked" />
            )}
            &nbsp;Accept Parcel 0{' '}
            <a target="_blank" href={AGREEMENT_IPFS_URL} className="text-primary" rel="noreferrer">
              Terms & Conditions
            </a>
          </label>
        </div>
        <button className="btn-accept" disabled={!isTermsAccepted} onClick={onClaim}>
          AGREE & CLAIM
        </button>
      </div>
    </Modal>
  );
};
