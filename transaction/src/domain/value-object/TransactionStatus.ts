import { Transaction } from "../entity/Transaction";

export abstract class TransactionStatus {
  abstract value: string;

  constructor(readonly transaction: Transaction) {}

  abstract approve(): void;
  abstract reject(): void;
}

export class PendingStatus extends TransactionStatus {
  value: string;

  constructor(readonly transaction: Transaction) {
    super(transaction);
    this.value = "pending";
  }

  approve(): void {
    this.transaction.status = new ApprovedStatus(this.transaction);
  }

  reject(): void {
    this.transaction.status = new RejectedStatus(this.transaction);
  }
}

export class ApprovedStatus extends TransactionStatus {
  value: string;

  constructor(readonly transaction: Transaction) {
    super(transaction);
    this.value = "approved";
  }

  approve(): void {
    throw new Error("Invalid status");
  }

  reject(): void {
    throw new Error("Invalid status");
  }
}

export class RejectedStatus extends TransactionStatus {
  value: string;

  constructor(readonly transaction: Transaction) {
    super(transaction);
    this.value = "rejected";
  }

  approve(): void {
    throw new Error("Invalid status");
  }

  reject(): void {
    throw new Error("Invalid status");
  }
}

export class TransactionStatusFactory {
  static create(transaction: Transaction, status: string) {
    if (status === "pending") return new PendingStatus(transaction);
    if (status === "approved") return new ApprovedStatus(transaction);
    if (status === "rejected") return new RejectedStatus(transaction);
    throw new Error("Invalid status");
  }
}
