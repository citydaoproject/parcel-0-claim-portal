import { FC } from "react";

interface MintedNftsViewProps {
  navigateToHome: () => void;
  numberOfNfts: number;
}
export const MintedNftsView: FC<MintedNftsViewProps> = ({
  navigateToHome,
  numberOfNfts,
}) => (
  <div>
    <a href="#" onClick={navigateToHome}>
      Go Back
    </a>
    <br />
    <div className="mintedNftImagesWrapper">
      {[...Array(numberOfNfts)].map((value: undefined, index: number) => (
        <img
          className="mintedNftImage"
          key={index}
          src="/citydao-parcel-0-NFT-Art-sm2.png"
        />
      ))}
    </div>
  </div>
);
