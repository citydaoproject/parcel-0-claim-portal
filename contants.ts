import { addresses } from './data/whiteListedAddresses';

export const MAX_NFT_TO_MINT = Object.values(addresses).reduce((prev, curr) => prev + curr, 0);

const AGREEMENT_IPFS_HASH = 'QmTNZQCFZPoGBPGZgU1qk7YPBGAW5LWgiikrRxF5JT4stu';
export const AGREEMENT_IPFS_URL = `https://ipfs.io/ipfs/${AGREEMENT_IPFS_HASH}`;

export enum VIEWS {
  'INITIAL_VIEW',
  'MINTED_NFTS',
}
