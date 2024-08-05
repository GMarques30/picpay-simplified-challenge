import {
  TransactionStatus,
  TransactionStatusFactory,
} from "../value-object/TransactionStatus";
import {
  TransactionType,
  TransactionTypeFactory,
} from "../value-object/TransactionType";

export class Transaction {
  readonly type: TransactionType;
  status: TransactionStatus;

  private constructor(
    readonly transactionId: string,
    readonly payerId: string,
    readonly payeeId: string,
    readonly amount: number,
    type: string,
    status: string,
    readonly occuredAt: Date
  ) {
    this.type = TransactionTypeFactory.create(type);
    this.status = TransactionStatusFactory.create(this, status);
  }

  approve() {
    this.status.approve();
  }

  reject() {
    this.status.reject();
  }

  getType() {
    return this.type.value;
  }

  getStatus() {
    return this.status.value;
  }

  static create(
    payerId: string,
    payeeId: string,
    amount: number,
    type: string
  ) {
    const transactionId = crypto.randomUUID();
    const status = "pending";
    const occuredAt = new Date();
    return new Transaction(
      transactionId,
      payerId,
      payeeId,
      amount,
      type,
      status,
      occuredAt
    );
  }

  static restore(
    transactionId: string,
    payerId: string,
    payeeId: string,
    amount: number,
    type: string,
    status: string,
    occuredAt: Date
  ) {
    return new Transaction(
      transactionId,
      payerId,
      payeeId,
      amount,
      type,
      status,
      new Date(occuredAt)
    );
  }
}
