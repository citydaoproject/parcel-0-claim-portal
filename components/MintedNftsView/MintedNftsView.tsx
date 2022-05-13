import { FC } from 'react';

interface MintedNftsViewProps {
  navigateToHome: () => void;
  numberOfNfts: number;
}
export const MintedNftsView: FC<MintedNftsViewProps> = ({ navigateToHome, numberOfNfts }) => (
  <div className="view-nfts">
    <a href="#" onClick={navigateToHome}>
      Go Back
    </a>
    <br />
    <div className="mintedNftImagesWrapper">
      {[...Array(numberOfNfts)].map((value: undefined, index: number) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="mintedNftImage" alt="Parcel 0 NFT Art" key={index} src="/citydao-parcel-0-NFT-Art-sm2.png" />
      ))}
    </div>
  </div>
);
