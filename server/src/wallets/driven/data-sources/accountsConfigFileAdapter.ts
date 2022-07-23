import { ACCOUNTS_KEY } from '../../constants/walletsConstants';
import { FSWatcher, pathJoin, ROOT_PATH } from '../../../deps';
import { Account } from '../../domain/entities/accounts';
import { AccountsRepository } from '../repositories/accountsRepository';
import { watchFile } from '../../../utils/filesystemWatcher';
import { getObjFromJson, readTextFile } from '../../../utils/files';
import NoAccountsProvidedError from './errors/noAccountsProvidedError';
import { isType } from '../../../utils/typeGuards';

export class AccountsConfigFileAdapter implements AccountsRepository {
  private static instance: AccountsConfigFileAdapter;

  private _accounts: Account[];
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

  getAccounts(): Account[] {
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

      return this._accounts;
    } catch (e) {
      console.log('Error in AccountsConfigFileAdapter - getAccounts: ' + e);
    }

    return [];
  }

  getAccount(address: string): Account | undefined {
    return this._accounts.find((acc) => acc.address === address);
  }
}

const accountsValidation = (accounts: unknown): void => {
  if (!accounts) {
    throw new Error();
  }
};

const buildAccounts = (accounts: unknown[]): Account[] => {
  return Object.values(accounts).map(buildAccount);
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

const isAccount = (obj: any): boolean => {
  return isType(obj, ['address', 'privateKeyPath'], []);
};
