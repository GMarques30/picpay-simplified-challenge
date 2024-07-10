import { TransactionRepository } from "../repository/TransactionRepository";

export class GetTransaction {
  constructor(readonly transactionRepository: TransactionRepository) {}

  async execute({ transactionId }: Input): Promise<Output> {
    const transaction = await this.transactionRepository.getByTransactionId(
      transactionId
    );
    if (!transaction) throw new Error("Transaction not found");
    return {
      transactionId: transaction.transactionId,
      payerId: transaction.payerId,
      payeeId: transaction.payeeId,
      amount: transaction.amount,
      status: transaction.getStatus(),
      occuredAt: transaction.occuredAt,
    };
  }
}

type Input = {
  transactionId: string;
};

type Output = {
  transactionId: string;
  payerId: string;
  payeeId: string;
  amount: number;
  status: string;
  occuredAt: Date;
};
