import { Account } from '../../domain/entities/accounts';

export interface AccountsRepository {
  getAccounts(chainId: number): Account[];
  getAccount(chainId: number, address: string): Account | undefined;
}
