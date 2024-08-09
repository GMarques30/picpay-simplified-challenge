import { Account } from "../entity/Account";
import { TransferPlaced } from "../event/TransferPlaced";
import { Observable } from "../observer/Observable";
import { Command } from "./Command";

export class Transfer extends Observable implements Command {
  constructor(
    readonly payer: Account,
    readonly payee: Account,
    readonly amount: number
  ) {
    super();
  }

  execute(): void {
    this.payer.withdraw(this.amount);
    this.payee.deposit(this.amount);
    this.notify(
      new TransferPlaced({
        to: this.payer.getEmail(),
        payerId: this.payer.accountId,
        payeeId: this.payee.accountId,
        amount: this.amount,
        type: "transfer",
      })
    );
  }

  undo(): void {
    this.payee.withdraw(this.amount);
    this.payer.deposit(this.amount);
  }
}
