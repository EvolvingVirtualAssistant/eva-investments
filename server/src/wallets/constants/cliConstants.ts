import { taggedTemplate } from '../../constants/cliConstants';

export const WalletsCliConstants = {
  USAGE: 'wallets [COMMAND]',
  HELP_COMMAND_TEMPLATE: taggedTemplate`\nUsage:\n\t${0}\n\nOptions:\n${1}\n\nRun 'wallets --help' for more information on the wallets command.\n`,
  ADAPTER_TOKEN: 'wallets',
  ADAPTER_DESCRIPTION: 'Wallets related operations',
  ALLOWANCE_LIST_TOKENS_TOKEN: 'list_allowances',
  ALLOWANCE_LIST_TOKENS_DESCRIPTION:
    'Lists all the token allowances in chain(1) by ownerAddress(2), in the last (3) days',
  ALLOWANCE_APPROVE_TOKEN_TOKEN: 'approve_allowance',
  ALLOWANCE_APPROVE_TOKEN_DESCRIPTION:
    'Approve token allowance in chain(1), for tokenAddress(2), given by ownerAddress(3) to spenderAddress(4) in the amount(5)',
  ALLOWANCE_REVOKE_TOKEN_TOKEN: 'revoke_allowance',
  ALLOWANCE_REVOKE_TOKEN_DESCRIPTION:
    'Revoke token allowance in chain(1), for tokenAddress(2), given by ownerAddress(3) to spenderAddress(4)',
  CREATE_ACCOUNT_TOKEN: 'create_account',
  CREATE_ACCOUNT_TOKEN_DESCRIPTION:
    'Creates an account in chain(1), and stores in path(2), encrypting it using password(3)',
  RECOVER_ACCOUNT_TOKEN: 'recover_account',
  RECOVER_ACCOUNT_TOKEN_DESCRIPTION:
    'Recovers an account in chain(1), using mnemonic(2) and derivationPath(3), and storing it in path(4), encrypted using password(5)'
} as const;
