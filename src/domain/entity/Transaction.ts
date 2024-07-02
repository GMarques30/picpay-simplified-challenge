export class Transaction {
  readonly transactionId: string;
  readonly payerId: string;
  readonly payeeId: string;
  readonly amount: number;
  readonly occuredAt: Date;

  private constructor(
    transactionId: string,
    payerId: string,
    payeeId: string,
    amount: number,
    occuredAt: Date
  ) {
    this.transactionId = transactionId;
    this.payerId = payerId;
    this.payeeId = payeeId;
    this.amount = amount;
    this.occuredAt = occuredAt;
  }

  static create(payerId: string, payeeId: string, amount: number) {
    const transactionId = crypto.randomUUID();
    const occuredAt = new Date();
    return new Transaction(transactionId, payerId, payeeId, amount, occuredAt);
  }

  static restore(
    transactionId: string,
    payerId: string,
    payeeId: string,
    amount: number,
    occuredAt: string
  ) {
    return new Transaction(
      transactionId,
      payerId,
      payeeId,
      amount,
      new Date(occuredAt)
    );
  }
}
