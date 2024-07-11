import { AccountRepository } from "./../repository/AccountRepository";

export class DepositAmount {
  constructor(readonly accountRepository: AccountRepository) {}

  async execute({ accountId, amount }: Input): Promise<void> {
    const account = await this.accountRepository.getByAccountId(accountId);
    if (!account) throw new Error("Account not found");
    account.deposit(amount);
    // const transaction = Transaction.create(
    //   account.accountId,
    //   account.accountId,
    //   amount,
    //   "deposit"
    // );

    //Envio um evento de dominio chamado deposit completed
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
