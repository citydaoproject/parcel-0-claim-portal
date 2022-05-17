import React from 'react';
import DefaultButton, { DefaultButtonProps } from './common/DefaultButton';

export interface ClaimButtonProps extends Omit<DefaultButtonProps, 'onClick'> {
  allowance: number;
  walletAlreadyClaimed: number;
  withinClaimPeriod: boolean;
  onClaim: () => void;
  onShowMinted: () => void;
  onNotEligible: () => void;
}

enum ClaimStatus {
  READY_TO_CLAIM = 'READY_TO_CLAIM',
  SOME_CLAIMED = 'SOME_CLAIMED',
  ALL_CLAIMED = 'ALL_CLAIMED',
  NOT_ELIGIBLE = 'NOT_ELIGIBLE',
  OUTSIDE_CLAIM_PERIOD = 'OUTSIDE_CLAIM_PERIOD',
}

const ClaimButton = ({
  allowance,
  walletAlreadyClaimed,
  withinClaimPeriod,
  disabled,
  onClaim,
  onShowMinted,
  onNotEligible,
  ...rest
}: ClaimButtonProps) => {
  const claimStatus = determineClaimStatus(allowance, walletAlreadyClaimed, withinClaimPeriod);

  const getClaimButtonText = () => {
    switch (claimStatus) {
      case ClaimStatus.READY_TO_CLAIM:
      case ClaimStatus.SOME_CLAIMED:
        return `Claim ${allowance - walletAlreadyClaimed} NFTs`;

      case ClaimStatus.ALL_CLAIMED:
        return `${walletAlreadyClaimed} NFTs Claimed`;

      case ClaimStatus.NOT_ELIGIBLE:
      case ClaimStatus.OUTSIDE_CLAIM_PERIOD:
        return 'Claim NFTs';

      default:
        return 'Claim NFTs';
    }
  };

  const isDisabled = () => {
    if (disabled) {
      return true;
    }

    switch (claimStatus) {
      case ClaimStatus.READY_TO_CLAIM:
      case ClaimStatus.SOME_CLAIMED:
      case ClaimStatus.ALL_CLAIMED:
      case ClaimStatus.NOT_ELIGIBLE:
        return false;

      case ClaimStatus.OUTSIDE_CLAIM_PERIOD:
        return true;

      default:
        return false;
    }
  };

  const handleClick = () => {
    switch (claimStatus) {
      case ClaimStatus.READY_TO_CLAIM:
      case ClaimStatus.SOME_CLAIMED:
        onClaim();
        break;

      case ClaimStatus.ALL_CLAIMED:
        onShowMinted();
        break;

      case ClaimStatus.NOT_ELIGIBLE:
        onNotEligible();
        break;

      default:
        break;
    }
  };

  return (
    <DefaultButton {...rest} disabled={isDisabled()} onClick={handleClick}>
      {getClaimButtonText()}
    </DefaultButton>
  );
};
export default ClaimButton;

const determineClaimStatus = (allowance: number, walletAlreadyClaimed: number, withinClaimPeriod: boolean) => {
  if (!withinClaimPeriod) {
    return ClaimStatus.OUTSIDE_CLAIM_PERIOD;
  }

  if (allowance === 0) {
    return ClaimStatus.NOT_ELIGIBLE;
  }

  if (walletAlreadyClaimed === 0) {
    return ClaimStatus.READY_TO_CLAIM;
  }

  if (walletAlreadyClaimed < allowance) {
    return ClaimStatus.SOME_CLAIMED;
  }

  return ClaimStatus.ALL_CLAIMED;
};
