import { ZERO_ADDRESS } from '@citydao/parcel-contracts/dist/src/constants/accounts';
import { JsonRpcProvider, Provider } from '@ethersproject/providers';
import { Contract, ContractFactory, Signer } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import useWallet from './useWallet';

export interface ContractLoaderHook<C extends Contract, K extends KeyOfGetterFunction<C>> {
  contract?: C;
  values?: ContractValues<C, K>;
  refetch: () => Promise<void>;
}

export type ContractValues<C extends Contract, K extends KeyOfGetterFunction<C>> = {
  [P in K]: Awaited<ReturnType<C[K]>>;
};

export type KeyOfType<T, V> = keyof {
  [P in keyof T as T[P] extends V ? P : never]: any;
};

export type KeyOfGetterFunction<T> = KeyOfType<T, () => any>;

export const useContractLoader = <
  F extends ContractFactory,
  C extends FactoryContract<F>,
  K extends KeyOfGetterFunction<C>,
>(
  factory: F,
  address: string,
  keys: K[] = [],
): ContractLoaderHook<C, K> => {
  const { web3Provider } = useWallet();

  const contract = useMemo(
    () => attachContract<F, C>(factory, address, web3Provider) || undefined,
    [factory, address, web3Provider],
  );
  const [values, setValues] = useState<ContractValues<C, K>>();

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    fetchValues();
  }, [contract]);

  const fetchValues = async () => {
    if (!contract) {
      setValues(undefined);
      return;
    }

    const fetchedValues = await Promise.all(keys.map((key) => contract[key]()));

    setValues(
      fetchedValues.reduce((acc, fetchedValue, index) => {
        acc[keys[index]] = fetchedValue;
        return acc;
      }, {} as ContractValues<C, K>),
    );
  };

  return { contract, values, refetch: fetchValues };
};

export const useInterfaceLoader = <C extends Contract, K extends KeyOfGetterFunction<C>>(
  factory: InterfaceFactoryConnector<C>,
  address: string,
  keys: K[] = [],
): ContractLoaderHook<C, K> => {
  const { web3Provider } = useWallet();

  const contract = useMemo(
    () => attachInterface<C>(factory, address, web3Provider) || undefined,
    [address, web3Provider],
  );
  const [values, setValues] = useState<ContractValues<C, K>>();

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    fetchValues();
  }, [contract]);

  const fetchValues = async () => {
    if (!contract) {
      setValues(undefined);
      return;
    }

    const fetchedValues = await Promise.all(keys.map((key) => contract[key]()));

    setValues(
      fetchedValues.reduce((acc, fetchedValue, index) => {
        acc[keys[index]] = fetchedValue;
        return acc;
      }, {} as ContractValues<C, K>),
    );
  };

  return { contract, values, refetch: fetchValues };
};

export interface EthereumProviderHook {
  provider: Provider | null;
  signer: Signer | null;
}

export const useEthereumProvider = (): EthereumProviderHook => {
  const { web3Provider } = useWallet();
  const signer = web3Provider?.getSigner();

  return { provider: web3Provider, signer: signer || null };
};

export type FactoryContract<F extends ContractFactory> = Contract & Awaited<ReturnType<F['deploy']>>;

export const attachContract = <F extends ContractFactory, C extends FactoryContract<F>>(
  factory: F,
  address: string,
  provider: JsonRpcProvider | null,
): C | null => {
  if (address === '' || address === ZERO_ADDRESS) {
    return null;
  }

  const signer = provider?.getSigner();
  if (signer) {
    return factory.attach(address).connect(signer) as C;
  }

  if (provider) {
    return factory.attach(address).connect(provider) as C;
  }

  return null;
};

export type InterfaceFactoryConnector<C extends Contract> = (address: string, provider: Signer | Provider) => C;

export const attachInterface = <C extends Contract>(
  connect: InterfaceFactoryConnector<C>,
  address: string,
  provider: JsonRpcProvider | null,
): C | null => {
  if (address === '' || address === ZERO_ADDRESS) {
    return null;
  }

  const signer = provider?.getSigner();
  if (signer) {
    return connect(address, signer) as C;
  }

  if (provider) {
    return connect(address, provider) as C;
  }

  return null;
};
