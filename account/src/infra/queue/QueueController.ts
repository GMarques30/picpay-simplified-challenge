import { Queue } from "../../application/queue/queue";
import { CancelDeposit } from "../../application/usecase/CancelDeposit";
import { CancelTransfer } from "../../application/usecase/CancelTransfer";
import { CancelWithdraw } from "../../application/usecase/CancelWithdraw";

export class QueueController {
  constructor(
    readonly queue: Queue,
    readonly cancelDeposit: CancelDeposit,
    readonly cancelWithdraw: CancelWithdraw,
    readonly cancelTransfer: CancelTransfer
  ) {
    queue.consume(
      "transactionRejected.cancelTransaction",
      async (input: Input) => {
        if (input.transactionType === "deposit") {
          await this.cancelDeposit.execute(input);
        }
        if (input.transactionType === "withdraw") {
          await this.cancelWithdraw.execute(input);
        }
        if (input.transactionType === "transfer") {
          await this.cancelTransfer.execute(input);
        }
      }
    );
  }
}

type Input = {
  payerId: string;
  payeeId: string;
  transactionType: string;
  amount: number;
};
