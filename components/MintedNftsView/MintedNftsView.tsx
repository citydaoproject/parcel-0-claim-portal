import { FC } from "react";

interface IMintedNftsView {
  name: string;
  navigateToHome: () => void;
}
export const MintedNftsView: FC<IMintedNftsView> = ({
  name,
  navigateToHome,
}) => (
  <div>
    <a href="#" onClick={navigateToHome}>
      Go Back
    </a>
    <br />
    Hi ! {name}{" "}
  </div>
);
