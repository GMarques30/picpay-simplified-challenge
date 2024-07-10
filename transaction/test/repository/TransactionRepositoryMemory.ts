import { TransactionRepository } from "../../src/application/repository/TransactionRepository";
import { Transaction } from "../../src/domain/entity/Transaction";

export class TransactionRepositoryMemory implements TransactionRepository {
  transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  async save(transaction: Transaction): Promise<void> {
    this.transactions.push(transaction);
  }

  async getByTransactionId(
    transactionId: string
  ): Promise<Transaction | undefined> {
    const transaction = this.transactions.find(
      (transaction) => transaction.transactionId === transactionId
    );
    return transaction;
  }
}