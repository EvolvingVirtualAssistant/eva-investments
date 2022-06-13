import { Account } from '../../domain/entities/accounts';

export interface AccountsRepository {
  getAccounts(): Account[];
  getAccount(address: string): Account | undefined;
}
