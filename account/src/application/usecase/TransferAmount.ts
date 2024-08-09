import { AccountRepository } from "./../repository/AccountRepository";
import { Queue } from "../queue/Queue";
import { Transfer } from "../../domain/service/Transfer";
import { DomainEvent } from "../../domain/event/DomainEvent";

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
    const transfer = new Transfer(payerAccount, payeeAccount, amount);
    transfer.register("transferPlaced", async (event: DomainEvent) => {
      await this.queue.publish(event.event, event.data);
    });
    transfer.execute();
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
