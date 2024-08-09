import { TransactionRepository } from "../../application/repository/TransactionRepository";
import { Transaction } from "../../domain/entity/Transaction";
import { DatabaseConnection } from "../database/DatabaseConnection";

export class TransactionRepositoryDatabase implements TransactionRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async save(transaction: Transaction): Promise<void> {
    await this.connection.query(
      "insert into picpay.transaction (transaction_id, payer_id, payee_id, amount, type, status, occured_at) values ($1, $2, $3, $4, $5, $6, $7)",
      [
        transaction.transactionId,
        transaction.payerId,
        transaction.payeeId,
        transaction.amount,
        transaction.getType(),
        transaction.getStatus(),
        transaction.occuredAt,
      ]
    );
  }

  async getByTransactionId(
    transactionId: string
  ): Promise<Transaction | undefined> {
    const [transaction] = await this.connection.query(
      "select * from picpay.transaction where transaction_id = $1",
      [transactionId]
    );
    if (!transaction) return undefined;
    return Transaction.restore(
      transaction.trasanction_id,
      transaction.payer_id,
      transaction.payee_id,
      parseFloat(transaction.amount),
      transaction.type,
      transaction.status,
      transaction.occured_at
    );
  }
}
