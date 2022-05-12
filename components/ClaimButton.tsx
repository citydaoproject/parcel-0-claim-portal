import React from 'react';
import DefaultButton, { DefaultButtonProps } from './common/DefaultButton';

export interface ClaimButtonProps extends DefaultButtonProps {
  allowance: number;
  walletAlreadyClaimed: number;
}

const ClaimButton = ({ allowance, walletAlreadyClaimed, disabled, ...rest }: ClaimButtonProps) => {
  const getClaimButtonText = () => {
    if (allowance > 0 && allowance > walletAlreadyClaimed) {
      return `CLAIM ${allowance - walletAlreadyClaimed} PLOTS`;
    }

    if (walletAlreadyClaimed > 0) {
      return `${walletAlreadyClaimed} PLOTS CLAIMED`;
    }

    return 'CLAIM PLOTS';
  };

  return (
    <DefaultButton {...rest} disabled={disabled || (walletAlreadyClaimed === 0 && allowance === 0)}>
      {getClaimButtonText()}
    </DefaultButton>
  );
};
export default ClaimButton;
