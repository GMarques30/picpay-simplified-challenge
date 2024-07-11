import { Account } from "../entity/Account";

export class MakeTransfer {
  static transfer(payer: Account, payee: Account, amount: number) {
    payer.withdraw(amount);
    payee.deposit(amount);
  }
}
