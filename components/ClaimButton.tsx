import React from 'react';
import DefaultButton, { DefaultButtonProps } from './common/DefaultButton';

export interface ClaimButtonProps extends DefaultButtonProps {
  allowance: number;
  walletAlreadyClaimed: number;
}

const ClaimButton = ({ allowance, walletAlreadyClaimed, disabled, ...rest }: ClaimButtonProps) => {
  const getClaimButtonText = () => {
    if (walletAlreadyClaimed === 0 && allowance === 0) {
      return 'CLAIM PLOTS';
    } else if (walletAlreadyClaimed > 0) {
      return `${walletAlreadyClaimed} PLOTS CLAIMED`;
    } else if (allowance > 0) {
      return `CLAIM ${allowance} PLOTS`;
    }
    return '';
  };

  return (
    <DefaultButton {...rest} disabled={disabled || allowance === 0}>
      {getClaimButtonText()}
    </DefaultButton>
  );
};
export default ClaimButton;
