// source: https://github.com/Bounty-Hunt-2022/bounty-hunt/blob/main/interface/state/wallet/hook.ts
import { Provider } from '@ethersproject/abstract-provider';
import { JsonRpcProvider } from '@ethersproject/providers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import Torus from '@toruslabs/torus-embed';
import { providers } from 'ethers';
import { useCallback, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { useAppContext } from '../context/StateProvider';
import { ActionTypes } from '../reducer';

const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: INFURA_ID,
    },
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: 'CityDAO Parcel-0',
      infuraId: INFURA_ID,
      darkMode: true,
    },
  },
  torus: {
    package: Torus,
  },
  binancechainwallet: {
    package: true,
  },
};

let web3Modal: any;
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    theme: 'dark',
    network: 'mainnet', // optional
    cacheProvider: true,
    providerOptions, // required
  });
}

export interface WalletHook {
  provider: Provider | null;
  web3Provider: JsonRpcProvider | null;
  account: string | null;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const useWallet = (): WalletHook => {
  const { state, dispatch } = useAppContext();
  const provider = state.provider;
  const connect = useCallback(async function () {
    const provider = await web3Modal.connect();

    const web3Provider = new providers.Web3Provider(provider);

    const signer = web3Provider.getSigner();
    const account = await signer.getAddress();

    const network = await web3Provider.getNetwork();

    dispatch({
      type: ActionTypes.setWeb3Provider,
      payload: {
        provider,
        web3Provider,
        account,
        chainId: network.chainId,
      },
    });
  }, []);

  const disconnect = useCallback(
    async function () {
      await web3Modal.clearCachedProvider();

      const providerish: any = provider;
      if (providerish?.disconnect && typeof providerish.disconnect === 'function') {
        await providerish.disconnect();
      }
      dispatch({
        type: ActionTypes.resetWeb3Provider,
        payload: {},
      });
    },
    [state.provider],
  );

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      // noinspection JSIgnoredPromiseFromCall
      connect();
    }
  }, []);

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        // eslint-disable-next-line no-console
        console.log('accountsChanged', accounts);
        dispatch({
          type: ActionTypes.setAddress,
          payload: { account: accounts[0] },
        });
      };

      // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      const handleChainChanged = (_hexChainId: string) => {
        console.log('chainChanged', _hexChainId);
        window.location.reload();
      };

      const handleDisconnect = (error: { code: number; message: string }) => {
        // eslint-disable-next-line no-console
        console.log('disconnect why', error);
        disconnect();
      };

      provider.on('accountsChanged', handleAccountsChanged);
      provider.on('chainChanged', handleChainChanged);
      provider.on('disconnect', handleDisconnect);

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged);
          provider.removeListener('chainChanged', handleChainChanged);
          provider.removeListener('disconnect', handleDisconnect);
        }
      };
    }
  }, [provider, disconnect]);
  return {
    connect,
    disconnect,
    ...state,
  };
};

export default useWallet;
