import { addresses } from '../data/whiteListedAddresses';

export const MAX_NFT_TO_MINT = Object.values(addresses).reduce((prev, curr) => prev + curr, 0);

const AGREEMENT_IPFS_HASH = 'QmeHXkNPh3Sr9KwZkL1q8HSMvA3s3LSPqWodSCnZnvqST2';
export const AGREEMENT_IPFS_URL = `https://ipfs.io/ipfs/${AGREEMENT_IPFS_HASH}`;

export const PARCEL0_NFT_CONTRACT_ADDRESSES: { [key: number]: string } = {
  1: '0x90384e76b6B3DdB47396fF85144819ded148900d',
  4: '0x209723a65844093Ad769d557a22742e0f661959d',
};

export enum VIEWS {
  'INITIAL_VIEW',
  'MINTED_NFTS',
}
