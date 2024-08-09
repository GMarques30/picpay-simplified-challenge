import { DomainEvent } from "../../domain/event/DomainEvent";
import { Queue } from "../queue/Queue";
import { AccountRepository } from "./../repository/AccountRepository";

export class DepositAmount {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly queue: Queue
  ) {}

  async execute({ accountId, amount }: Input): Promise<void> {
    const account = await this.accountRepository.getByAccountId(accountId);
    if (!account) throw new Error("Account not found");
    account.register("depositPlaced", async (event: DomainEvent) => {
      await this.queue.publish(event.event, event.data);
    });
    account.deposit(amount);
    await this.accountRepository.update(account);
  }
}

type Input = {
  accountId: string;
  amount: number;
};
