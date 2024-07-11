import { Transaction } from "../../domain/entity/Transaction";
import { TransactionRepository } from "../repository/TransactionRepository";

export class CreateTransaction {
  constructor(readonly transactionRepository: TransactionRepository) {}

  async execute({ payerId, payeeId, amount, type }: Input): Promise<Output> {
    const transaction = Transaction.create(payerId, payeeId, amount, type);
    await this.transactionRepository.save(transaction);
    return {
      transactionId: transaction.transactionId,
    };
  }
}

type Input = {
  payerId: string;
  payeeId: string;
  amount: number;
  type: string;
};

type Output = {
  transactionId: string;
};
