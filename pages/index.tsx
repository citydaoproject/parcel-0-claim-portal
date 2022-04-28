import { useMemo, useState, useCallback, ReactNode, FC } from "react";
import { NextPage } from "next";
import { ethers } from "ethers";
import { Iframe } from "../components/Iframe";
import keccak256 from "keccak256";
import MerkleTree from "merkletreejs";
import { addresses } from "../data/whiteListedAddresses";
import { shortenWalletAddress } from "../utils";
const AGGREEMENT_IPFS_HASH = "QmTYC4wiCZ7n8zTKVKdAFAY4Q8fe8Se3sqve1yjK9FCd1Y"; // TODO update this with pinata link
const AGGREEMENT_IPFS_URL = `https://ipfs.io/ipfs/${AGGREEMENT_IPFS_HASH}`;
const CITIZEN_NFT_CONTRACT_ADDRESS =
  "0x7eef591a6cc0403b9652e98e88476fe1bf31ddeb";
const CITIZEN_NFT_IDS = [7, 42, 69];

interface ConnectButtonProps {
  enabled?: boolean;
  onClick?(): void;
  address?: string;
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

const Home: NextPage = () => {
  const [address, setAddress] = useState<string>();
  const [nftCount, setNftCount] = useState<number>();
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);
  const leaves = addresses.map((x) => keccak256(x));
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const buf2hex = (x: Buffer) => "0x" + x.toString("hex");

  // console.log(buf2hex(tree.getRoot()));

  const handleLoad = () => {
    setIsIframeLoaded(true);
  };
  const provider = useMemo(
    () =>
      typeof window !== "undefined"
        ? new ethers.providers.Web3Provider((window as any).ethereum, "mainnet")
        : undefined,
    []
  );
  const citizenContract = useMemo(
    () =>
      new ethers.Contract(
        CITIZEN_NFT_CONTRACT_ADDRESS,
        require("./../data/contract.json").abi,
        provider
      ),
    [provider]
  );

  function claim() {
    const leaf = keccak256(address!); // address from wallet using walletconnect/metamask
    const proof = tree.getProof(leaf).map((x) => buf2hex(x.data));
    citizenContract.methods.safeMint(address, proof).send({ from: address }); // will be called on click of the mint button
  }

  const connectWallet = useCallback(async () => {
    //TODO trkaplan check what happens when you visit with a browser that does not have metamask
    if (!provider) return;
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    if (!address) return;

    const balances = await citizenContract.balanceOfBatch(
      CITIZEN_NFT_IDS.map(() => address),
      CITIZEN_NFT_IDS
    );
    const count = balances
      .map(Number)
      .reduce((a: number, b: number) => a + b, 0);

    setNftCount(count);
    setAddress(address);
  }, [citizenContract, provider]);

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
              <div className="parcel-zero">Parcel Zero</div>
              <div className="parcel-address">
                <div className="address-line-1">Powell, Wyoming, 82435</div>
                <div className="address-line-2">
                  Section Number 13 Township 57N, Range 103W
                </div>
              </div>
            </div>
            <img src="/citydao-parcel-0-NFT-Art.png" alt="Parcel Zero NFT" />
          </div>
          <div className="content-right">
            {/* nftCount */}
            <button onClick={claim}>Claim Plots</button>
            <div className="properties">
              <div className="property">
                <div className="propName">TOTAL PLOTS</div>
                <div className="propVal">TBD</div>
              </div>
              <div className="property">
                <div className="propName">PARCEL SIZE</div>
                <div className="propVal">40 ACRES</div>
              </div>
              <div className="property">
                <div className="propName">TOKEN</div>
                <div className="propVal">PARCEL-0</div>
              </div>
              <div className="property">
                <div className="propName">USE</div>
                <div className="propVal">CONSERVATION</div>
              </div>
              <div className="property">
                <div className="propName">ACCESS</div>
                <div className="propVal">PUBLIC</div>
              </div>
              <div className="property">
                <div className="propName">LICENSE</div>
                <div className="propVal">
                  <a href="# ">VIEW ON IPFS</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
