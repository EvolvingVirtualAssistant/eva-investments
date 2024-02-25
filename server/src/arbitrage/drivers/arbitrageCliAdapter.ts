import { readJsonFile } from '../../utils/files';
import { CliConstants } from '../../constants/cliConstants';
import {
  cliAdapter,
  cliEntrypoint,
  getAllCliEntrypointsByCliAdapter,
  println
} from '../../deps';
import { ArbitrageCliConstants } from '../constants/cliConstants';
import { Dictionary } from '../../types/types';
import { ArbitragePool } from '../../externalDeps';
import {
  getAllArbitragesIds,
  startArbitrage,
  stopAllArbitrages,
  stopArbitrage
} from '../domain/services/arbitrageService';

type StartArbitrageParams = {
  accountAddress: string;
  chainId: string;
  inputAmountsByToken: Dictionary<string>;
  slippagePercentage: number;
  profitWithRefund: boolean;
  gasFactor: number;
  gasPriceOffset: string;
  txRevertDeadline: number;
  intraBlock: boolean;
  dryRun: boolean;
};

interface StartStaticArbitrageParams extends StartArbitrageParams {
  pools: string;
  outputAmountsByToken: Dictionary<string>;
  isOutputSlippage: boolean;
}

type StartStaticArbitrageParamsWithParsedPool = StartStaticArbitrageParams & {
  pools: ArbitragePool[];
};

interface StartDynamicArbitrageParams extends StartArbitrageParams {
  tokenIn: string;
  tokenOut: string;
  maxHops: number;
}

@cliAdapter({
  tokens: [ArbitrageCliConstants.ADAPTER_TOKEN],
  description: ArbitrageCliConstants.ADAPTER_DESCRIPTION
})
export class ArbitrageCliAdapter {
  @cliEntrypoint(
    {
      tokens: [
        CliConstants.OPTION_HELP_TOKEN_1,
        CliConstants.OPTION_HELP_TOKEN_2
      ],
      description: CliConstants.OPTION_HELP_DESCRIPTION
    },
    true
  )
  async getHelpMessage(errMsg?: string): Promise<void> {
    const entrypoints = getAllCliEntrypointsByCliAdapter(
      ArbitrageCliConstants.ADAPTER_TOKEN
    );
    await println(
      (errMsg || '') +
        ArbitrageCliConstants.HELP_COMMAND_TEMPLATE(
          ArbitrageCliConstants.USAGE,
          CliConstants.LIST_TEMPLATE(
            ...entrypoints.map((entry: any) => [
              CliConstants.OPTION_TEMPLATE(
                CliConstants.LIST_INLINE_TEMPLATE(
                  ...entry.tokens.map((t: any) => [t])
                ),
                entry.description
              )
            ])
          )
        )
    );
  }

  @cliEntrypoint({
    tokens: [ArbitrageCliConstants.ARBITRAGE_START_TOKEN],
    description: ArbitrageCliConstants.ARBITRAGE_START_DESCRIPTION
  })
  async startArbitrage(arbitrageConfigFilePath: string): Promise<void> {
    try {
      await this._startArbitrage(arbitrageConfigFilePath);
    } catch (e) {
      println(`${e}`);
    }
  }

  private _startArbitrage(arbitrageConfigFilePath: string): Promise<void> {
    const config = readJsonFile(arbitrageConfigFilePath);

    if (config['pools']) {
      const configWithParsedPools = this.parsePools(
        config as unknown as StartStaticArbitrageParams
      );
      const { pools, accountAddress, chainId, ...arbitrageParams } =
        configWithParsedPools;

      return startArbitrage(
        pools,
        arbitrageParams,
        accountAddress,
        chainId
      ).then((arbId) => {
        println(`Arbitrage with id: ${arbId} successfully started`);
      });
    }

    if (config['tokenIn'] && config['tokenOut'] && config['maxHops']) {
      const { accountAddress, chainId, ...arbitrageParams } =
        config as unknown as StartDynamicArbitrageParams;
      return startArbitrage([], arbitrageParams, accountAddress, chainId).then(
        (arbId) => {
          println(`Arbitrage with id: ${arbId} successfully started`);
        }
      );
    }

    return println(`Could not start arbitrage: invalid configuration provided`);
  }

