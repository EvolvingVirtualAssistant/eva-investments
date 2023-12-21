import {
  BN,
  cliAdapter,
  cliEntrypoint,
  getAllCliEntrypointsByCliAdapter,
  println
} from '../../deps';
import { CliConstants } from '../../constants/cliConstants';
import { WalletsCliConstants } from '../constants/cliConstants';
import {
  approveToken,
  getAllTokensAllowances
} from '../domain/services/tokensService';
import { getAsyncWeb3Extension } from '../../appContext';
import { getAccountByAccountAddress } from '../domain/services/accountsService';
import {
  createAccount,
  recoverAccount
} from '../domain/services/walletsService';

@cliAdapter({
  tokens: [WalletsCliConstants.ADAPTER_TOKEN],
  description: WalletsCliConstants.ADAPTER_DESCRIPTION
})
export class WalletsCliAdapter {
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
      WalletsCliConstants.ADAPTER_TOKEN
    );
    await println(
      (errMsg || '') +
        WalletsCliConstants.HELP_COMMAND_TEMPLATE(
          WalletsCliConstants.USAGE,
          CliConstants.LIST_TEMPLATE(
            ...entrypoints.map((entry) => [
              CliConstants.OPTION_TEMPLATE(
                CliConstants.LIST_INLINE_TEMPLATE(
                  ...entry.tokens.map((t) => [t])
                ),
                entry.description
              )
            ])
          )
        )
    );
  }

  @cliEntrypoint({
    tokens: [WalletsCliConstants.ALLOWANCE_LIST_TOKENS_TOKEN],
    description: WalletsCliConstants.ALLOWANCE_LIST_TOKENS_DESCRIPTION
  })
  async listTokensAllowances(
    chainId: string,
    ownerAddress: string,
    nDays: number
  ): Promise<void> {
    try {
      const allowances = await getAllTokensAllowances(
        await getAsyncWeb3Extension(chainId),
        chainId,
        ownerAddress,
        nDays
      );

      const res = allowances
        .map(
          (tokenAllowance) =>
            `Token ${tokenAllowance.tokenAddress}:\n${tokenAllowance.allowances
              .map(
                (allowance) =>
                  `Current allowance ${allowance.amount} to ${allowance.toAddress}`
              )
              .join('\n')}`
        )
        .join('\n');

      println(
        `Allowances given by ${ownerAddress} on chain ${chainId} in the last ${nDays} ${
          nDays > 1 ? 'days' : 'day'
        }:\n${res}`
      );
    } catch (e) {
      println(`${e}`);
    }
  }

  @cliEntrypoint({
    tokens: [WalletsCliConstants.ALLOWANCE_APPROVE_TOKEN_TOKEN],
    description: WalletsCliConstants.ALLOWANCE_APPROVE_TOKEN_DESCRIPTION
  })
  async approveTokenAllowance(
    chainId: string,
    tokenAddress: string,
    ownerAddress: string,
    spenderAddress: string,
    amount: string,
    isWeth: boolean
  ): Promise<void> {
    try {
      const web3 = await getAsyncWeb3Extension(chainId);
      await approveToken(
        chainId,
        web3,
        getAccountByAccountAddress(chainId, ownerAddress),
        tokenAddress,
        spenderAddress,
        new BN(amount),
        isWeth
      );
    } catch (e) {
      println(`${e}`);
    }
  }

  @cliEntrypoint({
    tokens: [WalletsCliConstants.ALLOWANCE_REVOKE_TOKEN_TOKEN],
    description: WalletsCliConstants.ALLOWANCE_REVOKE_TOKEN_DESCRIPTION
  })
  async revokeTokenAllowance(
    chainId: string,
    tokenAddress: string,
    ownerAddress: string,
    spenderAddress: string,
    isWeth: boolean
  ): Promise<void> {
    try {
      const web3 = await getAsyncWeb3Extension(chainId);
      await approveToken(
        chainId,
        web3,
        getAccountByAccountAddress(chainId, ownerAddress),
        tokenAddress,
        spenderAddress,
        new BN(0),
        isWeth
      );
    } catch (e) {
      println(`${e}`);
    }
  }

  @cliEntrypoint({
    tokens: [WalletsCliConstants.CREATE_ACCOUNT_TOKEN],
    description: WalletsCliConstants.CREATE_ACCOUNT_TOKEN_DESCRIPTION
  })
  async createAccount(
    chainId: string,
    filePath: string,
    password: string
  ): Promise<void> {
    try {
      await createAccount(chainId, filePath, password);
    } catch (e) {
      println(`${e}`);
    }
  }

  @cliEntrypoint({
    tokens: [WalletsCliConstants.RECOVER_ACCOUNT_TOKEN],
    description: WalletsCliConstants.RECOVER_ACCOUNT_TOKEN_DESCRIPTION
  })
  async recoverAccount(
    chainId: string,
    mnemonic: string,
    derivationPath: string,
    filePath: string,
    password: string
  ): Promise<void> {
    try {
      await recoverAccount(
        chainId,
        mnemonic,
        derivationPath,
        filePath,
        password
      );
    } catch (e) {
      println(`${e}`);
    }
  }
}
