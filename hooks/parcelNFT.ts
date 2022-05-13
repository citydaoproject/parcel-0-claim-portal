import { ParcelNFT__factory } from '@citydao/parcel-contracts/dist/types/contracts/factories/ParcelNFT__factory';
import { ParcelNFT } from '@citydao/parcel-contracts/dist/types/contracts/ParcelNFT';
import { ContractAddress } from '@citydao/parcel-contracts/src/constants/accounts';
import { BigNumber } from 'ethers';
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
  claimPeriodStart: number;
  claimPeriodEnd: number;
}

export const useParcelNFT = (contractAddress: ContractAddress): ParcelNFTHook => {
  const { account } = useWallet();
  const {
    contract: parcelNFT,
    values,
    refetch: refetchValues,
  } = useContractLoader(new ParcelNFT__factory(), contractAddress, ['totalSupply', 'claimPeriod']);
  const [walletAlreadyClaimed, setWalletAlreadyClaimed] = useState<number>(0);

  const buildParcelNFTDetails = (): ParcelNFTDetails | null => {
    if (!(parcelNFT && values && account)) {
      return null;
    }

    const { totalSupply, claimPeriod } = values;

    const totalSupplyNumber = 'toNumber' in totalSupply ? totalSupply.toNumber() : 0;
    const [claimPeriodStart, claimPeriodEnd] =
      claimPeriod instanceof Array ? claimPeriod : [BigNumber.from(0), BigNumber.from(0)];

    return {
      parcelNFT: parcelNFT,
      walletAlreadyClaimed,
      totalSupply: totalSupplyNumber,
      claimPeriodStart: claimPeriodStart.toNumber() * 1000,
      claimPeriodEnd: claimPeriodEnd.toNumber() * 1000,
      allowance: addresses[account.toLowerCase()],
    };
  };

  const parcelNFTDetails: ParcelNFTDetails | null = buildParcelNFTDetails();

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    loadFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
