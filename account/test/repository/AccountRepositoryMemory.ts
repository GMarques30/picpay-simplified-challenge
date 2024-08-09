import {
  DatabaseConnection,
  InMemoryAdapter,
} from "./../../src/infra/database/DatabaseConnection";
import { AccountRepository } from "../../src/application/repository/AccountRepository";
import { Account } from "../../src/domain/entity/Account";

export class AccountRepositoryMemory implements AccountRepository {
  readonly connection: DatabaseConnection;
  readonly accounts: {
    id: string;
    name: string;
    email: string;
    password: string;
    document: string;
    balance: number;
  }[];

  constructor() {
    this.accounts = [];
    this.connection = new InMemoryAdapter();
  }

  private toPersistence(account: Account) {
    return {
      id: account.accountId,
      name: account.getName(),
      email: account.getEmail(),
      password: account.getPassword(),
      document: account.getDocument(),
      balance: account.getBalance(),
    };
  }

  private toDomain(raw: any): Account {
    return Account.restore(
      raw.id,
      raw.name,
      raw.email,
      raw.password,
      raw.document,
      raw.balance
    );
  }

  async save(account: Account): Promise<void> {
    this.accounts.push(this.toPersistence(account));
  }

  async update(account: Account): Promise<void> {
    const index = this.accounts.findIndex((a) => a.id === account.accountId);
    this.accounts[index] = this.toPersistence(account);
  }

  async getByEmail(email: string): Promise<Account | undefined> {
    const account = this.accounts.find((a) => a.email === email);
    return account ? this.toDomain(account) : undefined;
  }

  async getByDocument(document: string): Promise<Account | undefined> {
    const account = this.accounts.find((a) => a.document === document);
    return account ? this.toDomain(account) : undefined;
  }

  async getByAccountId(accountId: string): Promise<Account | undefined> {
    const account = this.accounts.find((a) => a.id === accountId);
    return account ? this.toDomain(account) : undefined;
  }
}
