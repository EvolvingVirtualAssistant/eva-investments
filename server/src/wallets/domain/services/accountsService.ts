import { getAccountsRepository } from '../../../appContext';
import { Account } from '../entities/accounts';
import AccountNotFoundError from './errors/accountNotFoundError';

export const getAccountByAccountAddress = (address: string): Account => {
  const account = getAccountsRepository().getAccount(address);
  if (!account) {
    throw new AccountNotFoundError(address);
  }
  return account;
};

export const getAccounts = (): Account[] =>
  getAccountsRepository().getAccounts();
