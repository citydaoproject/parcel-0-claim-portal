export const getParcelProperties = (numberOfMinted: number, numberOfMaxNftToMint: number) => [
  {
    name: 'TOTAL PLOTS',
    value: `${numberOfMinted}/${numberOfMaxNftToMint}`,
    tooltip: 'lorem ipsum dolor si a met',
    iconPath: '/icons/icon_plot.png',
  },
  {
    name: 'PARCEL SIZE',
    value: '40 ACRES',
    tooltip: 'lorem ipsum dolor si a met',
    iconPath: '/icons/icon_40.png',
  },
  {
    name: 'PARCEL TYPE',
    value: 'VACANT LAND',
    tooltip: 'lorem ipsum dolor si a met',
    iconPath: '/icons/icon_v.png',
  },
  {
    name: 'PARCEL PURPOSE',
    value: 'CONSERVATION',
    tooltip: 'lorem ipsum dolor si a met',
    iconPath: '/icons/icon_tree.png',
  },
  {
    name: 'PLOT UTILITY',
    value: 'GOVERNANCE',
    tooltip: 'lorem ipsum dolor si a met',
    iconPath: '/icons/icon_g.png',
  },
  {
    name: 'PARCEL ACCESS',
    value: 'PERMITTED',
    tooltip: 'lorem ipsum dolor si a met',
    iconPath: '/icons/icon_check.png',
  },
];
