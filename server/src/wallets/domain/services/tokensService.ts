import {
  BN,
  Contract,
  ContractAbi,
  logDebug,
  TransactionReceipt,
  EtherUnits,
  Web3,
  Web3Extension
} from '../../../deps';
import { loadPrecompiledContract } from '../../../contracts/domain/services/deployContractService';
import { Account } from '../entities/accounts';
import { sendTransaction } from '../../../contracts/domain/services/transactionService';
import { getContractByName } from '../../../contracts/domain/services/contractService';
import { Dictionary, getLatestBlockNumber } from '../../../app';
import { TokenAllowances } from '../entities/allowances';
import { Erc20Abi } from '../entities/tokens';

export const approveToken = async (
  chainId: string,
  web3: Web3,
  account: Account,
  tokenAddress: string,
  spenderAddress: string,
  tokenAmount: BN,
  isWeth = false,
  gas = 48486n,
  ethereUnit: EtherUnits = 'wei',
  gasPrice = Web3.utils.toWei('1.2444', 'gwei'),
  maxPriorityFeePerGas = BigInt(Web3.utils.toWei('1.561699993', 'gwei')),
  maxFeePerGas = BigInt(Web3.utils.toWei('1.561700001', 'gwei'))
): Promise<void> => {
  const tokenContract: Contract<Erc20Abi> = getTokenContract(
    chainId,
    web3,
    tokenAddress,
    isWeth
  );
  const approveFnEnconded = tokenContract.methods
    .approve(spenderAddress, BigInt(tokenAmount.toString()))
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
      ethereUnit,
      gasPrice,
      maxPriorityFeePerGas,
      maxFeePerGas,
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
      Web3.utils.bytesToHex(transactionReceipt.logs?.[0]?.data || ''),
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

export const getTokenAllowance = async (
  chainId: string,
  web3: Web3,
  accountAddress: string,
  tokenAddress: string,
  ownerAddress: string,
  spenderAddress: string,
  isWeth = false
): Promise<BN> => {
  const tokenContract: Contract<Erc20Abi> = getTokenContract(
    chainId,
    web3,
    tokenAddress,
    isWeth
  );

  const ethCallOptions = {
    from: accountAddress
  };

  const allowance = await tokenContract.methods
    .allowance(ownerAddress, spenderAddress)
    .call(ethCallOptions);

  return new BN(allowance.toString());
};

const getWETH9Contract = (chainId: string) =>
  getContractByName(chainId, 'WETH9');
const getERC20Contract = (chainId: string) =>
  getContractByName(chainId, 'ERC20');

export const getTokenContract = <Abi extends ContractAbi>(
  chainId: string,
  web3: Web3,
  address: string,
  isWeth = false
): Contract<Abi> => {
  return loadPrecompiledContract(
    web3,
    isWeth
      ? getWETH9Contract(chainId).compiledPath
      : getERC20Contract(chainId).compiledPath,
    address
  );
};

export const getAllTokensAllowances = async (
  web3: Web3Extension,
  chainId: string,
  ownerAddress: string,
  nDays: number
): Promise<TokenAllowances[]> => {
  blockOperationIfPaidNodeProvider(web3);

  const currBlock = await getLatestBlockNumber(web3, chainId);
  const blockAvgTime = await calculateBlockAvgTime(web3, currBlock);
  const daysInSec = nDays * 24 * 60 * 60;
  const prevBlocks = Math.round(daysInSec / Math.floor(blockAvgTime));

  type ResolvedReturnType<T> = T extends Promise<Array<infer R>> ? R : never;
  type PastLog = ResolvedReturnType<
    ReturnType<typeof Web3.prototype.eth.getPastLogs>
  >;

  const logs: PastLog[] = await web3.eth.getPastLogs({
    fromBlock: web3.utils.numberToHex(currBlock - BigInt(prevBlocks)),
    toBlock: 'latest',
    topics: [
      web3.utils.soliditySha3('Approval(address,address,uint256)')!,
      `0x000000000000000000000000${ownerAddress.substring(2)}`
    ]
  });

  const isStringArray = (obj: PastLog): obj is string => {
    return (obj as string).substring !== undefined;
  };

  const tokensAllowances: Dictionary<TokenAllowances> = {};

  logs.forEach((log) => {
    // just typing log as something else than a string
    if (isStringArray(log)) {
      return;
    }
    const newTokenAllowance = {
      tokenAddress: log.address,
      amount: log.data
        ? web3.utils.hexToNumberString(log.data as string)
        : undefined,
      toAddress:
        log.topics?.length === 3
          ? '0x' + (log.topics[2] as string).substring(26)
          : '',
      block: log.blockNumber as bigint
    };

    if (!newTokenAllowance.tokenAddress) {
      return;
    }

    let tokenAllowances = tokensAllowances[newTokenAllowance.tokenAddress];

    if (tokenAllowances == null) {
      tokenAllowances = {
        tokenAddress: newTokenAllowance.tokenAddress,
        allowances: []
      };
      tokensAllowances[newTokenAllowance.tokenAddress] = tokenAllowances;
    }

    const idx = tokenAllowances.allowances.findIndex(
      (allowance) => allowance.toAddress === newTokenAllowance.toAddress
    );

    if (idx < 0 && newTokenAllowance.amount != '0') {
      tokenAllowances.allowances.push(newTokenAllowance);
    } else if (
      idx >= 0 &&
      tokenAllowances.allowances[idx].block < newTokenAllowance.block
    ) {
      // Revoke
      if (newTokenAllowance.amount == '0') {
        tokenAllowances.allowances.splice(idx, 1);
      } else {
        tokenAllowances.allowances[idx] = newTokenAllowance;
      }
    }
  });

  return Object.values(tokensAllowances).filter(
    (tokenAllowances) => tokenAllowances.allowances.length > 0
  );
};

const calculateBlockAvgTime = async (
  web3: Web3,
  currBlock: bigint
): Promise<number> => {
  const nBlocks = 1000;
  const currentTs = await web3.eth
    .getBlock('latest')
    .then((block) => block.timestamp);

  const oldTs = await web3.eth
    .getBlock(Number.parseInt(currBlock + '') - nBlocks)
    .then((block) => block.timestamp);

  return (
    (Number.parseInt(currentTs + '') - Number.parseInt(oldTs + '')) / nBlocks
  );
};

const blockOperationIfPaidNodeProvider = (web3: Web3Extension) => {
  // TODO: Maybe better to find a way that as blocking as the one below
  if (web3.currentNode.options.some((opt) => !opt.isFree)) {
    throw new Error(
      'Current node provider selected is not free, making this operation very costly. You should use a free node instead. No token allowances were retrieved.'
    );
  }
};