  @cliEntrypoint({
    tokens: [ArbitrageCliConstants.ARBITRAGE_START_ALL_TOKEN],
    description: ArbitrageCliConstants.ARBITRAGE_START_ALL_DESCRIPTION
  })
  async startAllArbitrages(arbitrageConfigsFilePath: string): Promise<void> {
    try {
      const configs: string[] = readJsonFile(arbitrageConfigsFilePath);

      const startArbitragePromises = configs.map((configFilePath) =>
        this._startArbitrage(configFilePath)
      );

      await Promise.allSettled(startArbitragePromises).then((values) => {
        const result = values
          .map((val) => {
            if (val.status === 'fulfilled') {
              return val.status;
            }
            const err = (val as PromiseRejectedResult).reason;

            if (err instanceof Error) {
              return val.status + ': ' + err.message + '';
            } else {
              return val.status + ': ' + err + '';
            }
          })
          .reduce(
            (prev, curr) => {
              if (curr === 'fulfilled') {
                return {
                  fulfilledCount: prev.fulfilledCount + 1,
                  errorReasons: prev.errorReasons
                };
              }

              return {
                fulfilledCount: prev.fulfilledCount,
                errorReasons: [...prev.errorReasons, `-${curr}`]
              };
            },
            { fulfilledCount: 0, errorReasons: [] } as {
              fulfilledCount: number;
              errorReasons: string[];
            }
          );

        const errorReasons =
          result.errorReasons.length === 0
            ? ''
            : ` Could not start all arbitrages due to:\n${result.errorReasons.join(
                '\n'
              )}`;

        println(
          `Started ${result.fulfilledCount}/${startArbitragePromises.length} arbitrages.${errorReasons}`
        );
      });
    } catch (e) {
      println(`${e}`);
    }
  }

  private parsePools(
    config: StartStaticArbitrageParams
  ): StartStaticArbitrageParamsWithParsedPool {
    const regex = /(\s*\w+\s*,\s*\w+\s*\/\s*\w+\s*)/g;
    const iterator = config.pools.matchAll(regex);

    let pools: ArbitragePool[];
    try {
      pools = [...iterator]
        .map((match) => match[0])
        .map((match) => {
          const dexAndPool = match.split(',');
          const pool = dexAndPool[1].split('/');
          return {
            exchange: dexAndPool[0].trim(),
            tokenA: pool[0].trim(),
            tokenB: pool[1].trim()
          };
        });
    } catch (e) {
      throw new Error(
        `Provided pools arg: ${config.pools} does not respect the format: (dex_name , tokenA/tokenB) - (dex_name , tokenA/tokenB) ...  . Error: ${e}`
      );
    }

    return { ...config, pools } as StartStaticArbitrageParamsWithParsedPool;
  }

  @cliEntrypoint({
    tokens: [ArbitrageCliConstants.ARBITRAGE_LIST_TOKEN],
    description: ArbitrageCliConstants.ARBITRAGE_LIST_DESCRIPTION
  })
  async listArbitrages(): Promise<void> {
    try {
      const arbitrageProcessesList = getAllArbitragesIds()
        .map((id) => `- ${id}`)
        .join('\n');
      await println(`Running arbitrages:\n${arbitrageProcessesList}`);
    } catch (e) {
      println(`${e}`);
    }
  }

  @cliEntrypoint({
    tokens: [ArbitrageCliConstants.ARBITRAGE_STOP_TOKEN],
    description: ArbitrageCliConstants.ARBITRAGE_STOP_DESCRIPTION
  })
  async stopArbitrage(arbitrageId: string): Promise<void> {
    try {
      await stopArbitrage(arbitrageId);

      await println(`Stopped arbitrage with id:${arbitrageId} gracefully`);
    } catch (e) {
      println(`${e}`);
    }
  }

  @cliEntrypoint({
    tokens: [ArbitrageCliConstants.ARBITRAGE_STOP_FORCE_TOKEN],
    description: ArbitrageCliConstants.ARBITRAGE_STOP_FORCE_DESCRIPTION
  })
  async forceStopArbitrage(arbitrageId: string): Promise<void> {
    try {
      await stopArbitrage(arbitrageId, true);

      await println(`Stopped arbitrage with id:${arbitrageId} immediately`);
    } catch (e) {
      println(`${e}`);
    }
  }

  @cliEntrypoint({
    tokens: [ArbitrageCliConstants.ARBITRAGE_STOP_ALL_TOKEN],
    description: ArbitrageCliConstants.ARBITRAGE_STOP_ALL_DESCRIPTION
  })
  async stopAllArbitrages(): Promise<void> {
    try {
      await stopAllArbitrages();

      await println('Stopped all arbitrages gracefully');
    } catch (e) {
      println(`${e}`);
    }
  }

  @cliEntrypoint({
    tokens: [ArbitrageCliConstants.ARBITRAGE_STOP_ALL_FORCE_TOKEN],
    description: ArbitrageCliConstants.ARBITRAGE_STOP_ALL_FORCE_DESCRIPTION
  })
  async forceStopAllArbitrages(): Promise<void> {
    try {
      await stopAllArbitrages(true);

      await println('Stopped all arbitrages immediately');
    } catch (e) {
      println(`${e}`);
    }
  }
}
