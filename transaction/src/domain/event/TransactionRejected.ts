import { DomainEvent } from "./DomainEvent";

export class TransactionRejected implements DomainEvent {
  event = "transactionRejected";

  constructor(
    readonly data: {
      to: string;
      payerId: string;
      payeeId: string;
      transactionType: string;
      transactionStatus: string;
      amount: number;
    }
  ) {}
}
