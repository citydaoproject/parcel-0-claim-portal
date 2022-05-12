import { ParcelNFT__factory } from '@citydao/parcel-contracts/dist/types/contracts/factories/ParcelNFT__factory';
import { ParcelNFT } from '@citydao/parcel-contracts/dist/types/contracts/ParcelNFT';
import { ContractAddress } from '@citydao/parcel-contracts/src/constants/accounts';
import { useEffect, useState } from 'react';
import { addresses } from '../data/whiteListedAddresses';
import { useContractLoader } from './contractHooks';
import useWallet from './useWallet';

export interface ParcelNFTHook {
  parcelNFTDetails: ParcelNFTDetails | null;
  refetch: () => Promise<void>;
}

export interface ParcelNFTDetails {
  parcelNFT: ParcelNFT;
  totalSupply: number;
  walletAlreadyClaimed: number;
  allowance: number;
}

export const useParcelNFT = (contractAddress: ContractAddress): ParcelNFTHook => {
  const { account } = useWallet();
  const {
    contract: parcelNFT,
    values,
    refetch: refetchValues,
  } = useContractLoader(new ParcelNFT__factory(), contractAddress, ['totalSupply']);
  const [walletAlreadyClaimed, setWalletAlreadyClaimed] = useState<number>(0);

  const parcelNFTDetails: ParcelNFTDetails | null =
    parcelNFT && values && account
      ? {
          parcelNFT: parcelNFT,
          walletAlreadyClaimed,
          totalSupply: values.totalSupply.toNumber(),
          allowance: addresses[account.toLowerCase()],
        }
      : null;

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    loadFields();
  }, [account, parcelNFT]);

  const loadFields = async () => {
    if (!parcelNFT || !account) {
      setWalletAlreadyClaimed(0);
      return;
    }

    const alreadyClaimed = (await parcelNFT.alreadyClaimed(account)).toNumber();
    setWalletAlreadyClaimed(alreadyClaimed);
  };

  const refetch = async () => {
    await Promise.all([refetchValues(), loadFields()]);
  };

  return { parcelNFTDetails: parcelNFTDetails, refetch };
};
