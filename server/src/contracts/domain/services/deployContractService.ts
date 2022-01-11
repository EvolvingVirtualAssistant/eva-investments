import { readJsonFile, readTextFile } from '../../../utils/files';
import {
  Unit,
  TransactionReceipt,
  ContractSendMethod,
  pathJoin,
  ROOT_PATH,
  web3
} from '../../../deps';
import AccountNotFoundError from './errors/accountNotFoundError';
import ContractContentMissingError from './errors/contractContentMissingError';
import NoAccountsProvidedError from './errors/noAccountsProvidedError';
import { SignedTransaction } from 'web3-core';
import { ACCOUNTS_KEY } from '../../constants/contractsConstants';

type Account = {
  address: string;
  privateKey: string;
  privateKeyPath: string;
};

export async function deploy(
  contractPath: string,
  contractName: string,
  compiledContractPath: string,
  deployerAccountAddress: string,
  host: string,
  gas: number,
  gasPrice: string,
  ethereUnit: Unit
): Promise<string> {
  let contractJson = readJsonFile(compiledContractPath);

  const deployerAccount = getAccountByAccountAddress(deployerAccountAddress);
  if (!deployerAccount) {
    throw new AccountNotFoundError(deployerAccountAddress);
  }

  contractJson = contractJson?.contracts[contractPath]?.[contractName];
  const contractByteCode: string = contractJson?.evm?.bytecode?.object;
  const abi: [] = contractJson?.abi;

  if (!contractJson || !contractByteCode || !abi) {
    throw new ContractContentMissingError(
      contractPath,
      contractName,
      contractJson,
      contractByteCode,
      abi
    );
  }

  web3.setProvider(host); //"http://localhost:8545"

  const contract = new web3.eth.Contract(abi);
  const contractTx = contract.deploy({
    data: contractByteCode
  });
  const createTransaction = await signTransaction(
    deployerAccount,
    contractTx,
    gas,
    gasPrice,
    ethereUnit
  );

  // still need to handle error scenarios

  const createReceipt: TransactionReceipt = await new Promise(
    (resolve, reject) => {
      web3.eth
        .sendSignedTransaction(createTransaction.rawTransaction!)
        .once(
          'confirmation',
          (
            confirmationNumber: number,
            receipt: TransactionReceipt,
            latestBlockHash?: string
          ) => {
            console.log(
              `Transaction confirmed. ConfirmationNumber: ${confirmationNumber} , LatestBlockHash: ${latestBlockHash} , Receipt: ${JSON.stringify(
                receipt
              )}`
            );
            resolve(receipt);
          }
        )
        .catch((e) => reject(e));
    }
  );

  console.log(`Contract deployed receipt: ${JSON.stringify(createReceipt)}`);

  if (!createReceipt.contractAddress) {
    throw new Error('Contract address not available');
  }

  return createReceipt.contractAddress;
}

async function signTransaction(
  deployerAccount: Account,
  contractTx: ContractSendMethod,
  gas: number,
  gasPrice: string,
  ethereUnit: Unit
): Promise<SignedTransaction> {
  return await web3.eth.accounts.signTransaction(
    {
      from: deployerAccount.address,
      data: contractTx.encodeABI(),
      gas, //750000
      gasPrice: web3.utils.toWei(gasPrice, ethereUnit) //1.2444
    },
    deployerAccount.privateKey
  );
}

function getAccountByAccountAddress(address: string): Account | undefined {
  const accountsPath: string = pathJoin(
    ROOT_PATH,
    process.env[ACCOUNTS_KEY] || ''
  );

  let accounts;

  try {
    accounts = readJsonFile(accountsPath);
    if (!accounts) {
      throw new Error();
    }
  } catch (e) {
    throw new NoAccountsProvidedError(accountsPath);
  }

  const account = accounts?.[address];

  if (!account) {
    return undefined;
  }

  const privateKey = readTextFile(account.privateKeyPath);

  return { ...account, privateKey };
}
