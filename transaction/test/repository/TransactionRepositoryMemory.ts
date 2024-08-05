import { TransactionRepository } from "../../src/application/repository/TransactionRepository";
import { Transaction } from "../../src/domain/entity/Transaction";

export class TransactionRepositoryMemory implements TransactionRepository {
  readonly transactions: {
    id: string;
    payerId: string;
    payeeId: string;
    amount: number;
    type: string;
    status: string;
    occuredAt: Date;
  }[];

  constructor() {
    this.transactions = [];
  }

  private toPersistence(transaction: Transaction) {
    return {
      id: transaction.transactionId,
      payerId: transaction.payerId,
      payeeId: transaction.payeeId,
      amount: transaction.amount,
      type: transaction.getType(),
      status: transaction.getStatus(),
      occuredAt: transaction.occuredAt,
    };
  }

  private toDomain(raw: any): Transaction {
    return Transaction.restore(
      raw.id,
      raw.payerId,
      raw.payeeId,
      raw.amount,
      raw.type,
      raw.status,
      raw.occuredAt
    );
  }

  async save(transaction: Transaction): Promise<void> {
    this.transactions.push(this.toPersistence(transaction));
  }

  async getByTransactionId(
    transactionId: string
  ): Promise<Transaction | undefined> {
    const transaction = this.transactions.find((t) => t.id === transactionId);
    return transaction ? this.toDomain(transaction) : undefined;
  }
}
