import { ArbitrageParams, ArbitragePool } from '../../../externalDeps';
import { getExternalDeps } from '../../../appContext';

export async function startArbitrage<ArbParams extends ArbitrageParams>(
  path: ArbitragePool[],
  arbitrageParams: ArbParams,
  accountAddress: string,
  chainId: string
): Promise<string> {
  return await getExternalDeps().startArbitrage(
    path,
    arbitrageParams,
    accountAddress,
    chainId
  );
}

export const stopAllArbitrages = async (force = false) => {
  await getExternalDeps().stopAllArbitrages(force);
};

export const stopArbitrage = async (arbitrageId: string, force = false) => {
  await getExternalDeps().stopArbitrage(arbitrageId, force);
};

export const getAllArbitragesIds = (): string[] => {
  return getExternalDeps().getAllArbitragesIds();
};
