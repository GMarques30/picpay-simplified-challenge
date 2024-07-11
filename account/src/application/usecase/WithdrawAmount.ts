import { AccountRepository } from "../repository/AccountRepository";

export class WithdrawAmount {
  constructor(readonly accountRepository: AccountRepository) {}

  async execute({ accountId, amount }: Input): Promise<void> {
    const account = await this.accountRepository.getByAccountId(accountId);
    if (!account) throw new Error("Account not found");
    account.withdraw(amount);
    // const transaction = Transaction.create(
    //   account.accountId,
    //   account.accountId,
    //   amount,
    //   "withdraw"
    // );

    // const transaction = Transaction.create(
    //   account.accountId,
    //   account.accountId,
    //   amount,
    //   "deposit"
    // );

    //Envio um evento de dominio chamado withdraw completed
    await this.accountRepository.update(account);
    // return {
    //   transactionId: transaction.transactionId,
    // };
  }
}

type Input = {
  accountId: string;
  amount: number;
};

// type Output = {
//   transactionId: string;
// };
