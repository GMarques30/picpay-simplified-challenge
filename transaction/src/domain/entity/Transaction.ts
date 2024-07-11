import {
  TransactionFactory,
  TransactionType,
} from "../value-object/TransactionType";

export class Transaction {
  readonly transactionId: string;
  readonly payerId: string;
  readonly payeeId: string;
  readonly amount: number;
  readonly type: TransactionType;
  readonly occuredAt: Date;

  private constructor(
    transactionId: string,
    payerId: string,
    payeeId: string,
    amount: number,
    type: string,
    occuredAt: Date
  ) {
    this.transactionId = transactionId;
    this.payerId = payerId;
    this.payeeId = payeeId;
    this.amount = amount;
    this.type = TransactionFactory.create(type);
    this.occuredAt = occuredAt;
  }

  getStatus() {
    return this.type.value;
  }

  static create(
    payerId: string,
    payeeId: string,
    amount: number,
    type: string
  ) {
    const transactionId = crypto.randomUUID();
    const occuredAt = new Date();
    return new Transaction(
      transactionId,
      payerId,
      payeeId,
      amount,
      type,
      occuredAt
    );
  }

  static restore(
    transactionId: string,
    payerId: string,
    payeeId: string,
    amount: number,
    type: string,
    occuredAt: string
  ) {
    return new Transaction(
      transactionId,
      payerId,
      payeeId,
      amount,
      type,
      new Date(occuredAt)
    );
  }
}
