import { Queue } from "../../application/queue/Queue";
import { ProcessTransaction } from "../../application/usecase/ProcessTransaction";

export class QueueController {
  constructor(queue: Queue, processTransaction: ProcessTransaction) {
    queue.consume("depositPlaced.processTransaction", async (input: Input) => {
      await processTransaction.execute(input);
    });

    queue.consume("withdrawPlaced.processTransaction", async (input: Input) => {
      await processTransaction.execute(input);
    });

    queue.consume("transferPlaced.processTransaction", async (input: Input) => {
      await processTransaction.execute(input);
    });
  }
}

type Input = {
  to: string;
  payerId: string;
  payeeId: string;
  type: string;
  amount: number;
};
