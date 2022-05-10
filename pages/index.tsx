import { useState, FC, useEffect } from "react";
import { NextPage } from "next";
import { ethers } from "ethers";
import { Iframe } from "../components/Iframe";
import { ParcelProperties } from "../containers/ParcelProperties";
import useWallet from "../hooks/useWallet";

import { getParcelProperties } from "../parcel-properties";
import keccak256 from "keccak256";
import MerkleTree from "merkletreejs";
import { addresses, Addresses } from "../data/whiteListedAddresses";
import { shortenWalletAddress } from "../utils";
import { MAX_NFT_TO_MINT } from "../contants";
const PARCEL0_NFT_CONTRACT_ADDRESS =
  "0xce3E41B4dC206D52e55c1c2573Ce4324b27c8abc";
const numberOfMintedNFTs = 1; // TODO trkaplan calculate this value
const LABEL_CLAIM_PLOTS = "Claim Plots";

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
function hashToken(address: keyof Addresses, allowance: number) {
  return Buffer.from(
    ethers.utils
      .solidityKeccak256(["address", "uint256"], [address, allowance])
      .slice(2),
    "hex"
  );
}
const Home: NextPage = () => {
  const [claimButtonText, setClaimButtonText] =
    useState<string>(LABEL_CLAIM_PLOTS);
  const [eligibleNftCount, setEligibleNftCount] = useState<number>();
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);
  const {
    account: address,
    web3Provider: provider,
    connect,
    disconnect,
    chainId, // TODO trkaplan warn users connected to different chain for better UX
  } = useWallet();
  function onWalletDisconnect() {
    disconnect();
    setClaimButtonText(LABEL_CLAIM_PLOTS);
  }
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

  async function claim() {
    const signer = provider.getSigner();
    const parcel0Contract = new ethers.Contract(
      PARCEL0_NFT_CONTRACT_ADDRESS,
      require("./../data/contract.json").abi,
      provider
    );
    const allowance: number = Number(addresses[address as keyof Addresses]);
    const proof = tree.getHexProof(hashToken(address!, allowance));

    const numberOfMinted = await parcel0Contract
      .connect(signer)
      .addressToMinted(address)
      .then((result: ethers.BigNumber) => result.toNumber());
    if (allowance > numberOfMinted) {
      parcel0Contract
        .connect(signer)
        .allowlist(address, eligibleNftCount, allowance, proof)
        .then((res: any) => {
          console.log("response", res);
        });
    } else {
      console.log("Already claimed!");
    }
  }

  //TODO trkaplan check what happens when you visit with a browser that does not have metamask
  //setNftCount(count);

  useEffect(() => {
    if (address) {
      checkEligibility(address);
    }
  }, [address]);

  const checkEligibility = async (address: string) => {
    try {
      const signer = provider.getSigner();
      const parcel0Contract = new ethers.Contract(
        PARCEL0_NFT_CONTRACT_ADDRESS,
        require("./../data/contract.json").abi,
        provider
      );
      const allowance: number = Number(addresses[address as keyof Addresses]);

      //const proof = tree.getHexProof(hashToken(address, allowance));

      parcel0Contract
        .connect(signer)
        .addressToMinted(address)
        .then((result: ethers.BigNumber) => {
          const numberOfMinted = result.toNumber();
          if (allowance > numberOfMinted) {
            setEligibleNftCount(1);
            alert("want to mint?");
          } else if (allowance === numberOfMinted) {
            setClaimButtonText(`${numberOfMinted} Plots Claimed`);
          }
        });
    } catch (error) {
      console.log(error);
      // TODO trkaplan handle internal and Wallet native errors.
    }
  };

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
            <ConnectButton onClick={connect} address={address} enabled={true} />
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
                {address && (
                  <>
                    {`You are connected, ${shortenWalletAddress(address)}, `}
                    <a href="#" onClick={onWalletDisconnect}>
                      disconnect
                    </a>
                  </>
                )}
                {!address && (
                  <span>
                    To claim{" "}
                    <a href="#" onClick={connect}>
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
