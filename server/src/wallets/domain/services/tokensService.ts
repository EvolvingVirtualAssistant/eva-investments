import { BN, Contract, TransactionReceipt, Unit, Web3 } from '../../../deps';
import { loadPrecompiledContract } from '../../../contracts/domain/services/deployContractService';
import { Account } from '../entities/accounts';
import { sendTransaction } from '../../../contracts/domain/services/transactionService';
import { getContractByName } from '../../../contracts/domain/services/contractService';
import { EthereUnit } from '../../../app';

export const erc20TokenApprove = async (
  web3: Web3,
  account: Account,
  tokenAddress: string,
  spenderAddress: string,
  tokenAmount: BN,
  gas = 48486,
  gasPrice = '1.2444',
  ethereUnit: Unit = 'gwei' as EthereUnit
): Promise<void> => {
  const tokenContract: Contract = getTokenContract(web3, tokenAddress, false);
  const approveFnEnconded = tokenContract.methods
    .approve(spenderAddress, tokenAmount)
    .encodeABI();

  console.log(
    `Approving Spender to transfer ${tokenAmount} token ${tokenAddress}\n`
  );
  const transactionReceipt: TransactionReceipt = await sendTransaction(
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
    transactionReceipt.logs[0].data,
    transactionReceipt.logs?.flatMap((log) => log.topics)
  );
  console.log(
    `\nSpender contract address ${approveResponse ? '' : 'not '}approved ${
      transactionReceipt.transactionHash
    }\n`
  );
  //await getApprovalEvent(tokenContract);
};

const WETH9Contract = getContractByName('WETH9');
const ERC20Contract = getContractByName('ERC20');

const getTokenContract = (
  web3: Web3,
  address: string,
  isWeth = false
): Contract => {
  return loadPrecompiledContract(
    web3,
    isWeth ? WETH9Contract.compiledPath : ERC20Contract.compiledPath,
    address
  );
};
