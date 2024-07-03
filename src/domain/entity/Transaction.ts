import {
  TransactionFactory,
  TransactionStatus,
} from "../value-object/TransactionStatus";

export class Transaction {
  readonly transactionId: string;
  readonly payerId: string;
  readonly payeeId: string;
  readonly amount: number;
  readonly status: TransactionStatus;
  readonly occuredAt: Date;

  private constructor(
    transactionId: string,
    payerId: string,
    payeeId: string,
    amount: number,
    status: string,
    occuredAt: Date
  ) {
    this.transactionId = transactionId;
    this.payerId = payerId;
    this.payeeId = payeeId;
    this.amount = amount;
    this.status = TransactionFactory.create(status);
    this.occuredAt = occuredAt;
  }

  getStatus() {
    return this.status.value;
  }

  static create(
    payerId: string,
    payeeId: string,
    amount: number,
    status: string
  ) {
    const transactionId = crypto.randomUUID();
    const occuredAt = new Date();
    return new Transaction(
      transactionId,
      payerId,
      payeeId,
      amount,
      status,
      occuredAt
    );
  }

  static restore(
    transactionId: string,
    payerId: string,
    payeeId: string,
    amount: number,
    status: string,
    occuredAt: string
  ) {
    return new Transaction(
      transactionId,
      payerId,
      payeeId,
      amount,
      status,
      new Date(occuredAt)
    );
  }
}
