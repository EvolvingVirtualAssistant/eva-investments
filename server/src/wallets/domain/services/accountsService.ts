import { getAccountsRepository } from '../../../appContext';
import { Account } from '../entities/accounts';
import AccountNotFoundError from './errors/accountNotFoundError';

export const getAccountByAccountAddress = (
  chainId: string,
  address: string
): Account => {
  const account = getAccountsRepository().getAccount(chainId, address);
  if (!account) {
    throw new AccountNotFoundError(chainId, address);
  }
  return account;
};

export const getAccounts = (chainId: string): Account[] =>
  getAccountsRepository().getAccounts(chainId);
