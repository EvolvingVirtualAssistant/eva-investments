import { ACCOUNTS_KEY } from '../../constants/walletsConstants';
import { FSWatcher, logWarn, pathJoin, ROOT_PATH } from '../../../deps';
import { Account } from '../../domain/entities/accounts';
import { AccountsRepository } from '../repositories/accountsRepository';
import { watchFile } from '../../../utils/filesystemWatcher';
import { getObjFromJson, readTextFile } from '../../../utils/files';
import NoAccountsProvidedError from './errors/noAccountsProvidedError';
import { isType } from '../../../utils/typeGuards';

type AccountsByChainId = {
  chainId: number;
  accounts: Account[];
};

export class AccountsConfigFileAdapter implements AccountsRepository {
  private static instance: AccountsConfigFileAdapter;

  private _accounts: AccountsByChainId[];
  private _refreshAccounts: boolean; // May be a good idea to have this outside of the adapter and let whoever wants decide how to use it
  private _accountsFileWatcher?: FSWatcher;

  private constructor() {
    this._accounts = [];
    this._refreshAccounts = true;
  }

  static getInstance(): AccountsConfigFileAdapter {
    if (!AccountsConfigFileAdapter.instance) {
      AccountsConfigFileAdapter.instance = new AccountsConfigFileAdapter();
    }

    return AccountsConfigFileAdapter.instance;
  }

  getAccounts(chainId: number): Account[] {
    try {
      if (this._refreshAccounts) {
        try {
          this._accounts = getObjFromJson(
            ACCOUNTS_KEY,
            ROOT_PATH,
            buildAccounts,
            accountsValidation
          );
        } catch (e) {
          throw new NoAccountsProvidedError(
            pathJoin(ROOT_PATH, process.env[ACCOUNTS_KEY] || '')
          );
        }

        this._refreshAccounts = false;
      }

      if (this._accountsFileWatcher == null) {
        if (process.env[ACCOUNTS_KEY] == null) {
          throw new Error('Environment variable for accounts is missing');
        }

        this._accountsFileWatcher = watchFile(
          pathJoin(ROOT_PATH, process.env[ACCOUNTS_KEY] || ''),
          () => (this._refreshAccounts = true)
        );
      }

      return (
        this._accounts.find(
          (accountsByChainId) => accountsByChainId.chainId === chainId
        )?.accounts || []
      );
    } catch (e) {
      logWarn('Error in AccountsConfigFileAdapter - getAccounts: ' + e);
    }

    return [];
  }

  getAccount(chainId: number, address: string): Account | undefined {
    return this._accounts
      .find((accountsByChainId) => accountsByChainId.chainId === chainId)
      ?.accounts.find((acc) => acc.address === address);
  }
}

const accountsValidation = (accounts: unknown): void => {
  if (!Array.isArray(accounts)) {
    throw new Error(
      'Unable to retrieve a collection of accounts from json file'
    );
  }
};

const buildAccounts = (accounts: unknown[]): AccountsByChainId[] => {
  return accounts.map(buildAccountsByChainId);
};

const buildAccountsByChainId = (obj: any): AccountsByChainId => {
  if (!isAccountsByChainId(obj)) {
    throw new Error(
      `There was an error building accounts by chainId from ${JSON.stringify(
        obj
      )}`
    );
  }

  return {
    ...(obj as AccountsByChainId),
    accounts: Object.values((obj as AccountsByChainId).accounts).map(
      buildAccount
    )
  };
};

const buildAccount = (obj: any): Account => {
  if (!isAccount(obj)) {
    throw new Error(
      `There was an error building account from ${JSON.stringify(obj)}`
    );
  }

  const account: Account = obj as Account;

  const privateKeyPath: string = pathJoin(ROOT_PATH, account.privateKeyPath);

  const privateKey = readTextFile(privateKeyPath);

  return { ...account, privateKey };
};

const isAccountsByChainId = (obj: any): boolean => {
  return (
    isType(obj, ['chainId', 'accounts'], []) &&
    (obj as AccountsByChainId).chainId != null &&
    !isNaN(Number((obj as AccountsByChainId).chainId)) &&
    (obj as AccountsByChainId).accounts != null
  );
};

const isAccount = (obj: any): boolean => {
  return isType(obj, ['address', 'privateKeyPath'], []);
};
