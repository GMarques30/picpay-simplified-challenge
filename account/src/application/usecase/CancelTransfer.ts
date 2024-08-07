import { Transfer } from "../../domain/service/Transfer";
import { AccountRepository } from "../repository/AccountRepository";

export class CancelTransfer {
  constructor(readonly accountRepository: AccountRepository) {}

  async execute({ payerId, payeeId, amount }: Input): Promise<void> {
    const payerAccount = await this.accountRepository.getByAccountId(payerId);
    const payeeAccount = await this.accountRepository.getByAccountId(payeeId);
    if (!payerAccount || !payeeAccount) throw new Error("Account not found");
    new Transfer(payerAccount, payeeAccount, amount).undo();
    await this.accountRepository.update(payerAccount);
    await this.accountRepository.update(payeeAccount);
    await this.accountRepository.connection.commit();
  }
}

type Input = {
  payerId: string;
  payeeId: string;
  amount: number;
};
