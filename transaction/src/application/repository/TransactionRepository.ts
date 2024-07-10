import { Transaction } from "../../domain/entity/Transaction";

export interface TransactionRepository {
  save(transaction: Transaction): Promise<void>;
  getByTransactionId(transactionId: string): Promise<Transaction | undefined>;
}
