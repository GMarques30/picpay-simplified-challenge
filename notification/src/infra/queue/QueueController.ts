import { Queue } from "../../application/queue/Queue";
import { SendNotification } from "../../application/usecase/SendNotification";

export class QueueController {
  constructor(
    readonly queue: Queue,
    readonly sendNotification: SendNotification
  ) {
    queue.consume(
      "transactionApproved.sendNotification",
      async (input: Input) => {
        await sendNotification.execute(input);
      }
    );

    queue.consume(
      "transactionRejected.sendNotification",
      async (input: Input) => {
        await sendNotification.execute(input);
      }
    );
  }
}

type Input = {
  to: string;
  transactionType: string;
  transactionStatus: string;
  amount: number;
};
