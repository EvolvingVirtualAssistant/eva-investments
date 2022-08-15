import { BN, Contract, TransactionReceipt, Unit, Web3 } from '../../../deps';
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

  console.log(
    `Approving Spender to transfer ${tokenAmount} token ${tokenAddress}\n`
  );
  const transactionReceipt: TransactionReceipt = await sendTransaction(
    chainId,
    web3,
    account,
    approveFnEnconded,
    gas,
    gasPrice,
    ethereUnit,
    tokenAddress
  );
  const approveResponse = web3.eth.abi.decodeLog(
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
  console.log(
    `\nSpender contract address ${approveResponse ? '' : 'not '}approved ${
      transactionReceipt.transactionHash
    }\n`
  );
  //await getApprovalEvent(tokenContract);
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
