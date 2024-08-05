import { Account } from "../entity/Account";
import { Command } from "./Command";

export class Transfer implements Command {
  constructor(
    readonly payer: Account,
    readonly payee: Account,
    readonly amount: number
  ) {}

  execute(): void {
    this.payer.withdraw(this.amount);
    this.payee.deposit(this.amount);
  }

  undo(): void {
    this.payee.withdraw(this.amount);
    this.payer.deposit(this.amount);
  }
}
