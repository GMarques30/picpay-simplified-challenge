import { DomainEvent } from "./DomainEvent";

export class DepositPlaced implements DomainEvent {
  event = "depositPlaced";

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
