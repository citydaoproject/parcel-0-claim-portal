import { FC } from 'react';
import Modal from 'react-modal';

import { useModal } from '../../hooks/useModal';

type ClaimSuccessModalProps = {
  eligibleNftsCount: number;
  txId: string;
};
export const ClaimSuccessModal: FC<ClaimSuccessModalProps> = ({ eligibleNftsCount, txId }) => {
  const { isClaimSuccessModalOpen, handleCloseClaimSuccessModal } = useModal();
  const etherscanUrl = `https://etherscan.io/tx/${txId}`;
  return (
    <Modal
      isOpen={isClaimSuccessModalOpen}
      onRequestClose={handleCloseClaimSuccessModal}
      overlayClassName="react-modal-overlay"
      className="react-modal-content success-popup"
    >
      <div className="claim-popup">
        <img className="parcel-0-logo-md" src="/citydao-parcel-0-logo-md.png" alt="Parcel Zero NFT" />
        <div className="popup-title">Parcel 0 Claim</div>
        <div className="popup-content text-small">
          <div className="success-message">
            Congratulations! Your transaction for minting{' '}
            <span className="text-primary">
              {` ${eligibleNftsCount}`} Parcel 0 NFT{eligibleNftsCount > 1 ? 's' : ''}
            </span>{' '}
            has been submitted!
            <br /> You may leave this page. {`Your ${eligibleNftsCount > 1 ? 'NFTs' : 'NFT'}`} will be in your wallet as
            soon as the transaction is processed. In the meantime, you can{' '}
            <a target="_blank" href={etherscanUrl} rel="noreferrer">
              check the status here
            </a>
          </div>
          <img
            className="mintedNftImage in-success-popup"
            alt="Parcel 0 NFT Art"
            src="/citydao-parcel-0-claimed-NFT-art.png"
          />
          <p>
            NFT location will be revealed after parcel minting closes on <b>Friday, July 1st, 12:00pm MDT (GMT -6).</b>
          </p>
        </div>
        <button className="btn-close" onClick={handleCloseClaimSuccessModal}>
          Close
        </button>
      </div>
    </Modal>
  );
};
