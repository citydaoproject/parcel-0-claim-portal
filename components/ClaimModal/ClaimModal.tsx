import { FC, useState } from 'react';
import Modal from 'react-modal';

import { useModal } from '../../hooks/useModal';
import { AGREEMENT_IPFS_URL } from '../../contants';

type ClaimModalProps = {
  eligibleNftsCount: number;
  onClaim: () => void;
  onClose: () => void;
};
export const ClaimModal: FC<ClaimModalProps> = ({ eligibleNftsCount, onClaim }) => {
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
        <img className="parcel-0-logo-md" src="/citydao-parcel-0-logo-md.png" alt="Parcel Zero NFT" />
        <div className="popup-title">Parcel 0 Claim</div>
        You are eligible to claim
        <span className="text-primary">
          {` ${eligibleNftsCount} Parcel 0 NFT${eligibleNftsCount > 1 ? 's' : ''}. `}
        </span>
        for
        <br /> free. You just need to pay the gas.
        <img className="parcel-art" src={'/citydao-parcel-0-NFT-Art-sm.png'} alt="" />
        <div className="terms">
          <input
            id="cb1"
            type="checkbox"
            checked={isTermsAccepted}
            onChange={(e) => setIsTermsAccepted(e.target.checked)}
          />
          <label htmlFor="cb1">
            Accept Parcel 0{' '}
            <a target="_blank" href={AGREEMENT_IPFS_URL} className="text-primary">
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
