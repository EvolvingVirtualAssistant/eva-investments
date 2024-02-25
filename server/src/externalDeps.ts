import { attemptImport, pathJoin, ROOT_PATH } from './deps';
import { Dictionary } from './types/types';

export type ArbitrageParams = {
  inputAmountsByToken: Dictionary<string>;
  slippagePercentage: number;
  profitWithRefund: boolean;
  gasFactor: number;
  gasPriceOffset: string;
  txRevertDeadline?: number;
  intraBlock: boolean;
  dryRun: boolean;
};

export type ArbitragePool = {
  exchange: string;
  tokenA: string;
  tokenB: string;
};

export interface ExternalDeps {
  startArbitrage: <ArbParams extends ArbitrageParams>(
    path: ArbitragePool[],
    arbitrageParams: ArbParams,
    accountAddress: string,
    chainId: string
  ) => Promise<string>;
  stopAllArbitrages: (force?: boolean) => Promise<void>;
  stopArbitrage: (arbitrageId: string, force?: boolean) => Promise<void>;
  getAllArbitragesIds: () => string[];
  getParticipants: (
    chainId: string,
    contractAddress: string,
    ownerAddress: string
  ) => Promise<string[]>;
  addParticipant: (
    chainId: string,
    contractAddress: string,
    participantAddress: string,
    ownerAddress: string,
    maxPriorityFeePerGas?: string
  ) => Promise<void>;
  removeParticipant: (
    chainId: string,
    contractAddress: string,
    participantAddress: string,
    ownerAddress: string,
    maxPriorityFeePerGas?: string
  ) => Promise<void>;
  transferOwnership: (
    chainId: string,
    contractAddress: string,
    ownerAddress: string,
    newOwnerAddress: string,
    maxPriorityFeePerGas?: string
  ) => Promise<void>;
  createAccount: (
    chainId: string,
    filePath: string,
    password: string
  ) => Promise<void>;
  recoverAccount: (
    chainId: string,
    mnemonic: string,
    derivationPath: string,
    filePath: string,
    password: string
  ) => Promise<void>;
}

let externalDeps: ExternalDeps | undefined;

export async function getExternalImports() {
  if (externalDeps) {
    return externalDeps;
  }

  const externalDepsPath = process.env['EXTERNAL_DEPS_PATH'];

  const externalImports = await attemptImport(
    externalDepsPath
      ? pathJoin(/*'file://', */ ROOT_PATH, externalDepsPath)
      : '',
    [],
    {}
  );

  const externalImportsFind = (prop: string) =>
    externalImports.find((func) => func?.name === prop);

  externalDeps = {
    startArbitrage: externalImportsFind('startArbitrage'),
    stopAllArbitrages: externalImportsFind('stopAllArbitrages'),
    stopArbitrage: externalImportsFind('stopArbitrage'),
    getAllArbitragesIds: externalImportsFind('getAllArbitragesIds'),
    getParticipants: externalImportsFind('getParticipants'),
    addParticipant: externalImportsFind('addParticipant'),
    removeParticipant: externalImportsFind('removeParticipant'),
    transferOwnership: externalImportsFind('transferOwnership'),
    createAccount: externalImportsFind('createAccount'),
    recoverAccount: externalImportsFind('recoverAccount')
  };

  return externalDeps;
}
