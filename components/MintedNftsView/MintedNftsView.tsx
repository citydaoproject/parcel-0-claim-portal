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
        <img
          className="mintedNftImage"
          alt="Parcel 0 NFT Art"
          key={index}
          src="/citydao-parcel-0-claimed-NFT-art.png"
        />
      ))}
    </div>
  </div>
);
