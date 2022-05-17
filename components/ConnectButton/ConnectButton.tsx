import { FC } from 'react';
import { shortenWalletAddress } from '../../utils';

interface ConnectButtonProps {
  enabled?: boolean;
  onClick?(): void;
  address?: string;
  text?: string;
}

export const ConnectButton: FC<ConnectButtonProps> = ({ enabled, onClick, address }) => (
  <button disabled={!enabled} onClick={onClick} className={address ? 'text-button cursor-default' : 'text-button'}>
    {address ? shortenWalletAddress(address) : 'Connect'}
  </button>
);
