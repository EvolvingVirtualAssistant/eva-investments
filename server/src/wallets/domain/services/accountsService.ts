import { getAccountsRepository } from '../../../appContext';
import { Account } from '../entities/accounts';
import AccountNotFoundError from './errors/accountNotFoundError';

export const getAccountByAccountAddress = async (
  address: string
): Promise<Account> => {
  const accountRepository = await getAccountsRepository();

  const account = accountRepository.getAccount(address);
  if (!account) {
    throw new AccountNotFoundError(address);
  }
  return account;
};

export const getAccounts = async (): Promise<Account[]> => {
  const accountRepository = await getAccountsRepository();

  return accountRepository.getAccounts();
};
