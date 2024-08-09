import { Account } from "../../domain/entity/Account";
import { DatabaseConnection } from "../../infra/database/DatabaseConnection";

export interface AccountRepository {
  connection: DatabaseConnection;
  save(account: Account): Promise<void>;
  update(account: Account): Promise<void>;
  getByEmail(email: string): Promise<Account | undefined>;
  getByDocument(document: string): Promise<Account | undefined>;
  getByAccountId(accountId: string): Promise<Account | undefined>;
}
