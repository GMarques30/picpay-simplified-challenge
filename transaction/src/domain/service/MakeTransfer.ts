import { Wallet } from "../entity/Wallet";

export class MakeTransfer {
  static transfer(payer: Wallet, payee: Wallet, amount: number) {
    payer.withdraw(amount);
    payee.deposit(amount);
  }
}
