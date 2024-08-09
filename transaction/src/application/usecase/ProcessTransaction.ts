import { Transaction } from "../../domain/entity/Transaction";
import { TransactionApproved } from "../../domain/event/TransactionApproved";
import { TransactionRejected } from "../../domain/event/TransactionRejected";
import { AuthorizeGateway } from "../gateway/AuthorizeGateway";
import { Queue } from "../queue/Queue";
import { TransactionRepository } from "../repository/TransactionRepository";

export class ProcessTransaction {
  constructor(
    readonly transactionRepository: TransactionRepository,
    readonly authorizeGateway: AuthorizeGateway,
    readonly queue: Queue
  ) {}

  async execute({
    to,
    payerId,
    payeeId,
    amount,
    type,
  }: Input): Promise<Output> {
    const transaction = Transaction.create(payerId, payeeId, amount, type);
    const outputAuthorizeGateway = await this.authorizeGateway.authorize();
    if (outputAuthorizeGateway.status === "approved") {
      transaction.approve();
      const eventData = new TransactionApproved({
        to,
        transactionType: type,
        transactionStatus: transaction.getStatus(),
        amount,
      });
      this.queue.publish("transactionApproved", eventData.data);
    } else {
      transaction.reject();
      const eventData = new TransactionRejected({
        to,
        payerId,
        payeeId,
        transactionType: type,
        transactionStatus: transaction.getStatus(),
        amount,
      });
      this.queue.publish("transactionRejected", eventData.data);
    }
    await this.transactionRepository.save(transaction);
    return {
      transactionId: transaction.transactionId,
    };
  }
}

type Input = {
  to: string;
  payerId: string;
  payeeId: string;
  amount: number;
  type: string;
};

type Output = {
  transactionId: string;
};
