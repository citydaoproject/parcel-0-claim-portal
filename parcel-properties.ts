import { ParcelPropertyProps } from './components/ParcelProperty';

export const getParcelProperties = (numberOfMinted: number, numberOfMaxNftToMint: number): ParcelPropertyProps[] => [
  {
    name: 'TOTAL NFTS',
    value: `${numberOfMinted}/${numberOfMaxNftToMint}`,
    tooltip: 'The number of NFTs will depend on how many Parcel 0 NFTs are minted.',
    iconPath: '/icons/icon_plot.png',
    altText: 'Plot',
  },
  {
    name: 'PARCEL SIZE',
    value: '40 ACRES',
    iconPath: '/icons/icon_40.png',
    altText: '40',
  },
  {
    name: 'PARCEL TYPE',
    value: 'VACANT LAND',
    iconPath: '/icons/icon_v.png',
    altText: 'V',
  },
  {
    name: 'PARCEL PURPOSE',
    value: 'CONSERVATION',
    tooltip:
      'Parcel 0 is currently planned for conservation. CityDAO’ may <br/>open up more possibilities for Parcel 0, for example, building a <br/>structure or a monument.',
    iconPath: '/icons/icon_tree.png',
    altText: 'Tree',
  },
  {
    name: 'NFT UTILITY',
    value: 'GOVERNANCE',
    tooltip: 'Parcel 0 NFT holders will get to vote and execute on <br/>Parcel 0 Improvement Projects.',
    iconPath: '/icons/icon_g.png',
    altText: 'G',
  },
  {
    name: 'PARCEL ACCESS',
    value: 'PERMITTED',
    tooltip:
      'Parcel 0 NFT holders can visit Parcel 0. CityDAO or Parcel 0 <br/>holders may define reasonable policies to manage visitation.',
    iconPath: '/icons/icon_check.png',
    altText: 'Checkmark',
  },
];
