export const getParcelProperties = (numberOfMinted: number, numberOfMaxNftToMint: number) => [
  {
    name: 'TOTAL PLOTS',
    value: `${numberOfMinted}/${numberOfMaxNftToMint}`,
    tooltip: 'The number of plots will depend on how many Parcel 0 NFTs are minted.',
    iconPath: '/icons/icon_plot.png',
  },
  {
    name: 'PARCEL SIZE',
    value: '40 ACRES',
    iconPath: '/icons/icon_40.png',
  },
  {
    name: 'PARCEL TYPE',
    value: 'VACANT LAND',
    iconPath: '/icons/icon_v.png',
  },
  {
    name: 'PARCEL PURPOSE',
    value: 'CONSERVATION',
    tooltip:
      'Parcel 0 is currently planned for conservation. CityDAO’ may open up more possibilities for Parcel 0, for example, building a structure or a monument.',
    iconPath: '/icons/icon_tree.png',
  },
  {
    name: 'NFT UTILITY',
    value: 'GOVERNANCE',
    tooltip: 'Parcel 0 NFT holders will get to vote and execute on Parcel 0 Improvement Projects.',
    iconPath: '/icons/icon_g.png',
  },
  {
    name: 'PARCEL ACCESS',
    value: 'PERMITTED',
    tooltip:
      'Parcel 0 NFT holders can visit Parcel 0. CityDAO or Parcel 0 holders may define reasonable policies to manage visitation.',
    iconPath: '/icons/icon_check.png',
  },
];
