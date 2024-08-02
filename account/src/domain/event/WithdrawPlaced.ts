import { DomainEvent } from "./DomainEvent";

export class WithdrawPlaced implements DomainEvent {
  event = "withdrawPlaced";

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
