import { Account } from '../../domain/entities/accounts';

export interface AccountsRepository {
  getAccounts(chainId: string): Account[];
  getAccount(chainId: string, address: string): Account | undefined;
}
