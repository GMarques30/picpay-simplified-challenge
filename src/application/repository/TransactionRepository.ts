import { Transaction } from "../../domain/entity/Transaction";

export interface TransactionRepository {
  saveTransaction(transaction: Transaction): Promise<void>;
}
