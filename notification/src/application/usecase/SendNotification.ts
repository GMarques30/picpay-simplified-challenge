import { NotificationGateway } from "../gateway/NotificationGateway";

export class SendNotification {
  constructor(readonly notificationGateway: NotificationGateway) {}

  async execute({
    to,
    transactionType,
    transactionStatus,
    amount,
  }: Input): Promise<void> {
    await this.notificationGateway.notify({
      to,
      transactionType,
      transactionStatus,
      amount,
    });
  }
}

type Input = {
  to: string;
  transactionType: string;
  transactionStatus: string;
  amount: number;
};
