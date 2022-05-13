/* eslint-disable @next/next/no-img-element */
import { ethers } from 'ethers';
import keccak256 from 'keccak256';
import MerkleTree from 'merkletreejs';
import { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import ClaimButton from '../components/ClaimButton';
import { ClaimModal } from '../components/ClaimModal';
import ClaimPeriodCountdown from '../components/ClaimPeriodCountdown';
import { ClaimSuccessModal } from '../components/ClaimSuccessModal';
import { ConnectButton } from '../components/ConnectButton';
import { MintedNftsView } from '../components/MintedNftsView';
import { NotEligibleModal } from '../components/NotEligibleModal';
import { MAX_NFT_TO_MINT, PARCEL0_NFT_CONTRACT_ADDRESSES, VIEWS } from '../constants/other';
import { ParcelProperties } from '../containers/ParcelProperties';
import { addresses, Addresses } from '../data/whiteListedAddresses';
import { useParcelNFT } from '../hooks/parcelNFT';
import { useModal } from '../hooks/useModal';
import useWallet from '../hooks/useWallet';
import { getParcelProperties } from '../parcel-properties';
import { shortenWalletAddress } from '../utils';

// https://docs.ethers.io/v5/api/utils/hashing/#utils-solidityKeccak256
function hashToken(address: keyof Addresses, allowance: number) {
  return Buffer.from(ethers.utils.solidityKeccak256(['address', 'uint256'], [address, allowance]).slice(2), 'hex');
}
const Home: NextPage = () => {
  const { handleOpenClaimModal, handleCloseClaimModal, handleOpenClaimSuccessModal } = useModal();
  const [currentView, setCurrentView] = useState<VIEWS>(VIEWS.INITIAL_VIEW);

  const { account: address, connect, disconnect, chainId } = useWallet();

  const { parcelNFTDetails, refetch } = useParcelNFT(PARCEL0_NFT_CONTRACT_ADDRESSES[chainId ?? 0]);

  const allowance = parcelNFTDetails?.allowance || 0;
  const walletAlreadyClaimed = parcelNFTDetails?.walletAlreadyClaimed || 0;
  const totalSupply = parcelNFTDetails?.totalSupply || 0;
  const claimPeriodStart = parcelNFTDetails?.claimPeriodStart || 0;
  const claimPeriodEnd = parcelNFTDetails?.claimPeriodEnd || 0;

  const onWalletDisconnect = async () => {
    await disconnect();
  };

  const merkleTree = useMemo(
    () =>
      new MerkleTree(
        Object.entries(addresses).map(([address, allowance]) => hashToken(address, allowance)),
        keccak256,
        { sortPairs: true },
      ),
    [],
  );

  const navigateToHome = () => {
    setCurrentView(VIEWS.INITIAL_VIEW);
  };

  const showMintedNfts = () => {
    setCurrentView(VIEWS.MINTED_NFTS);
  };

  const claim = async () => {
    if (!parcelNFTDetails) {
      console.warn('parcelNFT is not ready');
      return;
    }

    const { parcelNFT } = parcelNFTDetails;

    const proof = merkleTree.getHexProof(hashToken(address!, allowance));
    if (allowance > walletAlreadyClaimed) {
      const res = await parcelNFT.allowListMint(allowance, allowance, proof);
      console.debug('response', res);

      await refetch();
      handleCloseClaimModal();
      handleOpenClaimSuccessModal();
    } else {
      console.warn('Already claimed!');
    }
  };

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    checkEligibility();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, parcelNFTDetails]);

  const checkEligibility = async () => {
    if (!parcelNFTDetails) {
      console.debug('parcelNFT is not ready');
      return;
    }

    if (allowance > walletAlreadyClaimed) {
      setCurrentView(VIEWS.INITIAL_VIEW); // in case user in on the minted nfts view and changes the wallet.
    }

    // TODO trkaplan add loading indicator until eligibility check is complete
  };

  const parcelProperties = getParcelProperties(totalSupply, MAX_NFT_TO_MINT);
  return (
    <>
      <div className="page-header">
        <div className="header-content">
          <img className="logo" src="/citydao-logo.png" alt="CityDAO" />
          {chainId && chainId !== 1 ? (
            <div className="network-warning-container">Warning: Not on Main Ethereum Network</div>
          ) : null}
          <div className="connect-button-container">
            <ConnectButton onClick={connect} address={address || undefined} enabled={true} />
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
                <ClaimPeriodCountdown claimPeriodStart={claimPeriodStart} claimPeriodEnd={claimPeriodEnd} />
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
              <div className="nft-art-home-wrapper">
                <img className="nft-art-home" src="/citydao-parcel-0-NFT-Art.png" alt="Parcel Zero NFT" />
              </div>
            ) : (
              <MintedNftsView numberOfNfts={walletAlreadyClaimed} navigateToHome={navigateToHome} />
            )}
          </div>
          <div className="content-right">
            <ClaimButton
              walletAlreadyClaimed={walletAlreadyClaimed}
              allowance={allowance}
              withinClaimPeriod={claimPeriodStart < Date.now() && claimPeriodEnd > Date.now()}
              disabled={!address}
              onClick={
                walletAlreadyClaimed === 0 || walletAlreadyClaimed < allowance ? handleOpenClaimModal : showMintedNfts
              }
            />
            <ParcelProperties parcelProperties={parcelProperties} />
          </div>
        </div>
        <ClaimModal onClaim={claim} eligibleNftsCount={allowance} />
        <ClaimSuccessModal eligibleNftsCount={allowance} />
        <NotEligibleModal />
        <ReactTooltip />
      </main>
    </>
  );
};
export default Home;
