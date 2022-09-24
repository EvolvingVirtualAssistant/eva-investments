import {
  BN,
  Contract,
  logDebug,
  TransactionReceipt,
  Unit,
  Web3
} from '../../../deps';
import { loadPrecompiledContract } from '../../../contracts/domain/services/deployContractService';
import { Account } from '../entities/accounts';
import { sendTransaction } from '../../../contracts/domain/services/transactionService';
import { getContractByName } from '../../../contracts/domain/services/contractService';
import { EthereUnit } from '../../../app';

export const erc20TokenApprove = async (
  chainId: number,
  web3: Web3,
  account: Account,
  tokenAddress: string,
  spenderAddress: string,
  tokenAmount: BN,
  gas = 48486,
  gasPrice = '1.2444',
  ethereUnit: Unit = 'gwei' as EthereUnit
): Promise<void> => {
  const tokenContract: Contract = getTokenContract(
    chainId,
    web3,
    tokenAddress,
    false
  );
  const approveFnEnconded = tokenContract.methods
    .approve(spenderAddress, tokenAmount)
    .encodeABI();

  let approveResponse;
  let transactionReceipt: TransactionReceipt | undefined;
  try {
    transactionReceipt = await sendTransaction(
      chainId,
      web3,
      account,
      approveFnEnconded,
      gas,
      gasPrice,
      ethereUnit,
      tokenAddress
    );
    approveResponse = web3.eth.abi.decodeLog(
      [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      transactionReceipt.logs?.[0]?.data,
      transactionReceipt.logs?.flatMap((log: any) => log.topics)
    );
  } finally {
    logDebug(
      `\nSpender contract address ${
        approveResponse ? '' : 'not '
      }approved amount=${tokenAmount} token=${tokenAddress} tx=${
        transactionReceipt?.transactionHash
      }\n`
    );
  }
};

export const getErc20TokenAllowance = async (
  chainId: number,
  web3: Web3,
  accountAddress: string,
  tokenAddress: string,
  ownerAddress: string,
  spenderAddress: string
): Promise<BN> => {
  const tokenContract: Contract = getTokenContract(
    chainId,
    web3,
    tokenAddress,
    false
  );

  const ethCallOptions = {
    from: accountAddress
  };

  const allowance = await tokenContract.methods
    .allowance(ownerAddress, spenderAddress)
    .call(ethCallOptions);

  return Web3.utils.toBN(allowance);
};

const getWETH9Contract = (chainId: number) =>
  getContractByName(chainId, 'WETH9');
const getERC20Contract = (chainId: number) =>
  getContractByName(chainId, 'ERC20');

const getTokenContract = (
  chainId: number,
  web3: Web3,
  address: string,
  isWeth = false
): Contract => {
  return loadPrecompiledContract(
    web3,
    isWeth
      ? getWETH9Contract(chainId).compiledPath
      : getERC20Contract(chainId).compiledPath,
    address
  );
};
