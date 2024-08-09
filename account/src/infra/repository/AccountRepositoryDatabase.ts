import { AccountRepository } from "../../application/repository/AccountRepository";
import { Account } from "../../domain/entity/Account";
import { DatabaseConnection } from "../database/DatabaseConnection";

export class AccountRepositoryDatabase implements AccountRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async save(account: Account): Promise<void> {
    await this.connection.query(
      "insert into picpay.account (account_id, name, email, password, document, balance) values ($1, $2, $3, $4, $5, $6)",
      [
        account.accountId,
        account.getName(),
        account.getEmail(),
        account.getPassword(),
        account.getDocument(),
        account.getBalance(),
      ]
    );
  }

  async update(account: Account): Promise<void> {
    await this.connection.query(
      "update picpay.account set name = $1, email = $2, password = $3, document = $4, balance = $5 where account_id = $6",
      [
        account.getName(),
        account.getEmail(),
        account.getPassword(),
        account.getDocument(),
        account.getBalance(),
        account.accountId,
      ],
      true
    );
  }

  async getByEmail(email: string): Promise<Account | undefined> {
    const [account] = await this.connection.query(
      "select * from picpay.account where email = $1",
      [email]
    );
    if (!account) return undefined;
    return Account.restore(
      account.account_id,
      account.name,
      account.email,
      account.password,
      account.document,
      parseFloat(account.balance)
    );
  }

  async getByDocument(document: string): Promise<Account | undefined> {
    const [account] = await this.connection.query(
      "select * from picpay.account where document = $1",
      [document]
    );
    if (!account) return undefined;
    return Account.restore(
      account.account_id,
      account.name,
      account.email,
      account.password,
      account.document,
      parseFloat(account.balance)
    );
  }

  async getByAccountId(accountId: string): Promise<Account | undefined> {
    const [account] = await this.connection.query(
      "select * from picpay.account where account_id = $1",
      [accountId]
    );
    if (!account) return undefined;
    return Account.restore(
      account.account_id,
      account.name,
      account.email,
      account.password,
      account.document,
      parseFloat(account.balance)
    );
  }
}
