import { ZERO_ADDRESS } from '@citydao/parcel-contracts/dist/src/constants/accounts';
import { addresses } from '../data/whiteListedAddresses';

export const MAX_NFT_TO_MINT = Object.values(addresses).reduce((prev, curr) => prev + curr, 0);

const AGREEMENT_IPFS_HASH = 'QmUbFb12ZEAyoqGUEsnS8fxh78nowEqNwvn7BbAfryRRay';
export const AGREEMENT_IPFS_URL = `https://ipfs.io/ipfs/${AGREEMENT_IPFS_HASH}`;

export const PARCEL0_NFT_CONTRACT_ADDRESSES: { [key: number]: string } = {
  1: ZERO_ADDRESS,
  4: '0x209723a65844093Ad769d557a22742e0f661959d',
};

export enum VIEWS {
  'INITIAL_VIEW',
  'MINTED_NFTS',
}
