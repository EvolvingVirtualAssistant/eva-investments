import { Web3 } from '../../../../../src/deps';

export const Web3Mock = () => {
  const _web3 = new Web3();
  const _eth = _web3.eth;
  const mockGetTransactionCount = (mockFn: () => Promise<number>): void => {
    _eth.getTransactionCount = mockFn;
  };
  return {
    web3: {
      ..._web3,
      setProvider: function (): boolean {
        throw new Error('Function not implemented.');
      },
      extend: function () {
        throw new Error('Function not implemented.');
      },
      eth: _eth
    },
    mockGetTransactionCount
  };
};
