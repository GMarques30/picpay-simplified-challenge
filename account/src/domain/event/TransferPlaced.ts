import { DomainEvent } from "./DomainEvent";

export class TransferPlaced implements DomainEvent {
  event = "transferPlaced";

  constructor(
    readonly data: {
      to: string;
      payerId: string;
      payeeId: string;
      amount: number;
      type: string;
    }
  ) {}
}
