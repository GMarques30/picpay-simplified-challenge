import { Queue } from "../../application/queue/queue";
import { ProcessTransaction } from "../../application/usecase/ProcessTransaction";

export class QueueController {
  constructor(queue: Queue, processTransaction: ProcessTransaction) {
    queue.consume(
      "depositPlaced.processTransaction",
      async (input: {
        to: string;
        payerId: string;
        payeeId: string;
        type: string;
        amount: number;
      }) => {
        await processTransaction.execute(input);
      }
    );

    queue.consume(
      "withdrawPlaced.processTransaction",
      async (input: {
        to: string;
        payerId: string;
        payeeId: string;
        type: string;
        amount: number;
      }) => {
        await processTransaction.execute(input);
      }
    );

    queue.consume(
      "transferPlaced.processTransaction",
      async (input: {
        to: string;
        payerId: string;
        payeeId: string;
        type: string;
        amount: number;
      }) => {
        await processTransaction.execute(input);
      }
    );
  }
}
