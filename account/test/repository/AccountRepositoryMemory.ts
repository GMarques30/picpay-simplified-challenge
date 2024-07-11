import { AccountRepository } from "../../src/application/repository/AccountRepository";
import { Account } from "../../src/domain/entity/Account";

export class AccountRepositoryMemory implements AccountRepository {
  accounts: Account[];

  constructor() {
    this.accounts = [];
  }

  async save(account: Account): Promise<void> {
    this.accounts.push(account);
  }

  async update(account: Account): Promise<void> {
    const index = this.accounts.findIndex(
      (acc) => acc.accountId === account.accountId
    );
    this.accounts[index] = account;
  }

  async getByEmail(email: string): Promise<Account | undefined> {
    return this.accounts.find((account) => account.getEmail() === email);
  }

  async getByDocument(document: string): Promise<Account | undefined> {
    return this.accounts.find((account) => account.getDocument() === document);
  }

  async getByAccountId(accountId: string): Promise<Account | undefined> {
    return this.accounts.find((account) => account.accountId === accountId);
  }
}
