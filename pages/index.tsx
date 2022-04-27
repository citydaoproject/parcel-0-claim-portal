import { useMemo, useState, useCallback, ReactNode, FC } from "react";
import { NextPage } from "next";
import { ethers } from "ethers";
import { Iframe } from "../components/Iframe";
const AGGREEMENT_IPFS_HASH = "QmTYC4wiCZ7n8zTKVKdAFAY4Q8fe8Se3sqve1yjK9FCd1Y"; // TODO update this with pinata link
const AGGREEMENT_IPFS_URL = `https://ipfs.io/ipfs/${AGGREEMENT_IPFS_HASH}`;

const CITIZEN_NFT_CONTRACT_ADDRESS =
  "0x7eef591a6cc0403b9652e98e88476fe1bf31ddeb";
const CITIZEN_NFT_IDS = [7, 42, 69];

const Home: NextPage = () => {
  const [address, setAddress] = useState<string>();
  const [nftCount, setNftCount] = useState<number>();
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);

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
        require("./contract.json").abi,
        provider
      ),
    [provider]
  );

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
    <main>
      <h1 className="text-center">
        <span className="color-primary">CityDAO</span> Parcel-0
      </h1>
      <p className="text-center mt-1">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem,
        cupiditate natus tempore explicabo minus quos quia corporis odio,
        eveniet commodi recusandae quidem dolores aliquam nulla pariatur! Odio
        ratione quidem debitis. .
      </p>
      <section className="aggreement-container">
        {!isIframeLoaded && <b className="loader-bar">Loading...</b>}
        <Iframe
          width="100%"
          height="100%"
          url={AGGREEMENT_IPFS_URL}
          onLoad={handleLoad}
        />
      </section>

      <button onClick={connectWallet}>Connect</button>
      <p>NFT Count: {nftCount}</p>
      <p>Address: {address}</p>
    </main>
  );
};

export default Home;
