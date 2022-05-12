import { FC } from 'react';
import { shortenWalletAddress } from '../../utils';

interface ConnectButtonProps {
  enabled?: boolean;
  onClick?(): void;
  address?: string;
  text?: string;
}

export const ConnectButton: FC<ConnectButtonProps> = ({ enabled, onClick, address }) => {
  // TODO trkaplan disable if wallet is not installed
  return (
    <button disabled={!enabled} onClick={onClick} className="text-button">
      {address ? shortenWalletAddress(address) : 'Connect'}
    </button>
  );
};
