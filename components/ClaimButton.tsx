import React from 'react';
import DefaultButton, { DefaultButtonProps } from './common/DefaultButton';

export interface ClaimButtonProps extends DefaultButtonProps {
  allowance: number;
  walletAlreadyClaimed: number;
  withinClaimPeriod: boolean;
}

const ClaimButton = ({ allowance, walletAlreadyClaimed, withinClaimPeriod, disabled, ...rest }: ClaimButtonProps) => {
  const getClaimButtonText = () => {
    if (!withinClaimPeriod) {
      return 'CLAIM PLOTS';
    }

    if (allowance > 0 && allowance > walletAlreadyClaimed) {
      return `CLAIM ${allowance - walletAlreadyClaimed} PLOTS`;
    }

    if (walletAlreadyClaimed > 0) {
      return `${walletAlreadyClaimed} PLOTS CLAIMED`;
    }

    return 'CLAIM PLOTS';
  };

  return (
    <DefaultButton
      {...rest}
      disabled={disabled || !withinClaimPeriod || (walletAlreadyClaimed === 0 && allowance === 0)}
    >
      {getClaimButtonText()}
    </DefaultButton>
  );
};
export default ClaimButton;
