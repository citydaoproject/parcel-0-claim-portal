import { useMemo, useState, useCallback, ReactNode, FC } from "react";
import { NextPage } from "next";
import { ethers } from "ethers";
import { Iframe } from "../components/Iframe";
import { ParcelProperties } from "../containers/ParcelProperties";
import { getParcelProperties } from "../parcel-properties";
import keccak256 from "keccak256";
import MerkleTree from "merkletreejs";
import { addresses } from "../data/whiteListedAddresses";
import { shortenWalletAddress } from "../utils";
import { MAX_NFT_TO_MINT } from "../contants";
const PARCEL0_NFT_CONTRACT_ADDRESS =
  "0xce3E41B4dC206D52e55c1c2573Ce4324b27c8abc";
const numberOfMintedNFTs = 1; // TODO trkaplan calculate this value

interface ConnectButtonProps {
  enabled?: boolean;
  onClick?(): void;
  address?: string;
  text?: string;
}

const ConnectButton: FC<ConnectButtonProps> = ({
  enabled,
  onClick,
  address,
}) => {
  // TODO trkaplan disable if wallet is not installed
  return (
    <button disabled={!enabled} onClick={onClick} className="text-button">
      {address ? shortenWalletAddress(address) : "Connect"}
    </button>
  );
};
// https://docs.ethers.io/v5/api/utils/hashing/#utils-solidityKeccak256
function hashToken(address: string, allowance: number) {
  return Buffer.from(
    ethers.utils
      .solidityKeccak256(["address", "uint256"], [address, allowance])
      .slice(2),
    "hex"
  );
}
const Home: NextPage = () => {
  const [address, setAddress] = useState<string>();
  const [claimButtonText, setClaimButtonText] = useState<string>("Claim Plots");
  const [eligibleNftCount, setEligibleNftCount] = useState<number>();
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);
  const tree = new MerkleTree(
    Object.entries(addresses).map(([address, allowance]) =>
      hashToken(address, Number(allowance))
    ),
    keccak256,
    { sortPairs: true }
  );

  const handleLoad = () => {
    setIsIframeLoaded(true);
  };
  const provider = useMemo(
    () =>
      typeof window !== "undefined"
        ? new ethers.providers.Web3Provider((window as any).ethereum, "rinkeby")
        : undefined,
    []
  );

  const parcel0Contract = useMemo(
    () =>
      new ethers.Contract(
        PARCEL0_NFT_CONTRACT_ADDRESS,
        require("./../data/contract.json").abi,
        provider
      ),
    [provider]
  );

  async function claim() {
    const allowance: number = Number(addresses[address]);
    const proof = tree.getHexProof(hashToken(address, allowance));

    const signer = provider.getSigner();
    const numberOfMinted = await parcel0Contract
      .connect(signer)
      .addressToMinted(address)
      .then((result: ethers.BigNumber) => result.toNumber());
    if (allowance > numberOfMinted) {
      parcel0Contract
        .connect(signer)
        .allowlist(address, eligibleNftCount, allowance, proof)
        .then((res) => {
          console.log("response", res);
        });
    } else {
      console.log("Already claimed!");
    }
  }

  const connectWallet = useCallback(async () => {
    //TODO trkaplan check what happens when you visit with a browser that does not have metamask
    if (!provider) return;
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    if (!address) return;
    setAddress(address);

    //setNftCount(count);

    // set Claim Button Text
    const allowance: number = Number(addresses[address]);
    //const proof = tree.getHexProof(hashToken(address, allowance));

    parcel0Contract
      .connect(signer)
      .addressToMinted(address)
      .then((result: ethers.BigNumber) => {
        const numberOfMinted = result.toNumber();
        if (allowance > numberOfMinted) {
          setEligibleNftCount(1);
          alert("want to mint?");
          /* parcel0Contract
          .connect(signer)
          .allowlist(address, allowance, allowance, proof)
          .then((res) => {
            setClaimButtonText(`${numberOfMinted} Plots Claimed`);
          }); */
        } else if (allowance === numberOfMinted) {
          setClaimButtonText(`${numberOfMinted} Plots Claimed`);
        }
      });
  }, [parcel0Contract, provider]);

  const parcelProperties = getParcelProperties(
    numberOfMintedNFTs,
    MAX_NFT_TO_MINT
  );
  return (
    <>
      <div className="page-header">
        <div className="header-content">
          <img className="logo" src="/citydao-logo.png" alt="CityDAO" />
          <div className="connect-button-container">
            <ConnectButton
              onClick={connectWallet}
              address={address}
              enabled={true}
            />
          </div>
        </div>
      </div>
      <main>
        <div className="page-content">
          <div className="content-left">
            <div className="left-header">
              <div className="address-box">
                <div className="parcel-zero">Parcel Zero</div>
                <div className="address">70 HAIL BASIN RD, POWELL, WYOMING</div>
              </div>
              <div className="message-box">
                Claim ends in{" "}
                <span className="remaining-time">45 Days 00 Hours</span>{" "}
                {/* TODO trkaplan use countdown component */}
                <br />
                {!address && (
                  <span>
                    To claim{" "}
                    <a href="#" onClick={connectWallet}>
                      connect your wallet
                    </a>
                  </span>
                )}
              </div>
            </div>
            <img src="/citydao-parcel-0-NFT-Art.png" alt="Parcel Zero NFT" />
          </div>
          <div className="content-right">
            {/* nftCount */}
            <button
              disabled={!address}
              onClick={claim}
              className={address ? "border-button default-cursor" : ""}
            >
              {claimButtonText}
            </button>
            <ParcelProperties parcelProperties={parcelProperties} />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
