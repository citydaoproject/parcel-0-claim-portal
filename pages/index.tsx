/* eslint-disable @next/next/no-img-element */
import { useState, FC, useEffect } from 'react';
import { NextPage } from 'next';
import { ethers } from 'ethers';
import ReactTooltip from 'react-tooltip';
import { Iframe } from '../components/Iframe';
import { ClaimModal } from '../components/ClaimModal';
import { ConnectButton } from '../components/ConnectButton';
import { ClaimSuccessModal } from '../components/ClaimSuccessModal';
import { ParcelProperties } from '../containers/ParcelProperties';
import useWallet from '../hooks/useWallet';
import { ParcelNFT__factory } from '@citydao/parcel-contracts/dist/types/contracts/factories/ParcelNFT__factory';
import { getParcelProperties } from '../parcel-properties';
import keccak256 from 'keccak256';
import MerkleTree from 'merkletreejs';
import { addresses, Addresses } from '../data/whiteListedAddresses';
import { shortenWalletAddress } from '../utils';
import { MAX_NFT_TO_MINT, VIEWS } from '../contants';
import { MintedNftsView } from '../components/MintedNftsView';
const PARCEL0_NFT_CONTRACT_ADDRESS = '0x209723a65844093Ad769d557a22742e0f661959d';
const numberOfMintedNFTsSoFar = 1; // TODO trkaplan calculate this value
import { useModal } from '../hooks/useModal';
import { Button } from '../components/Button';
import { NotEligibleModal } from '../components/NotEligibleModal';

