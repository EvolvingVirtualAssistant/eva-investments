import { Web3 } from '../../deps';
import { Dictionary } from '../../types/blockchainCommunication.types';

type Mutex = {
  mutex: Promise<number>;
  nonce: number;
};

export type NonceTracker = {
  initAddress: (web3: Web3, address: string) => Promise<void>;
  getNextNonce: (web3: Web3, address: string) => Promise<number>;
  getNextUnsafeNonce: (web3: Web3, address: string) => number;
  syncLocalNonce: (web3: Web3, address: string) => Promise<void>;
};

const getNonceTracker: () => NonceTracker = () => {
  const _noncesByChainAndAddress: Dictionary<Mutex> = {};

  const _getNetworkNonce = async (
    web3: Web3,
    address: string
  ): Promise<number> => {
    //const latestBlockNumber = await web3.eth.getBlockNumber();
    return await web3.eth.getTransactionCount(address, 'pending');
  };

  const _syncMutex = async (web3: Web3, address: string): Promise<Mutex> => {
    const networkNonce = await _getNetworkNonce(web3, address);

    //console.log(
    //  'Setting nonce for address with value',
    //  address,
    //  networkNonce - 1
    //);
    // networkNonce corresponds to the next valid nonce that should be used, and not the latest one used
    return {
      mutex: Promise.resolve(networkNonce - 1),
      nonce: networkNonce - 1
    };
  };

  const initAddress = async (web3: Web3, address: string) => {
    const nonceKey = web3.currentProvider + address;
    if (_noncesByChainAndAddress[nonceKey]) {
      return;
    }
    _noncesByChainAndAddress[nonceKey] = await _syncMutex(web3, address);
  };

  const getNextNonce = async (web3: Web3, address: string): Promise<number> => {
    const nonceKey = web3.currentProvider + address;
    const nonceMutex = _noncesByChainAndAddress[nonceKey];
    if (!nonceMutex) {
      throw new Error(
        `Address: ${address} for provider: ${web3.currentProvider} has not beed initialized. Please call initAddress function`
      );
    }

    nonceMutex.mutex = nonceMutex.mutex.then((nonce) => {
      //console.log(`getNextNonce (${nonce + 1}) for address ${address}`);
      return nonce + 1;
    });

    return nonceMutex.mutex;
  };

  const getNextUnsafeNonce = (web3: Web3, address: string): number => {
    const nonceKey = web3.currentProvider + address;
    const nonceMutex = _noncesByChainAndAddress[nonceKey];
    if (!nonceMutex) {
      throw new Error(
        `Address: ${address} for provider: ${web3.currentProvider} has not beed initialized. Please call initAddress function`
      );
    }

    nonceMutex.nonce = nonceMutex.nonce + 1;

    return nonceMutex.nonce;
  };

  //recovery function that should be triggered once an error is thrown as result of sendTransaction call
  const syncLocalNonce = async (web3: Web3, address: string) => {
    const nonceKey = web3.currentProvider + address;
    if (!_noncesByChainAndAddress[nonceKey]) {
      await initAddress(web3, address);
      return;
    }

    _noncesByChainAndAddress[nonceKey] = await _syncMutex(web3, address);
  };

  return { initAddress, getNextNonce, getNextUnsafeNonce, syncLocalNonce };
};

export default getNonceTracker;
