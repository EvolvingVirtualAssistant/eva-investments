import { attemptImport, pathJoin, ROOT_PATH } from './deps';
import { Dictionary } from './types/types';

export type ArbitrageParams = {
  inputAmountsByToken: Dictionary<string>;
  outputAmountsByToken: Dictionary<string>;
  slippagePercentage: number;
  isOutputSlippage: boolean;
  profitWithRefund: boolean;
  gasFactor: number;
  gasPriceOffset: string;
  deadline?: number;
};

export type ArbitragePool = {
  exchange: string;
  tokenA: string;
  tokenB: string;
};

export interface ExternalDeps {
  startArbitrage: (
    path: ArbitragePool[],
    arbitrageParams: ArbitrageParams,
    accountAddress: string,
    chainId: number
  ) => Promise<string>;
  stopAllArbitrages: (force?: boolean) => Promise<void>;
  stopArbitrage: (arbitrageId: string, force?: boolean) => Promise<void>;
  getAllArbitragesIds: () => string[];
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
    getAllArbitragesIds: externalImportsFind('getAllArbitragesIds')
  };

  return externalDeps;
}