// https://docs.ethers.io/v5/api/utils/hashing/#utils-solidityKeccak256
function hashToken(address: keyof Addresses, allowance: number) {
  return Buffer.from(ethers.utils.solidityKeccak256(['address', 'uint256'], [address, allowance]).slice(2), 'hex');
}
const Home: NextPage = () => {
  const { handleOpenClaimModal, handleCloseClaimModal, handleOpenClaimSuccessModal, handleOpenNotEligibleModal } =
    useModal();
  const [numberOfMintedNfts, setNumberOfMintedNfts] = useState<number>(0);
  const [eligibleNftCount, setEligibleNftCount] = useState<number>(0);
  const [claimButtonText, setClaimButtonText] = useState<string>('sss');
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);
  const [isEligible, setIsEligible] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<VIEWS>(VIEWS.INITIAL_VIEW);
  const {
    account: address,
    web3Provider: provider,
    connect,
    disconnect,
    chainId, // TODO trkaplan warn users connected to different chain for better UX
  } = useWallet();
  function onWalletDisconnect() {
    disconnect();
    setEligibleNftCount(0);
    setNumberOfMintedNfts(0);
  }
  // TODO trkaplan memoise tree
  const tree = new MerkleTree(
    Object.entries(addresses).map(([address, allowance]) => hashToken(address, allowance)),
    keccak256,
    { sortPairs: true },
  );

  const handleLoad = () => {
    setIsIframeLoaded(true);
  };

  function navigateToHome() {
    setCurrentView(VIEWS.INITIAL_VIEW);
  }
  function showMintedNfts() {
    setCurrentView(VIEWS.MINTED_NFTS);
  }

  async function claim() {
    const signer = provider.getSigner();
    const parcel0Contract = new ParcelNFT__factory().attach(PARCEL0_NFT_CONTRACT_ADDRESS);
    const allowance: number = Number(addresses[address?.toLowerCase() as keyof Addresses]);
    const proof = tree.getHexProof(hashToken(address!, allowance));
    const numberOfMinted = await parcel0Contract
      .connect(signer)
      .alreadyClaimed(address!)
      .then((result: ethers.BigNumber) => result.toNumber());
    if (allowance > numberOfMinted) {
      parcel0Contract
        .connect(signer)
        .allowListMint(eligibleNftCount, allowance, proof)
        .then((res: any) => {
          console.log('response', res);
          setEligibleNftCount(allowance);
          handleCloseClaimModal();
          handleOpenClaimSuccessModal();
          setCurrentView(VIEWS.MINTED_NFTS);
        });
    } else {
      console.log('Already claimed!');
    }
  }

  //TODO trkaplan check what happens when you visit with a browser that does not have metamask

  useEffect(() => {
    if (address) {
      // noinspection JSIgnoredPromiseFromCall
      checkEligibility(address);
    }
  }, [address]);

  useEffect(() => {
    let text = '';
    if (!address) {
      text = 'CLAIM NFTS';
    } else if (address && !isEligible) {
      text = 'NOT ELIGIBLE';
    } else if (numberOfMintedNfts > 0) {
      text = `${numberOfMintedNfts} PLOTS CLAIMED`;
    } else if (eligibleNftCount > 0) {
      text = `CLAIM ${eligibleNftCount} PLOTS`; // TODO trkaplan replace PLOTS w/ NFTS
    }
    setClaimButtonText(text);
  }, [numberOfMintedNfts, eligibleNftCount, isEligible, address]);

  const checkEligibility = async (address: string) => {
    try {
      const signer = provider.getSigner();
      const parcel0Contract = new ParcelNFT__factory().attach(PARCEL0_NFT_CONTRACT_ADDRESS);
      const allowance: number = addresses[address.toLowerCase() as keyof Addresses];
      if (allowance) {
        //const proof = tree.getHexProof(hashToken(address, allowance));
        // TODO trkaplan disable the claim button add loading indicator until eligibility check is complete
        parcel0Contract
          .connect(signer)
          .alreadyClaimed(address)
          .then((result: ethers.BigNumber) => {
            const numberOfMinted = result.toNumber();
            if (allowance > numberOfMinted) {
              setEligibleNftCount(allowance);
              setNumberOfMintedNfts(0);
              setCurrentView(VIEWS.INITIAL_VIEW); // in case user in on the minted nfts view and changes the wallet.
            } else if (allowance === numberOfMinted) {
              setNumberOfMintedNfts(numberOfMinted);
            }
          });
        setIsEligible(true);
      } else if (!allowance && address) {
        setIsEligible(false);
        handleOpenNotEligibleModal();
      }
    } catch (error) {
      console.log(error);
      // TODO trkaplan handle errors.
    }
  };

  const parcelProperties = getParcelProperties(numberOfMintedNFTsSoFar, MAX_NFT_TO_MINT);
  return (
    <>
      <div className="page-header">
        <div className="header-content">
          <img className="logo" src="/citydao-logo.png" alt="CityDAO" />
          <div className="connect-button-container">
            <ConnectButton onClick={connect} address={address!} enabled={true} />
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
                Claim ends in <span className="remaining-time">45 Days 00 Hours</span>{' '}
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
                    To claim{' '}
                    <a href="#" onClick={connect}>
                      connect your wallet
                    </a>
                  </span>
                )}
              </div>
            </div>
            {currentView === VIEWS.INITIAL_VIEW ? (
              <img src="/citydao-parcel-0-NFT-Art.png" alt="Parcel Zero NFT" style={{ width: '761px' }} />
            ) : (
              <MintedNftsView numberOfNfts={numberOfMintedNfts} navigateToHome={navigateToHome} />
            )}
          </div>
          <div className="content-right">
            {
              // TODO trkaplan disable if wallet is not installed
            }
            <Button
              isEnabled={Boolean(address)}
              onClick={
                numberOfMintedNfts === 0
                  ? isEligible
                    ? handleOpenClaimModal
                    : handleOpenNotEligibleModal
                  : showMintedNfts
              }
              label={claimButtonText}
              isBordered={numberOfMintedNfts > 0}
            />
            <ParcelProperties parcelProperties={parcelProperties} />
          </div>
        </div>
        <ClaimModal onClaim={claim} eligibleNftsCount={eligibleNftCount} />
        <ClaimSuccessModal eligibleNftsCount={eligibleNftCount} />
        <NotEligibleModal />
        <ReactTooltip />
      </main>
    </>
  );
};

export default Home;
