import { AccountRepository } from "./../repository/AccountRepository";
import { Queue } from "../queue/queue";
import { TransferPlaced } from "../../domain/event/TransferPlaced";
import { Transfer } from "../../domain/service/Transfer";

export class TransferAmount {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly queue: Queue
  ) {}

  async execute({ payerId, payeeId, amount }: Input): Promise<void> {
    const payerAccount = await this.accountRepository.getByAccountId(payerId);
    const payeeAccount = await this.accountRepository.getByAccountId(payeeId);
    if (!payerAccount || !payeeAccount) throw new Error("Account not found");
    const CPF_LENGTH = 11;
    if (payerAccount.getDocument().length !== CPF_LENGTH)
      throw new Error("Sellers cannot make transfers");
    new Transfer(payerAccount, payeeAccount, amount).execute();
    const eventData = new TransferPlaced({
      to: payerAccount.getEmail(),
      payerId,
      payeeId,
      amount,
      type: "transfer",
    });
    await this.queue.publish("transferPlaced", eventData.data);
    await this.accountRepository.update(payerAccount);
    await this.accountRepository.update(payeeAccount);
  }
}

type Input = {
  payerId: string;
  payeeId: string;
  amount: number;
};
