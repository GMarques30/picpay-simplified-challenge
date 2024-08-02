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
    readonly occuredAt: Date
  ) {
    this.transactionId = transactionId;
    this.payerId = payerId;
    this.payeeId = payeeId;
    this.amount = amount;
    this.type = TransactionTypeFactory.create(type);
    this.status = TransactionStatusFactory.create(this, "pending");
    this.occuredAt = occuredAt;
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
}
