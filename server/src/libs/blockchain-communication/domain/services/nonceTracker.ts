import { Web3 } from '../../deps';
import { Dictionary } from '../../types/blockchainCommunication.types';

type Mutex = {
  mutex: Promise<number>;
};

export type NonceTracker = {
  initAddress: (web3: Web3, address: string) => Promise<void>;
  getNextNonce: (web3: Web3, address: string) => Promise<number>;
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

  const _initMutex = async (web3: Web3, address: string): Promise<Mutex> => {
    const networkNonce = await _getNetworkNonce(web3, address);

    // networkNonce corresponds to the next valid nonce that should be used, and not the latest one used
    return { mutex: Promise.resolve(networkNonce - 1) };
  };

  const initAddress = async (web3: Web3, address: string) => {
    const nonceKey = web3.currentProvider + address;
    if (_noncesByChainAndAddress[nonceKey]) {
      return;
    }
    _noncesByChainAndAddress[nonceKey] = await _initMutex(web3, address);
  };

  const getNextNonce = async (web3: Web3, address: string): Promise<number> => {
    const nonceKey = web3.currentProvider + address;
    const nonceMutex = _noncesByChainAndAddress[nonceKey];
    if (!nonceMutex) {
      throw new Error(
        `Address: ${address} for provider: ${web3.currentProvider} has not beed initialized. Please call initAddress function`
      );
    }

    nonceMutex.mutex = nonceMutex.mutex.then((nonce) => nonce + 1);

    return nonceMutex.mutex;
  };

  return { initAddress, getNextNonce };
};

export default getNonceTracker;
