import { NotificationGateway } from "../gateway/NotificationGateway";
import { Retry } from "../retry/Retry";

export class SendNotification {
  constructor(
    readonly notificationGateway: NotificationGateway,
    readonly retry: Retry
  ) {}

  async execute({
    to,
    transactionType,
    transactionStatus,
    amount,
  }: Input): Promise<void> {
    this.retry.retry(
      async () =>
        await this.notificationGateway.notify({
          to,
          transactionType,
          transactionStatus,
          amount,
        })
    );
  }
}

type Input = {
  to: string;
  transactionType: string;
  transactionStatus: string;
  amount: number;
};
