import { Account } from "../entity/Account";

export class UndoTransfer {
  static transfer(payer: Account, payee: Account, amount: number) {
    payer.deposit(amount);
    payee.withdraw(amount);
  }
}
