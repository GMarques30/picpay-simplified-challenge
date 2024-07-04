import { Account } from "../../domain/entity/Account";

export interface AccountRepository {
  save(account: Account): Promise<void>;
  getByEmail(email: string): Promise<Account | undefined>;
  getByDocument(document: string): Promise<Account | undefined>;
  getByAccountId(accountId: string): Promise<Account | undefined>;
  checkIfAccountIsCustomer(accountId: string): Promise<boolean>;
}
