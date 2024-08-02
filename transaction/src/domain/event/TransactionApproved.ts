import { DomainEvent } from "./DomainEvent";

export class TransactionApproved implements DomainEvent {
  event = "transactionApproved";

  constructor(
    readonly data: {
      to: string;
      transactionType: string;
      transactionStatus: string;
      amount: number;
    }
  ) {}
}
