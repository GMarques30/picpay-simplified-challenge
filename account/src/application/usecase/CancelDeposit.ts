import { AccountRepository } from "../repository/AccountRepository";

export class CancelDeposit {
  constructor(readonly accountRepository: AccountRepository) {}

  async execute({ payerId, amount }: Input): Promise<void> {
    const account = await this.accountRepository.getByAccountId(payerId);
    if (!account) throw new Error("Account not found");
    account.withdraw(amount);
    await this.accountRepository.update(account);
  }
}

type Input = {
  payerId: string;
  amount: number;
};
