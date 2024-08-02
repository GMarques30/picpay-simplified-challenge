import { UndoTransfer } from "../../domain/service/UndoTransfer";
import { AccountRepository } from "../repository/AccountRepository";

export class CancelTransfer {
  constructor(readonly accountRepository: AccountRepository) {}

  async execute({ payerId, payeeId, amount }: Input): Promise<void> {
    const payerAccount = await this.accountRepository.getByAccountId(payerId);
    const payeeAccount = await this.accountRepository.getByAccountId(payeeId);
    if (!payerAccount || !payeeAccount) throw new Error("Account not found");
    UndoTransfer.transfer(payerAccount, payeeAccount, amount);
    await this.accountRepository.update(payerAccount);
    await this.accountRepository.update(payeeAccount);
  }
}

type Input = {
  payerId: string;
  payeeId: string;
  amount: number;
};
